import { Router } from "express";

import { createMealSchema, updateMealSchema } from "./meal.validation";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { MealControllers } from "./meal.controller";

const router = Router();

router.get("/meals", auth("ADMIN", "USER"), MealControllers.getMealsController);
router.post("/meal", auth("ADMIN"), validateRequest(createMealSchema), MealControllers.createMealController);
router.put("/meal/:id", auth("ADMIN"), validateRequest(updateMealSchema), MealControllers.updateMealController);
router.delete("/meal/:id", auth("ADMIN"), MealControllers.deleteMealController);

export const mealRoutes = router;
