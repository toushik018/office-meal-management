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







export const changePassword = async (user: any, payload: IChangePassword) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
    }

    const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashPassword
        },
    });

    return {
        message: "Password changed successfully",
    };
};


const refreshToken = async (token: string) => {
    let decodedData;

    try {
        decodedData = jwtHelper.verifyToken(token, config.jwt_refresh_secret as Secret);
    } catch (err) {
        throw new Error("You are not authorized")
    }

    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email
        }
    });

    const accessToken = jwtHelper.generateToken({
        email: isUserExist.email,
        role: isUserExist.role
    },
        config.jwt_access_secret as string,
        config.jwt_expire_in as string
    );


    return {
        accessToken
    };

}








export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken

}