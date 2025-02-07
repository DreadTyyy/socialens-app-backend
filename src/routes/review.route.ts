import { Router } from "express";
import reviewController from "../controllers/review.controller";

const reviewRouter = Router();

reviewRouter.get("/", reviewController.getAll);
reviewRouter.post("/", reviewController.createReview)

export default reviewRouter;