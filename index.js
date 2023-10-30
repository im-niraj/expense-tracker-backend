const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
require("dotenv").config();

let mongoUrl = process.env.MONGO_URL;
let port = process.env.PORT;

mongoose
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(() => console.log("Connected with Database"))
    .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(express.static("public"));
app.use(fileUpload());

let userRoute = require("./src/routes/userRoute");
let adminRoute = require("./src/routes/adminRoute");
let settingRoute = require("./src/routes/settingRoute");
let expenseRoute = require("./src/routes/expenseRoute");

app.use("/", userRoute);
app.use("/", adminRoute);
app.use("/", settingRoute);
app.use("/", expenseRoute);

app.get("/", (req, res) => {
    res.send("<h1>Expense Tracker api is ready</h1>");
});

app.listen(port, () => console.log(`Server is up and running on port: ${port}`));
