const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "all fields are required" });
        }
        let user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid email id" });
        }
        if (user.isBlocked) {
            return res.status(400).send({ status: false, message: "Account has been blocked" });
        }
        if (password === user.password) {
            hasAccess();
        } else {
            return res.status(401).send({ status: false, message: "Incorrect Password" });
        }

        function hasAccess() {
            let date = Date.now();
            let data = {};
            data.name = user.name;
            data.email = user.email;
            data.mobile = user.mobile;
            data.accId = user._id;
            data.isAdmin = false;

            let issueTime = Math.floor(date / 1000);
            let token = jwt.sign(
                {
                    email: data.email,
                    accId: user._id.toString(),
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
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
const createUser = async (req, res) => {
    try {
        let { name, email, mobile, password } = req.body;
        console.log(req.body);
        if (!name || !email || !password) {
            return res.status(400).send({ message: "name, email and password are required" });
        }
        let x = await userModel.findOne({ email });
        if (x) {
            return res.status(400).send({ message: "Email already exists, please try different email address" });
        }
        let user = await userModel.create({ name, email, mobile, password });
        return res.status(200).send({ data: user, status: true, message: "User Details Updated" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
const blockUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user id" });
        }
        let user = await userModel.findById(userId);
        user.isBlocked = !user.isBlocked;
        await user.save();
        let message = `This user ${user.isBlocked ? "blocked" : "activated"} successfully`;
        return res.status(202).send({ status: true, message: message });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        let { name, email } = req.body;
        let user = await userModel.findOne({ userId: userId, isDeleted: false });
        if (!user) {
            return res.status(200).send({ message: "user not found with this user id" });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
        let data = {
            name: "",
            userId: user.userId,
            mobile: user.mobile,
            email: "",
            countryCode: user.countryCode,
        };
        if (user.name) data.name = user.name;
        if (user.email) data.email = user.email;
        return res.status(200).send({ ...data, status: true, message: "User Details Updated" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await userModel.findById(userId, { isDeleted: false });
        return res.status(200).send({ data: user, message: "User fetched successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getAllUser = async (req, res) => {
    try {
        let user = await userModel.find({ isDeleted: false });
        return res.status(200).send({ data: user, message: "User fetched successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getDateStrToMS = (dateStr) => {
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth() + 1;
    let day = dateStr.getDate();
    let dateString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    let date = new Date(dateString);
    return date.getTime();
};

module.exports = { getUserById, loginUser, updateUser, getAllUser, createUser, blockUser };
