// 1️⃣ Load env variables FIRST
require("dotenv").config();

// 2️⃣ Import app AFTER dotenv
const app = require("./src/app");

// 3️⃣ Read PORT from env
const PORT = process.env.PORT || 5000;

// 4️⃣ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
