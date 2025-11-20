import { neon } from '@neondatabase/serverless'
import { auth } from '@clerk/nextjs/server' // <--- Updated Import

export async function POST(req: Request) {
  try {
    // --- 1. Verify Authentication (The "Next.js way") ---
    // This automatically checks headers/cookies for the session
    const { userId } = await auth()
      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    // --- 2. Parse the request body ---
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

    // --- 3. Validate required fields ---
    if (!mother_name || !father_name || !child_first_name || !child_surname || !dob) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // --- 4. Validate date format ---
    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format (expected YYYY-MM-DD)' }),
        { status: 400 }
      )
    }

    // --- 5. Connect to Neon ---
    const sql = neon(process.env.DATABASE_URL!)

    // --- 6. Insert the child record ---
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

    // --- 7. Get the created child record ---
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