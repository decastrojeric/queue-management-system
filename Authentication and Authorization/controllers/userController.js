import pool from "../config/db.js";
import { getAllUsers } from "../models/userModel.js";

export const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["patient", "doctor", "staff", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (req.user.id === userId) {
      return res.status(400).json({
        message: "You cannot modify your own role",
      });
    }

    

    const result = await pool.query(
      `UPDATE users
             SET role = $1
             WHERE id = $2
             RETURNING *`,
      [role, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Role updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};




export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await deleteUserById(id);

        if (!success) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

