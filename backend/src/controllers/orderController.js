const Stock = require("../models/Stock");
const User = require("../models/User");
const Holding = require("../models/Holding");
const Order = require("../models/Order");

// Market Buy Order
exports.marketBuy = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1. Get stock price
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const price = stock.price;
    const totalCost = price * quantity;

    // 2. Check wallet balance
    const user = await User.findById(req.userId);
    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 3. Deduct balance
    user.walletBalance -= totalCost;
    await user.save();

    // 4. Update holdings
    let holding = await Holding.findOne({
      userId: req.userId,
      stockSymbol: symbol,
    });

    if (holding) {
      const newQty = holding.quantity + quantity;
      const newAvg =
        (holding.avgPrice * holding.quantity + price * quantity) / newQty;

      holding.quantity = newQty;
      holding.avgPrice = newAvg;
      await holding.save();
    } else {
      holding = await Holding.create({
        userId: req.userId,
        stockSymbol: symbol,
        quantity,
        avgPrice: price,
      });
    }

    // 5. Create order record
    await Order.create({
      userId: req.userId,
      stockSymbol: symbol,
      orderType: "MARKET",
      side: "BUY",
      quantity,
      price,
      status: "COMPLETED",
    });

    res.json({
      message: "Market buy order executed",
      balance: user.walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Holdings (SEPARATE FUNCTION)
exports.getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find({ userId: req.userId });
    res.json(holdings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Market Sell Order
exports.marketSell = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1. Check holding
    const holding = await Holding.findOne({
      userId: req.userId,
      stockSymbol: symbol,
    });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock quantity" });
    }

    // 2. Get current price
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const sellValue = stock.price * quantity;

    // 3. Credit wallet
    const user = await User.findById(req.userId);
    user.walletBalance += sellValue;
    await user.save();

    // 4. Update holdings
    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    // 5. Record order
    await Order.create({
      userId: req.userId,
      stockSymbol: symbol,
      orderType: "MARKET",
      side: "SELL",
      quantity,
      price: stock.price,
      status: "COMPLETED",
    });

    res.json({
      message: "Market sell order executed",
      balance: user.walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Order History
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Place Limit Order
exports.placeLimitOrder = async (req, res) => {
  try {
    const { symbol, quantity, price, side } = req.body;

    if (!symbol || !quantity || !price || !side) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (!["BUY", "SELL"].includes(side)) {
      return res.status(400).json({ message: "Invalid order side" });
    }

    // Check stock exists
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const user = await User.findById(req.userId);

    // BUY limit → reserve money
    if (side === "BUY") {
      const requiredAmount = price * quantity;
      if (user.walletBalance < requiredAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Reserve funds
      user.walletBalance -= requiredAmount;
      await user.save();
    }

    // SELL limit → check holdings
    if (side === "SELL") {
      const holding = await Holding.findOne({
        userId: req.userId,
        stockSymbol: symbol,
      });

      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock quantity" });
      }

      // Reserve stocks
      holding.quantity -= quantity;
      await holding.save();
    }

    // Create OPEN limit order
    const order = await Order.create({
      userId: req.userId,
      stockSymbol: symbol,
      orderType: "LIMIT",
      side,
      quantity,
      price,
      status: "OPEN",
    });

    res.json({
      message: "Limit order placed",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Open Orders
exports.getOpenOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
      status: "OPEN",
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
