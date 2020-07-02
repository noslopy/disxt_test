const mongoose = require("mongoose");

exports.reset = async () => {
  mongoose.connect(process.env.MONGO_URI, function () {
    mongoose.connection.db.dropDatabase();
    console.log("DB reset");
  });
};
