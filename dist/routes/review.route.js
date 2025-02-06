"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const reviewRouter = (0, express_1.Router)();
reviewRouter.get("/", review_controller_1.default.getAll);
reviewRouter.post("/", review_controller_1.default.createReview);
exports.default = reviewRouter;
