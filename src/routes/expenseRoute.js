const express = require("express");
const { Authentication } = require("../middleware/auth");
const { addExpense, deleteExpense, getExpenseByUserId } = require("../controller/expenseController");
const router = express.Router();

router.post("/addExpense/:userId", Authentication, addExpense);
router.delete("/deleteExpense/:userId/:expenseId", Authentication, deleteExpense);
router.get("/getExpense/:userId/", Authentication, getExpenseByUserId);
module.exports = router;
