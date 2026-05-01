const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

//  ISME CODE CHAL RHA THA BUT DEPLOY KRNE PR NAHI CHAL RHA THA TOH MAINE COMMENT KR DIYA HAI, AND GPT KA CODE DAL DIYA HAI

// async function authUser(req, res, next) {

//     const token = req.cookies.token

//     if (!token) {
//         return res.status(401).json({
//             message: "Token not provided."
//         })
//     }

//     const isTokenBlacklisted = await tokenBlacklistModel.findOne({
//         token
//     })

//     if (isTokenBlacklisted) {
//         return res.status(401).json({
//             message: "token is invalid"
//         })
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)

//         req.user = decoded

//         next()

//     } catch (err) {

//         return res.status(401).json({
//             message: "Invalid token."
//         })
//     }

// }



const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");

module.exports.authUser = async (req, res, next) => {
    try {
        // 1. Token nikalna (Cookie se ya Header se)
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // 2. Blacklist check
        const isBlacklisted = await blacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
        }

        // 3. Token verify karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. User dhundna
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // 5. User ko request object mein daalna
        req.user = user;
        next();

    } catch (err) {
        console.error("AUTH ERROR:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


module.exports = { authUser }