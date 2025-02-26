import { Request, Response } from "express";
import { connection } from "../configs/db";
import { PoolConnection } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const salt = 10;

const register = (req: Request, res: Response) => {
    const { username, password, confirmationPassword } = req.body;

    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null
            });
        }
        conn.release();
        if (password !== confirmationPassword) {
            return res.status(400).send({
                message: "Password and confirmation password doesn't match!"
            });
        }
        
        const sql = "INSERT INTO users (`username`, `password`, `profile`) VALUES (?)";
        bcrypt.hash(password.toString(), salt, (err, hash: string) => {
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
                } else {
                    res.status(201).send({
                        message: "OK",
                    });
                }
            });
        });
    });
}

const login = (req: Request, res: Response) => {
    const { password } = req.body
    const foundUser = req.foundUser;
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null
            });
        }
        conn.release();

        if (foundUser) {
            bcrypt.compare(
                password.toString(), foundUser.password, (err, response) => {
                    if (err) {
                        return res.status(400).send({
                            message: "Invalid password"
                        });
                    }
                    if (response) {
                        const username = foundUser.username
                        const token = jwt.sign(
                            {username, userId: foundUser.id}, 
                            "jwt-secret-key",
                            {
                                expiresIn: "1d",
                            }
                        ); 
                        return res.status(200).json({
                            message: "OK",
                            accessToken: token
                        })
                    }
                    return res.status(400).send({
                        message: "Invalid password",
                    })
                }
            );
        }
    });
}

const getDataFromToken = (req: Request, res: Response) => {
    connection.getConnection((err, conn: PoolConnection) => {
        if (err) {
            res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null
            });
        }
        
        const sql = "SELECT * FROM users WHERE id = ?"
        conn.query(sql, req.userId, (err, result:any) => {
            conn.release();
            if (err) {
                res.status(500).send({
                    message: "INTERNAL SERVER ERROR",
                    result: null
                });
            }
            const sql2 = "SELECT restaurants.id FROM restaurants JOIN users ON restaurants.user_id = users.id WHERE user_id = ?;"
            conn.query(sql2, req.userId, (err2, restaurant_id: any) => {
                if (err2) {
                    res.status(500).send({
                        message: "INTERNAL SERVER ERROR",
                        result: null
                    });
                }
                if (restaurant_id.length > 0) {
                    return res.status(200).send({
                        message: "User with restaurant found",
                        result: {...result[0], restaurant_id: restaurant_id[0].id},
                    });
                }
                res.status(200).send({
                    message: "User without restaurant found",
                    result: result[0],
                });
            })
        });
    });
}

export default { register, login, getDataFromToken };