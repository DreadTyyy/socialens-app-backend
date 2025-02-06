import { Router } from "express";
import restaurantRouter from "./restaurant.route";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import reviewRouter from "./review.route";

const routes = Router();

routes.use("/users", userRouter)
routes.use("/restaurants", restaurantRouter);
routes.use("/auth", authRouter);
routes.use("/reviews", reviewRouter);

export default routes;