const db = require("../../config/db");

// In-memory fallback store used when DB is unavailable (development mode)
const inMemoryStore = {
    queues: [],
    nextId: 1
};

// Allow forcing in-memory mode for development: set FORCE_IN_MEMORY=true
let dbAvailable = !(process.env.FORCE_IN_MEMORY === 'true');

// Check DB connection quickly; if it throws on use, we'll flip to memory mode.
if (dbAvailable) {
    try {
        // simple presence check; true availability is caught at query time
        if (!db) throw new Error("DB not initialized");
    } catch (err) {
        dbAvailable = false;
    }
}

const createQueue = (appointment_id, patient_id, queue_number, callback) => {
    if (!dbAvailable) {
        const record = {
            id: inMemoryStore.nextId++,
            appointment_id,
            patient_id,
            queue_number,
            status: "pending",
            created_at: new Date()
        };
        inMemoryStore.queues.push(record);
        return callback(null, { insertId: record.id });
    }

    const sql = `
        INSERT INTO queues
        (appointment_id, patient_id, queue_number)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [appointment_id, patient_id, queue_number],
        (err, result) => {
            if (err && err.fatal) {
                // switch to memory mode and persist in-memory
                dbAvailable = false;
                const record = {
                    id: inMemoryStore.nextId++,
                    appointment_id,
                    patient_id,
                    queue_number,
                    status: "pending",
                    created_at: new Date()
                };
                inMemoryStore.queues.push(record);
                return callback(null, { insertId: record.id });
            }
            return callback(err, result);
        }
    );
};

const getPendingQueues = (callback) => {
    if (!dbAvailable) {
        const results = inMemoryStore.queues
            .filter(q => q.status === 'pending')
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        return callback(null, results);
    }

    const sql = `
        SELECT * FROM queues
        WHERE status = 'pending'
        ORDER BY created_at ASC
    `;

    db.query(sql, (err, results) => {
        if (err && err.fatal) {
            dbAvailable = false;
            const fallback = inMemoryStore.queues
                .filter(q => q.status === 'pending')
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            return callback(null, fallback);
        }
        return callback(err, results);
    });
};

const callQueue = (id, callback) => {
    if (!dbAvailable) {
        const idx = inMemoryStore.queues.findIndex(q => String(q.id) === String(id));
        if (idx === -1) return callback(new Error('Not found'));
        inMemoryStore.queues[idx].status = 'ongoing';
        return callback(null, { affectedRows: 1 });
    }

    const sql = `
        UPDATE queues
        SET status = 'ongoing'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err && err.fatal) {
            dbAvailable = false;
            const idx = inMemoryStore.queues.findIndex(q => String(q.id) === String(id));
            if (idx === -1) return callback(new Error('Not found'));
            inMemoryStore.queues[idx].status = 'ongoing';
            return callback(null, { affectedRows: 1 });
        }
        return callback(err, result);
    });
};

const getOngoingQueues = (callback) => {
    if (!dbAvailable) {
        const results = inMemoryStore.queues
            .filter(q => q.status === 'ongoing')
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        return callback(null, results);
    }

    const sql = `
        SELECT * FROM queues
        WHERE status = 'ongoing'
        ORDER BY created_at ASC
    `;

    db.query(sql, (err, results) => {
        if (err && err.fatal) {
            dbAvailable = false;
            const fallback = inMemoryStore.queues
                .filter(q => q.status === 'ongoing')
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            return callback(null, fallback);
        }
        return callback(err, results);
    });
};

const completeQueue = (id, callback) => {
    if (!dbAvailable) {
        const idx = inMemoryStore.queues.findIndex(q => String(q.id) === String(id));
        if (idx === -1) return callback(new Error('Not found'));
        inMemoryStore.queues[idx].status = 'completed';
        return callback(null, { affectedRows: 1 });
    }

    const sql = `
        UPDATE queues
        SET status = 'completed'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err && err.fatal) {
            dbAvailable = false;
            const idx = inMemoryStore.queues.findIndex(q => String(q.id) === String(id));
            if (idx === -1) return callback(new Error('Not found'));
            inMemoryStore.queues[idx].status = 'completed';
            return callback(null, { affectedRows: 1 });
        }
        return callback(err, result);
    });
};

module.exports = {
    createQueue,
    getPendingQueues,
    callQueue,
    getOngoingQueues,
    completeQueue
};