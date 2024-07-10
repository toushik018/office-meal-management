import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import httpStatus from "http-status"



const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.loginUser(req.body);

    const { refreshToken, ...data } = result;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: data
    })
})

// const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const user = req.user;
//     const result = await AuthServices.changePassword(user, req.body)

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password changed successfully",
//         data: result
//     })
// })


// const refreshToken = catchAsync(async (req: Request, res: Response) => {

//     const { refreshToken } = req.cookies;

//     const result = await AuthServices.refreshToken(refreshToken);


//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Logged in successfully",
//         data: result
//     })
// })


// const forgetPassword = catchAsync(async (req: Request, res: Response) => {

//     await AuthServices.forgetPassword(req.body)

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Check your email address",
//         data: null
//     })
// })


// const resetPassword = catchAsync(async (req: Request, res: Response) => {

//     const token = req.headers.authorization || "";
//     const result = await AuthServices.resetPassword(token, req.body)

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password reset successfully",
//         data: result
//     })
// })


export const AuthControllers = {
    loginUser,
    
}