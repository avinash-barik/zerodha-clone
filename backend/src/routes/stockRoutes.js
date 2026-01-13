const express = require("express");
const { getStocks, updatePrice } = require("../controllers/stockController");

const router = express.Router();

router.get("/", getStocks);
router.post("/update", updatePrice);

module.exports = router;
