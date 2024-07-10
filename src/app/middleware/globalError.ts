
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.name === "ValidationError") {
        const validationErrors: any[] = [];
        for (const field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                validationErrors.push({
                    field,
                    message: err.errors[field].message,
                });
            }
        }
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Validation error",
            errorDetails: {
                issues: validationErrors,
            },
        });
    } else {

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};

export default globalErrorHandler;
