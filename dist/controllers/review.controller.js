"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../configs/db");
const getAll = (req, res) => {
    db_1.connection.getConnection((err, conn) => {
        conn.query("SELECT * FROM reviews", (err, result) => {
            conn.release();
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            }
            if (result.length > 0) {
                res.status(200).send({
                    message: "OK",
                    result: result
                });
            }
            else {
                res.status(404).send({
                    message: "Review not found",
                    result: null
                });
            }
        });
    });
};
const createReview = (req, res) => {
    const { data } = req.body;
    db_1.connection.getConnection((err, conn) => {
        const values = data.map(({ username, restaurant_id, time_review, body, sentiment }) => [username, restaurant_id, body, sentiment, time_review]);
        const sql = "INSERT INTO reviews (username, restaurant_id, body, sentiment, time_review) VALUES ?";
        conn.query(sql, [values], (err, result) => {
            conn.release();
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            }
            res.status(201).send({
                message: "OK",
                result: result
            });
        });
    });
};
exports.default = { getAll, createReview };
