const express = require("express");
const { getUserById, loginUser, updateUser, getAllUser, createUser, blockUser } = require("../controller/userController");
const { Authentication } = require("../middleware/auth");
const router = express.Router();

router.post("/login", loginUser);
router.post("/update/:userId", updateUser);
router.get("/get-user/:userId", getUserById);
router.get("/get-all-user", Authentication, getAllUser);
router.post("/create-user", Authentication, createUser);
router.put("/block-user/:userId", Authentication, blockUser);

module.exports = router;
