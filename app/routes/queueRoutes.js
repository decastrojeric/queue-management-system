const express = require("express");

const router = express.Router();

const queueController = require("../controllers/queueController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/generate",
    authMiddleware,
    queueController.generateQueue
);

router.get(
    "/pending",
    authMiddleware,
    queueController.getPendingQueues
);

router.put(
    "/call/:id",
    authMiddleware,
    queueController.callQueue
);

router.get(
    "/ongoing",
    authMiddleware,
    queueController.getOngoingQueues
);

router.put(
    "/complete/:id",
    authMiddleware,
    queueController.completeQueue
);

module.exports = router;