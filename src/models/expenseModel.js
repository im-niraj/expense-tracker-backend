const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        expenseType: {
            type: ObjectId,
            ref: "ExpenseType",
            required: true,
        },
        expenseAmount: {
            type: Number,
            required: true,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Expense", expenseSchema);
