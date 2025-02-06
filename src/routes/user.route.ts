import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", userController.getAll);

export default userRouter;