import { Router } from "express";


import { createItemSchema } from "./item.validation";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ItemsControllers } from "./item.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/items", auth("ADMIN", "USER"), ItemsControllers.getItemsController);
router.post("/item", auth(UserRole.ADMIN), validateRequest(createItemSchema), ItemsControllers.createItemController);
router.put("/item/:id", auth("ADMIN"), ItemsControllers.updateItemController);
router.delete("/item/:id", auth("ADMIN"), ItemsControllers.deleteItemController);

export const itemsRoutes = router;
