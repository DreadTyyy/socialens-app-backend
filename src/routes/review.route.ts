import { Router } from "express";
import reviewController from "../controllers/review.controller";

const reviewRouter = Router();

reviewRouter.get("/", reviewController.getAll);
// reviewRouter.get("/review/")

export default reviewRouter;