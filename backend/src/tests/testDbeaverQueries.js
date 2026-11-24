const prisma = require('../config/db');

async function testQueries() {
  console.log('Testing queries as executed in DBeaver:');

  // Query 1
  const q1 = await prisma.$queryRawUnsafe(`
    SELECT id, name, status, department, jsonb_array_length(fields) AS field_count, created_at 
    FROM forms;
  `);
  console.log('Query 1 Success! Forms found:', q1.length);
  console.log(q1);

  // Query 2
  const q2 = await prisma.$queryRawUnsafe(`
    SELECT id, form_id, data, submitted_at, ip_address 
    FROM submissions 
    ORDER BY submitted_at DESC;
  `);
  console.log('Query 2 Success! Submissions found:', q2.length);

  // Query 3
  const q3 = await prisma.$queryRawUnsafe(`
    SELECT 
        id, 
        data->>'firstName' AS first_name, 
        data->>'email' AS email, 
        data->>'gender' AS gender,
        submitted_at
    FROM submissions
    WHERE data->>'gender' = 'Female';
  `);
  console.log('Query 3 Success! Filtered JSONB submissions found:', q3.length);
  console.log(q3);

  console.log('ALL 3 DBEAVER QUERIES EXECUTED PERFECTLY WITH ZERO ERRORS!');
}

testQueries()
  .catch((err) => {
    console.error('Error running queries:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
