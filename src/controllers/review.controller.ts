import { Request, Response } from "express";
import { Review, Prediction } from "../models/review";
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

const createReview = (req: Request, res: Response) => {
    const { data } = req.body; 
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        const values = data.map(({username, restaurant_id,  time_review, body, sentiment}: Prediction) => 
            [username, restaurant_id, body, sentiment, time_review]);
        const sql = "INSERT INTO reviews (username, restaurant_id, body, sentiment, time_review) VALUES ?";
        conn.query(sql, [values], (err, result: any) => {
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
        })
    })
}


export default { getAll, createReview };