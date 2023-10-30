const express = require("express");
const { createAdminAccount, getAllAdmin, adminLogin } = require("../controller/adminController");
const router = express.Router();

router.post("/create-admin/:key", createAdminAccount);
router.get("/get-all-admin/:key", getAllAdmin);
router.delete("/delete-admin/:adminId/:key", getAllAdmin);
router.post("/admin-login", adminLogin);

module.exports = router;
