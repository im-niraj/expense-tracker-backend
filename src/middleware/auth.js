const jwt = require("jsonwebtoken");

// AUTHENTICATION
const Authentication = async (req, res, next) => {
    try {
        let tokenWithBearer = req.headers.authorization;
        if (!tokenWithBearer) {
            return res.status(400).send({ status: false, message: "token is required" });
        }

        let tokenArray = tokenWithBearer.split(" ");

        let token = tokenArray[1];

        if (!token) {
            return res.status(401).send({ status: false, message: "Invalid token" });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decode) {
            if (err) {
                return res.status(401).send({ status: false, message: "Token Expired" });
            } else {
                req.userId = decode.userId;
                next();
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { Authentication };
