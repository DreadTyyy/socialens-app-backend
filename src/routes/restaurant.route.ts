import { Router } from "express";
import restaurantController from "../controllers/restaurant.controller";
import { verifyUser } from "../models/user";

const restaurantRouter = Router();

restaurantRouter.get("/", restaurantController.getAll);
restaurantRouter.get("/restaurant/:userId", restaurantController.getDetailRestaurant);
restaurantRouter.get("/restaurant/:userId/sentimen", restaurantController.getDetailSentimen);

restaurantRouter.post("/restaurant/:userId", verifyUser, restaurantController.createRestaurant);

restaurantRouter.delete("/restaurant/:userId", verifyUser, restaurantController.deleteRestaurant);

restaurantRouter.put("/restaurant/:userIdes", verifyUser, restaurantController.updateRestaurant);

export default restaurantRouter;