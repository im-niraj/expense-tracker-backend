const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseTYpeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
module.exports = mongoose.model("ExpenseType", expenseTYpeSchema);
