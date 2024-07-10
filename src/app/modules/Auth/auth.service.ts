import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt"
import { jwtHelper } from "../../helpers/jwtHelpers";
import config from "../../config";
import { IChangePassword } from "./auth.constants";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        } as Prisma.UserWhereUniqueInput
    });
    console.log(userData);

    if (userData.status === "BANNED") {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are banned, you cannot login anymore")
    }

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password is incorrect")
    }

    const accessToken = jwtHelper.generateToken({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
    },
        config.jwt_access_secret as string,
        config.jwt_expire_in as string

    )

    const refreshToken = jwtHelper.generateToken({
        email: userData.email,
    },
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expire_in as string
    );

    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: accessToken,
        refreshToken
    };


}







// export const changePassword = async (user: any, payload: IChangePassword) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: user.email,
//             isActive: UserStatus.ACTIVATE,
//         },
//     });

//     const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

//     if (!isCorrectPassword) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
//     }

//     const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

//     await prisma.user.update({
//         where: {
//             email: userData.email,
//         },
//         data: {
//             password: hashPassword
//         },
//     });

//     return {
//         message: "Password changed successfully",
//     };
// };


// const refreshToken = async (token: string) => {
//     let decodedData;

//     try {
//         decodedData = jwtHelper.verifyToken(token, config.jwt_refresh_secret as Secret);
//     } catch (err) {
//         throw new Error("You are not authorized")
//     }

//     const isUserExist = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: decodedData.email
//         }
//     });

//     const accessToken = jwtHelper.generateToken({
//         email: isUserExist.email,
//         role: isUserExist.role
//     },
//         config.jwt_access_secret as string,
//         config.jwt_expire_in as string
//     );


//     return {
//         accessToken
//     };

// }



// const forgetPassword = async (payload: { email: string }) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: payload.email,
//             isActive: UserStatus.ACTIVATE
//         }
//     });


//     const resetPasswordToken = jwtHelper.generateToken({
//         email: userData.email, role: userData.role
//     },
//         config.reset_password_secret as string,
//         config.reset_password_token_expire_in as string,
//     )
//     const resetPassLink = config.reset_password_link +
//         `?userId=${userData.id}&token=${resetPasswordToken}`


//     await emailSender(userData.email,
//         `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//             <div style="text-align: center; margin-bottom: 20px;">
//                 <h1 style="font-size: 40px">Flat Share</h1>
//             </div>
//             <p style="font-size: 16px;">Dear ${userData.username},</p>
//             <p style="font-size: 16px;">We received a request to reset your password. Click the button below to reset your password:</p>
//             <div style="text-align: center; margin: 20px 0;">
//                 <a href="${resetPassLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
//             </div>
//             <p style="font-size: 16px;">If you did not request a password reset, please ignore this email. This link will expire in 20 minutes for your security.</p>
//             <p style="font-size: 16px;">Best regards,</p>
//             <p style="font-size: 16px;">The Flat Share Team</p>
//             <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
//             <p style="font-size: 12px; color: #777;">If you’re having trouble with the button above, copy and paste the following link into your web browser:</p>
//             <a href="${resetPassLink}" style="font-size: 12px; color: #4CAF50;">${resetPassLink}</a>
//         </div>
//         `
//     )

// }



// const resetPassword = async (token: string, payload: { id: string, password: string }) => {


//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             id: payload.id,
//             isActive: UserStatus.ACTIVATE
//         }
//     })

//     const isTokenValid = jwtHelper.verifyToken(token, config.reset_password_secret as Secret)
//     console.log(isTokenValid);

//     if (!isTokenValid) {
//         throw new AppError(httpStatus.FORBIDDEN, "You are not allow to reset password")
//     }

//     const password: string = await bcrypt.hash(payload.password, 12)

//     await prisma.user.update({
//         where: {
//             id: payload.id,
//         },
//         data: {
//             password
//         }
//     })

//     console.log(isTokenValid, "Your password has been reset");

// }



export const AuthServices = {
    loginUser,

}