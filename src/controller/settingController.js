const { isValidObjectId } = require("mongoose");
const expenseTYpeModel = require("../models/expenseTYpeModel");

const addExpenseType = async (req, res) => {
    try {
        let { title } = req.body;
        if (!title) {
            return res.status(400).send({ status: false, message: "title required" });
        }
        await expenseTYpeModel.create({ title });
        return res.status(201).send({ status: true, message: "Expense type created" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const updateExpenseType = async (req, res) => {
    try {
        let typeId = req.params.typeId;
        if (!isValidObjectId(typeId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" });
        }
        let { title } = req.body;
        if (!title) {
            return res.status(400).send({ status: false, message: "title required" });
        }
        let expenseType = await expenseTYpeModel.findById(typeId);
        if (!expenseType) {
            return res.status(400).send({ status: false, message: "bad request" });
        }
        expenseType.title = title;
        await expenseType.save();
        return res.status(202).send({ status: true, message: "updated title" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const deleteExpenseType = async (req, res) => {
    try {
        let typeId = req.params.typeId;
        if (!isValidObjectId(typeId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" });
        }
        let expenseType = await expenseTYpeModel.findById(typeId);
        if (!expenseType) {
            return res.status(400).send({ status: false, message: "bad request" });
        }
        expenseType.isDeleted = true;
        await expenseType.save();
        return res.status(202).send({ status: true, message: "expense type deleted" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getExpenseType = async (req, res) => {
    try {
        let expenseType = await expenseTYpeModel.find({ isDeleted: false});
        return res.status(200).send({ status: true, data: expenseType, message: "expense type fetched" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = { addExpenseType, updateExpenseType, deleteExpenseType, getExpenseType };
