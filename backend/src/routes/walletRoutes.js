const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBalance,
  addMoney,
  withdrawMoney,
} = require("../controllers/walletController");

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/add", authMiddleware, addMoney);
router.post("/withdraw", authMiddleware, withdrawMoney);

module.exports = router;
