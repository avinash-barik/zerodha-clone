const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  marketBuy,
  marketSell,
  getHoldings,
  getOrders,
  placeLimitOrder,
  getOpenOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/buy/market", authMiddleware, marketBuy);
router.post("/sell/market", authMiddleware, marketSell);

router.post("/limit", authMiddleware, placeLimitOrder);

router.get("/holdings", authMiddleware, getHoldings);
router.get("/history", authMiddleware, getOrders);
router.get("/open", authMiddleware, getOpenOrders);

module.exports = router;
