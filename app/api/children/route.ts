import { neon } from '@neondatabase/serverless'
import { verifyToken } from '@clerk/backend'

export async function POST(req: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Verify the token using Clerk backend
    const { userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

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

    // Validate required fields
    if (!mother_name || !father_name || !child_first_name || !child_surname || !dob) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Validate date format
    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format' }),
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Insert the child record
    const rows = await sql`
      INSERT INTO children (
        user_id, mother_name, father_name,
        child_first_name, child_surname, dob,
        id_number, weight_kg, location,
        birth_order, place_of_birth, created_at
      ) VALUES (
        ${userId}, ${mother_name}, ${father_name},
        ${child_first_name}, ${child_surname}, ${dob},
        ${id_number || null}, ${weight_kg || null}, ${location || null},
        ${birth_order}, ${place_of_birth || null}, NOW()
      )
      RETURNING id
    `

    const created = rows as Array<{ id: string }>

    if (!created || created.length === 0) {
      throw new Error('Failed to create child record')
    }

    return Response.json(
      {
        id: created[0].id,
        message: 'Child added successfully',
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('Database error:', e)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? e.message : undefined,
      }),
      { status: 500 }
    )
  }
}
