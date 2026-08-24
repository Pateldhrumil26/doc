"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, email) => {
    const secret = process.env.JWT_SECRET || 'super_secret_letterpad_jwt_key_2026_dev_prod';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ userId: userId.toString(), email }, secret, {
        expiresIn: expiresIn,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'super_secret_letterpad_jwt_key_2026_dev_prod';
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
