const axios = require('axios');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const AUTH = { Authorization: process.env.AUTH_TOKEN || 'Bearer qms-secret-token' };

const run = async () => {
  try {
    console.log('1) Generate queue');
    const gen = await axios.post(
      `${BASE}/queue/generate`,
      { appointment_id: 123 },
      { headers: AUTH }
    );
    console.log('  ->', gen.data);

    console.log('2) Get pending queues');
    const pending = await axios.get(`${BASE}/queue/pending`, { headers: AUTH });
    console.log('  ->', pending.data);

    const id = pending.data.queues && pending.data.queues[0] && pending.data.queues[0].id;
    if (!id) {
      console.warn('No queue id available to continue call/complete flow. Ending smoke test.');
      return;
    }

    console.log('3) Call queue (set ongoing) id=', id);
    const call = await axios.put(`${BASE}/queue/call/${id}`, {}, { headers: AUTH });
    console.log('  ->', call.data);

    console.log('4) Get ongoing queues');
    const ongoing = await axios.get(`${BASE}/queue/ongoing`, { headers: AUTH });
    console.log('  ->', ongoing.data);

    console.log('5) Complete queue id=', id);
    const complete = await axios.put(`${BASE}/queue/complete/${id}`, {}, { headers: AUTH });
    console.log('  ->', complete.data);

    console.log('\nSmoke test completed successfully.');
  } catch (err) {
    console.error('Smoke test failed:', err.response ? err.response.data : err.message);
    process.exit(2);
  }
};

run();
