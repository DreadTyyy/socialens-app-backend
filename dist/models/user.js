"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.checkDuplicateUsername = exports.getUserByUsername = void 0;
const db_1 = require("../configs/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
;
const getUserByUsername = (req, res, next) => {
    const { username } = req.body;
    db_1.connection.getConnection((err, conn) => {
        conn.query("SELECT * FROM users WHERE username = ?", username, (err, result) => {
            conn.release();
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                });
            }
            if (result.length > 0) {
                req.foundUser = result[0];
                return next();
            }
            else {
                return res.status(404).send({
                    message: "User not found"
                });
            }
        });
    });
};
exports.getUserByUsername = getUserByUsername;
const checkDuplicateUsername = (req, res, next) => {
    const { username } = req.body;
    db_1.connection.getConnection((err, conn) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "SELECT * FROM users WHERE username = ?";
        conn.query(sql, username, (err, result) => {
            conn.release();
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                });
            }
            if (result.length > 0) {
                return res.status(400).send({
                    message: "Username already in use",
                    result: null
                });
            }
            return next();
        });
    }));
};
exports.checkDuplicateUsername = checkDuplicateUsername;
const verifyUser = (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    const token = tokenWithBearer === null || tokenWithBearer === void 0 ? void 0 : tokenWithBearer.slice(7);
    if (!token) {
        res.status(401).send({ message: "Authorization token is missing or invalid" });
        return;
    }
    jsonwebtoken_1.default.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Token is invalid",
                result: null,
            });
        }
        req.username = decoded.username;
        req.userId = decoded.userId;
        next();
    });
};
exports.verifyUser = verifyUser;
