const express = require("express");
const { Authentication } = require("../middleware/auth");
const { addExpenseType, updateExpenseType, deleteExpenseType, getExpenseType } = require("../controller/settingController");
const router = express.Router();

router.post("/addExpenseType", Authentication, addExpenseType);
router.put("/updateExpenseType/:typeId", Authentication, updateExpenseType);
router.delete("/deleteExpenseType/:typeId", Authentication, deleteExpenseType);
router.get("/allExpenseType", Authentication, getExpenseType);

module.exports = router;
