const mongoose = require("mongoose");
const Stock = require("../src/models/Stock");
require("dotenv").config({ path: "../.env" });

const stocks = [
  { symbol: "TATA", name: "Tata Motors", price: 100 },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2500 },
  { symbol: "INFY", name: "Infosys", price: 1500 },
];

async function seedStocks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Stock.deleteMany();
    await Stock.insertMany(stocks);

    console.log("✅ Stocks seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedStocks();
