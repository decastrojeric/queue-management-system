const express = require("express");
const cors = require("cors");

require("./config/db");

const queueRoutes = require("./app/routes/queueRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/queue", queueRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Queue Management System API  Running"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});