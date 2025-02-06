import { Request, Response, NextFunction } from "express";
import { connection } from "../configs/db";
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";
import jwt from "jsonwebtoken";

export interface User {
    id: number;
    username: string;
    password: string;
    profile?: string;
    created_at: string;
};

export const getUserByUsername = (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    connection.getConnection((err, conn: PoolConnection) => {
        conn.query("SELECT * FROM users WHERE username = ?", username, (err, result: any) => {
            conn.release();

            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                })
            }
            if (result.length > 0) {
                req.foundUser = result[0];
                return next();
            } else {
                return res.status(404).send({
                    message: "User not found"
                })
            }
        } )
    })
}

export const checkDuplicateUsername = (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    
    connection.getConnection(async (err, conn: PoolConnection) => {
        const sql = "SELECT * FROM users WHERE username = ?"
        conn.query(sql, username, (err, result: any) => {
            conn.release();
            
            if (err) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                })
            } 
            if (result.length > 0) {
                return res.status(400).send({
                    message: "Username already in use",
                    result: null
                })
            }
            return next();
        });
    })
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const tokenWithBearer = req.headers.authorization;
    const token = tokenWithBearer?.slice(7);

    if (!token) {
        res.status(401).send({ message: "Authorization token is missing or invalid"});
        return;
    } 
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Token is invalid",
                result: null,
            });
        }
        req.username = (decoded as any).username;
        req.userId = (decoded as any).userId;
        next();
    });
}
