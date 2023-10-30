const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required:true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
