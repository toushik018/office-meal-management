"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItemSchema = void 0;
const zod_1 = require("zod");
const createItemSchema = zod_1.z.object({
    name: zod_1.z.string(),
    category: zod_1.z.string(),
});
exports.createItemSchema = createItemSchema;
