const Stock = require("../models/Stock");
const Order = require("../models/Order");
const Holding = require("../models/Holding");
const User = require("../models/User");

// ✅ GET ALL STOCKS (THIS WAS MISSING)
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE PRICE + EXECUTE LIMIT ORDERS
exports.updatePrice = async (req, res) => {
  try {
    const { symbol, price } = req.body;

    if (!symbol || !price || price <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const stock = await Stock.findOneAndUpdate(
      { symbol },
      { price },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const openOrders = await Order.find({
      stockSymbol: symbol,
      orderType: "LIMIT",
      status: "OPEN",
    });

    for (const order of openOrders) {
      // BUY limit
      if (order.side === "BUY" && price <= order.price) {
        let holding = await Holding.findOne({
          userId: order.userId,
          stockSymbol: symbol,
        });

        if (holding) {
          const newQty = holding.quantity + order.quantity;
          const newAvg =
            (holding.avgPrice * holding.quantity +
              order.price * order.quantity) /
            newQty;

          holding.quantity = newQty;
          holding.avgPrice = newAvg;
          await holding.save();
        } else {
          await Holding.create({
            userId: order.userId,
            stockSymbol: symbol,
            quantity: order.quantity,
            avgPrice: order.price,
          });
        }

        order.status = "COMPLETED";
        await order.save();
      }

      // SELL limit
      if (order.side === "SELL" && price >= order.price) {
        const user = await User.findById(order.userId);
        user.walletBalance += order.price * order.quantity;
        await user.save();

        order.status = "COMPLETED";
        await order.save();
      }
    }

    res.json({
      message: "Price updated and limit orders evaluated",
      price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
