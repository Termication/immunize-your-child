import { auth } from '@clerk/nextjs/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return new Response('Unauthorized', { status: 401 })

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

    if (!mother_name || !father_name || !child_first_name || !child_surname || !dob) {
      return new Response('Missing required fields', { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql<{ id: string }[]>`
      insert into children (
        user_id, mother_name, father_name,
        child_first_name, child_surname, dob,
        id_number, weight_kg, location,
        birth_order, place_of_birth
      ) values (
        ${userId}, ${mother_name}, ${father_name},
        ${child_first_name}, ${child_surname}, ${dob},
        ${id_number}, ${weight_kg}, ${location},
        ${birth_order}, ${place_of_birth}
      )
      returning id
    `

    return Response.json({ id: rows[0].id }, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return new Response('Server error', { status: 500 })
  }
}