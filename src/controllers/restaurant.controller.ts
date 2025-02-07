import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";
import { connection } from "../configs/db";
import { PoolConnection } from 'mysql2';

interface SentimenCount {
    [date: string]: {positive: number; negative: number;}
}

const sentimen = [{
    date: "asdfasdf",
    positive: 29,
    negative: 10,
}, {
    date: "asdfasdf",
    positive: 29,
    negative: 10,
}]

const getAll = (req: Request, res: Response) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null
            });
        }
        
        conn.query("select * from restaurants", (err, result: Restaurant[]) =>{
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
                    message: "Restaurant not found",
                    result: null
                });
            }
        });
    });
}

const getDetailRestaurant = (req: Request, res: Response) => {
    const { userId } = req.params;
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            return res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null,
            });
        } 
        
        conn.query("SELECT * FROM restaurants WHERE user_id = ?", userId, (err, result: any) => {
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
                    result: result,
                });
            } else {
                res.status(404).send({
                    message: "Restaurant not found",
                    result: null,
                });
            }
        });
    });
}

const createRestaurant = (req: Request, res: Response) => {
    const { title, url_maps = ""} = req.body;
    
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        const sql = "INSERT INTO restaurants (`title`, `user_id`, `url_maps`) VALUES(?)"
        const values = [title, req.params.userId, url_maps];
        if (err) {
            return res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null,
            });
        } 
        
        conn.query(sql, [values], (err, result) => {
            conn.release();
            if (err) {
                res.status(500).send({
                    message: err.message,
                    result: null,
                });
            } else {
                res.status(201).send({
                    message: "OK",
                });
            }
        });
    });
}

const deleteRestaurant = (req: Request, res: Response) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            return res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null,
            });
        } 
        conn.query("DELETE FROM restaurants WHERE user_id = ?;", req.params.userId, (err, result: any) => {
            conn.release();
            if (err) {
                res.status(500).send({
                    message: err.message,
                    result: null,
                });
            } 
            if (result.affectedRows > 0){
                return res.status(200).send({
                    message: "OK",
                });
            } 
            return res.status(404).send({
                message: "Restaurant not found",
            });
            
        })
    })
}

const updateRestaurant = (req: Request, res: Response) => {
    const { title, url_maps } = req.body;

    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            return res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null,
            });
        }
        let sql = "UPDATE restaurants SET `title` = ? WHERE user_id = ?"
        let values = [title, req.params.userId]; 
        if (url_maps) {
            sql = "UPDATE restaurants SET `title` = ?, `url_maps` = ? WHERE user_id = ?";
            values = [title, url_maps, req.userId]; 
        }
        conn.query(sql, values, (err, result: any) => {
            conn.release();

            if (err) {
                return res.status(500).send({
                    message: err.message,
                    result: null,
                });
            } 
            
            if (result.affectedRows > 0) {
                res.status(200).send({
                    message: "OK",
                });
            } else {
                res.status(404).send({
                    message: "Restaurant not found",
                    result: null,
                });
            }
        });
    });
}

const getDetailSentimen = (req: Request, res: Response) => {
    const { userId } = req.params;
    const startDate: string | null = req.query.startDate ? String(req.query.startDate) : null;
    const endDate: string | null = req.query.endDate ? String(req.query.endDate) : null;

    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
        if (err) {
            return res.status(500).send({
                message: "INTERNAL SERVER ERROR",
                result: null,
            });
        }
        
        let sqlReviews = `
            SELECT 
                restaurants.id AS restaurant_id,
                restaurants.user_id, 
                reviews.id AS review_id,
                reviews.body, 
                reviews.sentiment, 
                DATE_FORMAT(reviews.time_review, '%Y-%m-%d') AS time_review
            FROM 
                restaurants 
            JOIN 
                reviews ON restaurants.id = reviews.restaurant_id 
            WHERE user_id = ?
        `;
        const valuesReview = [userId];
        if (startDate) {
            sqlReviews += ` AND reviews.time_review >= ?`;
            valuesReview.push(startDate);
        }
        if (endDate) {
            sqlReviews += ` AND reviews.time_review <= ?`;
            valuesReview.push(endDate)
        }

        const sqlRestaurant = `
            SELECT 
                restaurants.id AS restaurant_id, 
                restaurants.title, 
                restaurants.user_id, 
                restaurants.url_maps,
                COUNT(CASE WHEN reviews.sentiment = 'positive' THEN 1 ELSE NULL END) AS positive,
                COUNT(CASE WHEN reviews.sentiment = 'negative' THEN 1 ELSE NULL END) AS negative,
                DATE_FORMAT(MIN(reviews.time_review), '%Y-%m-%d') AS first_time_review
            FROM 
                restaurants
            JOIN 
                reviews ON restaurants.id = reviews.restaurant_id 
            WHERE user_id = ?;
        `;
        conn.query(sqlRestaurant, userId, (errGetRest, restaurantFound: any) => {
            conn.release();
            if (errGetRest) {
                return res.status(500).send({
                    message: "INTERNAL SERVER ERROR 0",
                    result: null,
                });
            } 

            if (restaurantFound.length > 0) {
                conn.query(sqlReviews, valuesReview, (errGetRev, result: any) => {
                    conn.release();

                    if (errGetRev) {
                        console.log(errGetRev);
                        
                        return res.status(500).send({
                            message: "INTERNAL SERVER ERROR 1",
                            result: null,
                        });
                    } 
                    if (result.length > 0) {
                        const sentimenObj: SentimenCount = {};
                        result.map(({sentiment, time_review}: {sentiment: string; time_review: string}) => {
                            if (!sentimenObj[time_review]) {
                                sentimenObj[time_review] = {positive: 0, negative: 0};
                            }
            
                            if (sentiment === "positive") {
                                sentimenObj[time_review].positive += 1;
                            } else if (sentiment === "negative") {
                                sentimenObj[time_review].negative += 1;
                            }
                        })
                        const sentimenCount = Object.entries(sentimenObj).map(([date, counts]) => ({
                            date,
                            ...counts
                        }));
                    
                        res.status(200).send({
                            message: "OK",
                            result: {
                                data: {
                                    restaurant_id: result[0].restaurant_id,
                                    userId: result[0].user_id,
                                    title: restaurantFound[0].title,
                                    urlMaps: restaurantFound[0].url_maps,
                                    positive: restaurantFound[0].positive,
                                    negative: restaurantFound[0].negative,
                                    initialDate: restaurantFound[0].first_time_review,
                                },
                                sentimenCount,
                            },
                        });
                    } else {
                        res.status(404).send({
                            message: "Reviews not found",
                            result: null,
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: "Restaurant not found",
                    result: null,
                });
            }
        });
    });
}

export default { getAll, getDetailRestaurant, createRestaurant, deleteRestaurant, updateRestaurant, getDetailSentimen };