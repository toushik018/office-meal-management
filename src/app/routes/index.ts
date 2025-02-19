import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { itemsRoutes } from "../modules/Item/item.route";
import { mealRoutes } from "../modules/meal/meal.route";
import { orderRoutes } from "../modules/Order/order.route";



const router = express.Router();


const moduleRoutes = [
    { path: '/', route: userRoutes },
    { path: '/', route: authRoutes },
    { path: '/', route: itemsRoutes },
    { path: '/', route: mealRoutes },
    { path: '/', route: orderRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;