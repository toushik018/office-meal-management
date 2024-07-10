import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ItemsServices } from "./item.service";
import pick from "../../utils/pick";



const createItemController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ItemsServices.createItem(req.user, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Item created successfully",
        data: result,
    });
});


const updateItemController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const itemId = req.params.id;
    const result = await ItemsServices.updateItem(req.user, itemId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Item updated successfully",
        data: result,
    });
});

const deleteItemController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const itemId = req.params.id;
    await ItemsServices.deleteItem(req.user, itemId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Item deleted successfully",
        data: null,
    });
});

const getItemsController = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["searchTerm", "category"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await ItemsServices.getItems(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Items retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
export const ItemsControllers = { createItemController, updateItemController, deleteItemController, getItemsController };
