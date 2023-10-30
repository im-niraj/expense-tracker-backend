const { isValidObjectId } = require("mongoose");
const expenseModel = require("../models/expenseModel");
const userModel = require("../models/userModel");
const expenseTYpeModel = require("../models/expenseTYpeModel");

const addExpense = async (req, res) => {
    try {
        let userId = req.params.userId;
        let { date, expenseTypeId, expenseAmount } = req.body;
        console.log(userId);
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" });
        }
        if (!date || !expenseTypeId || !expenseAmount) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }
        if (!isValidObjectId(expenseTypeId)) {
            return res.status(400).send({ status: false, message: "Invalid expense object id" });
        }
        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid user id" });
        }
        let expenseTypeIdObj = await expenseTYpeModel.findById(expenseTypeId);
        if (!expenseTypeId) {
            return res.status(400).send({ status: false, message: "Invalid expense type id" });
        }
        let expense = await expenseModel.create({ userId: user._id, expenseType: expenseTypeIdObj.id, expenseAmount, date });
        return res.status(201).send({ status: true, message: "Expense added" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        let userId = req.params.userId;
        let expenseId = req.params.expenseId;
        if (!isValidObjectId(expenseId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid expense object id" });
        }
        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid user id" });
        }
        let expenseObj = await expenseModel.findOne({ _id: expenseId, userId: userId });
        if (!expenseObj) {
            return res.status(400).send({ status: false, message: "Invalid expense id" });
        }
        if (expenseObj.userId) expenseObj.isDeleted = true;
        expenseObj.save();
        return res.status(202).send({ status: true, message: "Expense Deleted successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getExpenseByUserId = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid expense object id" });
        }
        let expenses = await expenseModel.find({ userId, isDeleted: false }).populate("expenseType");
        return res.status(202).send({ status: true, data: expenses, message: "Expense fetched" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
const getAllExpense = async (req, res) => {
    try {
        let expenses = await expenseModel.find({ isDeleted: false }).populate(["userId", "expenseType"]);
        return res.status(202).send({ status: true, data: expenses, message: "Expense fetched" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = { addExpense, deleteExpense, getExpenseByUserId, getAllExpense };
