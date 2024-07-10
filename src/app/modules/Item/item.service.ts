import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interface/pagination";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createItem = async (requester: any, payload: { name: string; category: string }) => {
    if (requester.role !== "ADMIN") {
        throw new Error("You are not authorized to create an item");
    }

    const item = await prisma.item.create({
        data: payload,
    });
    return item;
};

const updateItem = async (requester: any, itemId: string, payload: { name?: string; category?: string }) => {
    if (requester.role !== "ADMIN") {
        throw new Error("You are not authorized to update an item");
    }

    const item = await prisma.item.update({
        where: { id: itemId },
        data: payload,
    });
    return item;
};

const deleteItem = async (requester: any, itemId: string) => {
    if (requester.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete an item");
    }

    const item = await prisma.item.findUnique({
        where: { id: itemId },
    });

    if (!item) {
        throw new AppError(httpStatus.NOT_FOUND, "Item not found");
    }

    await prisma.item.delete({
        where: { id: itemId },
    });
};

const getItems = async (params: { searchTerm?: string; category?: string }, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, category } = params;
    const andCondition: Prisma.ItemWhereInput[] = [];

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

    const whereCondition: Prisma.ItemWhereInput = {
        AND: andCondition,
    };

    const result = await prisma.item.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder,
        } : {
            createdAt: "desc",
        },
    });

    const total = await prisma.item.count({
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
};

export const ItemsServices = { createItem, updateItem, deleteItem, getItems };