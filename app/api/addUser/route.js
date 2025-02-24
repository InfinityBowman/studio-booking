import db from '~/database/db';

export async function POST(req, res) {
  const { name, email } = await req.json();

  const queryText = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];

  try {
    const result = await db.query(queryText, values);
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error adding user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
