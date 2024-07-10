"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRoutes = void 0;
const express_1 = require("express");
const item_validation_1 = require("./item.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const item_controller_1 = require("./item.controller");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/items", (0, auth_1.default)("ADMIN", "USER"), item_controller_1.ItemsControllers.getItemsController);
router.post("/item", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(item_validation_1.createItemSchema), item_controller_1.ItemsControllers.createItemController);
router.put("/item/:id", (0, auth_1.default)("ADMIN"), item_controller_1.ItemsControllers.updateItemController);
router.delete("/item/:id", (0, auth_1.default)("ADMIN"), item_controller_1.ItemsControllers.deleteItemController);
exports.itemsRoutes = router;
