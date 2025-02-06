"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../configs/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const salt = 10;
const register = (req, res) => {
    const { username, password, confirmationPassword } = req.body;
    db_1.connection.getConnection((err, conn) => {
        conn.release();
        if (password !== confirmationPassword) {
            return res.status(400).send({
                message: "Password and confirmation password doesn't match!"
            });
        }
        const sql = "INSERT INTO users (`username`, `password`, `profile`) VALUES (?)";
        bcrypt_1.default.hash(password.toString(), salt, (err, hash) => {
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            }
            const nameImage = username.split(" ").join("+");
            let image = `https://ui-avatars.com/api/?name=${nameImage}&background=3886DE&color=fff&bold=true&font-size=0.4`;
            const values = [username, hash, image];
            conn.query(sql, [values], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: "INTERNAL SERVER ERROR",
                        result: null,
                    });
                }
                else {
                    res.status(201).send({
                        message: "OK",
                    });
                }
            });
        });
    });
};
const login = (req, res) => {
    const { password } = req.body;
    const foundUser = req.foundUser;
    db_1.connection.getConnection((err, conn) => {
        conn.release();
        if (foundUser) {
            bcrypt_1.default.compare(password.toString(), foundUser.password, (err, response) => {
                if (err) {
                    return res.status(400).send({
                        message: "Invalid password"
                    });
                }
                if (response) {
                    const username = foundUser.username;
                    const token = jsonwebtoken_1.default.sign({ username, userId: foundUser.id }, "jwt-secret-key", {
                        expiresIn: "1d",
                    });
                    return res.status(200).json({
                        message: "OK",
                        accessToken: token
                    });
                }
            });
        }
    });
};
const getDataFromToken = (req, res) => {
    db_1.connection.getConnection((err, conn) => {
        conn.release();
        const sql = "SELECT * FROM users WHERE id = ?";
        conn.query(sql, req.userId, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                });
            }
            const sql2 = "SELECT restaurants.id FROM restaurants JOIN users ON restaurants.user_id = users.id WHERE user_id = ?;";
            conn.query(sql2, req.userId, (err2, restaurant_id) => {
                if (err2) {
                    res.status(500).send({
                        message: "INTERNAL SERVER ERROR",
                        result: null
                    });
                }
                if (restaurant_id.length > 0) {
                    return res.status(200).send({
                        message: "User with restaurant found",
                        result: Object.assign(Object.assign({}, result[0]), { restaurant_id: restaurant_id[0].id }),
                    });
                }
                res.status(200).send({
                    message: "User without restaurant found",
                    result: result[0],
                });
            });
        });
    });
};
exports.default = { register, login, getDataFromToken };
