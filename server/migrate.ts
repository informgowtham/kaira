import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pool } from './db'

async function run() {
  const sqlDir = path.join(process.cwd(), 'server/sql')
  const files = (await fs.readdir(sqlDir)).filter((f) => f.endsWith('.sql')).sort()
  for (const file of files) {
    const full = path.join(sqlDir, file)
    const sql = await fs.readFile(full, 'utf8')
    await pool.query(sql)
    console.log(`Applied migration: ${file}`)
  }
  await pool.end()
}

run().catch(async (error) => {
  console.error(error)
  await pool.end()
  process.exit(1)
})
