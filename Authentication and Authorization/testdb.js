import connect from './config/db.js';


const testConnection = async () => {
  try {
    const client = await connect();

    const result = await client.query('SELECT NOW()');

    console.log('Connected to Supabase PostgreSQL!');
    console.log(result.rows);

    client.release();
  } catch (err) {
    console.error(err);
  }
};

testConnection();
