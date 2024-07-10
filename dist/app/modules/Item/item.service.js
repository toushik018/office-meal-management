"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsServices = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createItem = (requester, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new Error("You are not authorized to create an item");
    }
    const item = yield prisma_1.default.item.create({
        data: payload,
    });
    return item;
});
const updateItem = (requester, itemId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new Error("You are not authorized to update an item");
    }
    const item = yield prisma_1.default.item.update({
        where: { id: itemId },
        data: payload,
    });
    return item;
});
const deleteItem = (requester, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    if (requester.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete an item");
    }
    const item = yield prisma_1.default.item.findUnique({
        where: { id: itemId },
    });
    if (!item) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found");
    }
    yield prisma_1.default.item.delete({
        where: { id: itemId },
    });
});
const getItems = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, category } = params;
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            name: {
                contains: searchTerm,
                mode: "insensitive",
            },
        });
    }
    if (category) {
        andCondition.push({
            category: {
                equals: category,
                mode: "insensitive",
            },
        });
    }
    const whereCondition = {
        AND: andCondition,
    };
    const result = yield prisma_1.default.item.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder,
        } : {
            createdAt: "desc",
        },
    });
    const total = yield prisma_1.default.item.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.ItemsServices = { createItem, updateItem, deleteItem, getItems };
