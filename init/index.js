const mongoose = require("mongoose");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/brightlife";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  const user = await User.updateMany({}, { $set: { isvalid: true } });
};

initDB();
