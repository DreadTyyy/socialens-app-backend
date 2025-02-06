"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../configs/db");
const getAll = (req, res) => {
    db_1.connection.getConnection((err, conn) => {
        conn.query("SELECT * FROM users", (err, result) => {
            conn.release();
            if (err) {
                res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            }
            else {
                res.status(200).send({
                    message: "OK",
                    result,
                });
            }
        });
    });
};
exports.default = { getAll };
