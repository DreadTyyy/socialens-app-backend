import { Router } from "express";
import authController from "../controllers/auth.controller";
import { checkDuplicateUsername, getUserByUsername, verifyUser } from "../models/user";

const authRouter = Router();

authRouter.get("/me", verifyUser, authController.getDataFromToken);

authRouter.post("/register", checkDuplicateUsername, authController.register);
authRouter.post("/login", getUserByUsername, authController.login);

export default authRouter;