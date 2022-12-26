const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: Number,
      required: true,
    },
    userAddress: {
      type: String,
      required: true,
    },
    productsId: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
