"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const user_1 = require("../models/user");
const authRouter = (0, express_1.Router)();
authRouter.get("/me", user_1.verifyUser, auth_controller_1.default.getDataFromToken);
authRouter.post("/register", user_1.checkDuplicateUsername, auth_controller_1.default.register);
authRouter.post("/login", user_1.getUserByUsername, auth_controller_1.default.login);
exports.default = authRouter;
