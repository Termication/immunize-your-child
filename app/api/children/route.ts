import express from 'express'
import { neon } from '@neondatabase/serverless'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const router = express.Router()
const sql = neon(process.env.DATABASE_URL)

router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId
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
    } = req.body || {}

    // Validation
    if (!mother_name || !father_name || !child_first_name || !child_surname || !dob) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' })
    }

    // Insert into Neon
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

    return res.status(201).json({
      id: rows[0].id,
      message: 'Child added successfully',
    })
  } catch (err) {
    console.error('Error saving child:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
