const { isValidObjectId } = require("mongoose");
const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdminAccount = async (req, res) => {
    try {
        let secretKey = req.params.key;
        if (secretKey !== process.env.SECRET_KEY) {
            return res.status(401).send({ status: false, message: "Unauthorized access" });
        }

        let { name, mobile, email, password } = req.body;
        if (!name || !mobile || !email || !password) {
            return res.status(400).send({ status: false, message: "all fields are required" });
        }
        let admin = await adminModel.findOne({ email: email });

        if (admin) {
            return res.status(400).send({ status: false, message: "Email already exists" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.create({ name, mobile, email, password: hashedPassword });
        return res.status(201).send({ status: true, message: "Admin created successfully..." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const deleteAdminById = async (req, res) => {
    try {
        let secretKey = req.params.key;
        let adminId = req.params.adminId;
        if (secretKey !== process.env.SECRET_KEY) {
            return res.status(401).send({ status: false, message: "Unauthorized access" });
        }
        if (!isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: "Bad request, admin id invalid" });
        }
        let admin = await adminModel.findOneAndDelete({ _id: adminId });
        if (!admin) {
            return res.status(400).send({ status: false, message: "Bad request" });
        }
        return res.status(201).send({ status: true, message: "Admin deleted successfully..." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getAllAdmin = async (req, res) => {
    try {
        let secretKey = req.params.key;
        if (secretKey !== process.env.SECRET_KEY) {
            return res.status(401).send({ status: false, message: "Unauthorized access" });
        }
        let admins = await adminModel.find();

        return res.status(201).send({ status: true, data: admins, message: "Admin deleted successfully..." });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "all fields are required" });
        }
        let admin = await adminModel.findOne({ email });
        console.log(email, password);
        if (!admin) {
            return res.status(400).send({ status: false, message: "Invalid Email Id" });
        }
        bcrypt.compare(password, admin.password, function (err, result) {
            if (err) {
                return res.status(400).send({ status: false, message: err.message });
            }
            hasAccess(result);
        });

        function hasAccess(result) {
            if (result) {
                let date = Date.now();
                let data = {};
                data.name = admin.name;
                data.email = admin.email;
                data.mobile = admin.mobile;
                data.accId = admin._id;
                data.isAdmin = true;

                let issueTime = Math.floor(date / 1000);
                let token = jwt.sign(
                    {
                        email: data.email,
                        accId: admin._id.toString(),
                        iat: issueTime,
                    },
                    process.env.TOKEN_SECRET_KEY,
                    { expiresIn: "12h" }
                );
                data.token = token;
                res.setHeader("Authorization", "Bearer", token);
                return res.status(200).send({
                    status: false,
                    message: "Successfully logged in",
                    data: data,
                });
            } else {
                return res.status(401).send({ status: false, message: "Incorrect Password" });
            }
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = { deleteAdminById, createAdminAccount, getAllAdmin, adminLogin };
