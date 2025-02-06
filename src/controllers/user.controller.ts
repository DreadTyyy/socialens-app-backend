import { Request, Response } from "express";
import { User } from "../models/user";
import { connection } from "../configs/db";
import { PoolConnection } from "mysql2";

const getAll = (req: Request, res: Response) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        conn.query("SELECT * FROM users", (err, result: User) => {
            conn.release();

            if (err) {
                res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            } else {
                res.status(200).send({
                    message: "OK",
                    result,
                });
            }
        });
    });
}

export default { getAll };