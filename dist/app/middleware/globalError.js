"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const validationErrors = [];
        for (const field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                validationErrors.push({
                    field,
                    message: err.errors[field].message,
                });
            }
        }
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Validation error",
            errorDetails: {
                issues: validationErrors,
            },
        });
    }
    else {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};
exports.default = globalErrorHandler;
