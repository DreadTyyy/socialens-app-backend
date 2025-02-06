"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = __importDefault(require("../controllers/restaurant.controller"));
const user_1 = require("../models/user");
const restaurantRouter = (0, express_1.Router)();
restaurantRouter.get("/", restaurant_controller_1.default.getAll);
restaurantRouter.get("/restaurant/:userId", restaurant_controller_1.default.getDetailRestaurant);
restaurantRouter.get("/restaurant/:userId/sentimen", restaurant_controller_1.default.getDetailSentimen);
restaurantRouter.post("/restaurant/:userId", user_1.verifyUser, restaurant_controller_1.default.createRestaurant);
restaurantRouter.delete("/restaurant/:userId", user_1.verifyUser, restaurant_controller_1.default.deleteRestaurant);
restaurantRouter.put("/restaurant/:userIdes", user_1.verifyUser, restaurant_controller_1.default.updateRestaurant);
exports.default = restaurantRouter;
