import validator from "validator";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const createUser = async (firstName, lastName, email, password) => {

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format");
    }

    if (!validator.isLength(password, { min: 6 })) {
        throw new Error("Password too short");
    }

    const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (existing.rows.length > 0) {
        const err = new Error("User already exists");
        err.status = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = "patient"; // default role

    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [firstName, lastName, email, hashedPassword]
    );

    return result.rows[0];
};


export const loginUser = async (email, password) => {

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    return user;
};

export const getAllUsers = async () => {
    const result = await pool.query("SELECT id, first_name, last_name, email, role FROM users");
    return result.rows;
};

export const getUserById = async (id) => {
    const result = await pool.query(
        "SELECT id, first_name, last_name, email, role FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const deleteUserById = async (id) => {
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
    );
    return result.rowCount > 0;
}
