const db = require("../../config/db");

const createQueue = (appointment_id, patient_id, queue_number, callback) => {

    const sql = `
        INSERT INTO queues
        (appointment_id, patient_id, queue_number)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [appointment_id, patient_id, queue_number],
        callback
    );
};

const getPendingQueues = (callback) => {

    const sql = `
        SELECT * FROM queues
        WHERE status = 'pending'
        ORDER BY created_at ASC
    `;

    db.query(sql, callback);

};

const callQueue = (id, callback) => {

    const sql = `
        UPDATE queues
        SET status = 'ongoing'
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};

const getOngoingQueues = (callback) => {

    const sql = `
        SELECT * FROM queues
        WHERE status = 'ongoing'
        ORDER BY created_at ASC
    `;

    db.query(sql, callback);

};

const completeQueue = (id, callback) => {

    const sql = `
        UPDATE queues
        SET status = 'completed'
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};

module.exports = {
    createQueue,
    getPendingQueues,
    callQueue,
    getOngoingQueues,
    completeQueue
};