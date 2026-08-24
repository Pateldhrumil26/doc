"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_utils_js_1 = require("../utils/jwt.utils.js");
const User_js_1 = require("../models/User.js");
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_GUEST_ID = new mongoose_1.default.Types.ObjectId('000000000000000000000001');
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            try {
                const decoded = (0, jwt_utils_js_1.verifyToken)(token);
                const user = await User_js_1.User.findById(decoded.userId);
                if (user) {
                    req.user = user;
                    req.userId = user._id.toString();
                    return next();
                }
            }
            catch (err) {
                // Token invalid/expired - fall through to guest mode seamlessly
            }
        }
        // No token provided or token expired: use guest identifier
        const guestIdHeader = req.headers['x-guest-id'];
        if (guestIdHeader && mongoose_1.default.Types.ObjectId.isValid(guestIdHeader)) {
            req.userId = guestIdHeader;
        }
        else {
            req.userId = DEFAULT_GUEST_ID.toString();
        }
        next();
    }
    catch (error) {
        req.userId = DEFAULT_GUEST_ID.toString();
        next();
    }
};
exports.authenticate = authenticate;
