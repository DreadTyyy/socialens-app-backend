import { Request, Response } from "express";
import { Review } from "../models/review";
import { connection } from "../configs/db";
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

const getAll = (req: Request, res: Response) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        conn.query("SELECT * FROM reviews", (err, result: Review[]) => {
            conn.release();

            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null,
                });
            } 
            if(result.length > 0) {
                res.status(200).send({
                    message: "OK",
                    result: result
                });
            } else {
                res.status(404).send({
                    message: "Review not found",
                    result: null
                });
            }
        })
    })
}


export default { getAll };