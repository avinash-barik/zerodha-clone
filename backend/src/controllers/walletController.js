const User = require("../models/User");

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("walletBalance");
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add money to wallet
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.userId);
    user.walletBalance += amount;
    await user.save();

    res.json({
      message: "Money added successfully",
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Withdraw money from wallet
exports.withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.userId);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.walletBalance -= amount;
    await user.save();

    res.json({
      message: "Money withdrawn successfully",
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
