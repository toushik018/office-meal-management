"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealRoutes = void 0;
const express_1 = require("express");
const meal_validation_1 = require("./meal.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const meal_controller_1 = require("./meal.controller");
const router = (0, express_1.Router)();
router.get("/meals", (0, auth_1.default)("ADMIN", "USER"), meal_controller_1.MealControllers.getMealsController);
router.post("/meal", (0, auth_1.default)("ADMIN"), (0, validateRequest_1.default)(meal_validation_1.createMealSchema), meal_controller_1.MealControllers.createMealController);
router.put("/meal/:id", (0, auth_1.default)("ADMIN"), (0, validateRequest_1.default)(meal_validation_1.updateMealSchema), meal_controller_1.MealControllers.updateMealController);
router.delete("/meal/:id", (0, auth_1.default)("ADMIN"), meal_controller_1.MealControllers.deleteMealController);
exports.mealRoutes = router;
