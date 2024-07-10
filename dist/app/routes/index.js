"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const item_route_1 = require("../modules/Item/item.route");
const meal_route_1 = require("../modules/meal/meal.route");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: '/', route: user_route_1.userRoutes },
    { path: '/', route: auth_route_1.authRoutes },
    { path: '/', route: item_route_1.itemsRoutes },
    { path: '/', route: meal_route_1.mealRoutes },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
