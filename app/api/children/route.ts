import { neon } from '@neondatabase/serverless'
import { verifyToken } from '@clerk/backend'

export async function POST(req: Request) {
  try {
    // --- 1. Get the token from Authorization header ---
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: missing token' }),
        { status: 401 }
      )
    }

    // Get the token
    const token = authHeader.split(' ')[1]

    // --- 2. Verify the token with Clerk ---
    const verification = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })

    const userId = verification?.sub // Clerk stores user ID in "sub"
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: invalid token' }),
        { status: 401 }
      )
    }

    // --- 3. Parse the request body ---
    const body = await req.json()
    const {
      mother_name,
      father_name,
      child_first_name,
      child_surname,
      dob,
      id_number,
      weight_kg,
      location,
      birth_order,
      place_of_birth,
    } = body || {}

    // --- 4. Validate required fields ---
    if (!mother_name || !father_name || !child_first_name || !child_surname || !dob) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // --- 5. Validate date format ---
    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format (expected YYYY-MM-DD)' }),
        { status: 400 }
      )
    }

    // --- 6. Connect to Neon ---
    const sql = neon(process.env.DATABASE_URL!)

    // --- 7. Insert the child record ---
    const result = await sql`
      INSERT INTO children (
        user_id, mother_name, father_name,
        child_first_name, child_surname, dob,
        id_number, weight_kg, location,
        birth_order, place_of_birth, created_at
      )
      VALUES (
        ${userId}, ${mother_name}, ${father_name},
        ${child_first_name}, ${child_surname}, ${dobDate},
        ${id_number || null}, ${weight_kg || null}, ${location || null},
        ${birth_order || null}, ${place_of_birth || null}, NOW()
      )
      RETURNING id
    `

    // --- 8. Get the created child record ---
    const created = result[0] as { id: string } | undefined
    if (!created) {
      throw new Error('Failed to insert record')
    }

    // --- 8. Success response ---
    return new Response(
      JSON.stringify({
        id: created.id,
        message: 'Child added successfully',
      }),
      { status: 201 }
    )
  } catch (e: any) {
    console.error('Database error:', e)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development'
            ? e.message || String(e)
            : undefined,
      }),
      { status: 500 }
    )
  }
}
