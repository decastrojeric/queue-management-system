import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { assignRole } from "../controllers/userController.js";
import { getUsers } from "../controllers/userController.js";
import { deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get(
    "/admin-only",
    authMiddleware,
    roleMiddleware(["admin"]),
    (req, res) => {
        res.json({
            message: "Welcome Admin",
            user: req.user
        });
    }
);

router.get(
    "/doctor-area",
    authMiddleware,
    roleMiddleware(["doctor", "admin"]),
    (req, res) => {
        res.json({
            message: "Doctor dashboard",
            user: req.user
        });
    }
);

router.patch(
    "/users/:userId/role",
    authMiddleware,
    roleMiddleware(["admin"]),
    assignRole
);

router.get(
    "/all", 
    getUsers
);

router.post(
    "/getuser",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "User retrieved successfully",
            user: req.user
        });
    }
)

router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    deleteUser
);

export default router;
