import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.get("/test", (req, res) => {
    console.log("TEST HIT");
    res.json({ ok: true });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});