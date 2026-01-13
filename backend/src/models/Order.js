const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      required: true,
    },
    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "OPEN"],
      default: "COMPLETED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
