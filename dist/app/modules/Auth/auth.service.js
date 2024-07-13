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
exports.AuthServices = exports.changePassword = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    });
    console.log(userData);
    if (userData.status === "BANNED") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are banned, you cannot login anymore");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password is incorrect");
    }
    const accessToken = jwtHelpers_1.jwtHelper.generateToken({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_access_secret, config_1.default.jwt_expire_in);
    const refreshToken = jwtHelpers_1.jwtHelper.generateToken({
        email: userData.email,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: accessToken,
        refreshToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Current password is incorrect");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
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
});
exports.changePassword = changePassword;
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelper.verifyToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new Error("You are not authorized");
    }
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email
        }
    });
    const accessToken = jwtHelpers_1.jwtHelper.generateToken({
        email: isUserExist.email,
        role: isUserExist.role
    }, config_1.default.jwt_access_secret, config_1.default.jwt_expire_in);
    return {
        accessToken
    };
});
exports.AuthServices = {
    loginUser,
    changePassword: exports.changePassword,
    refreshToken
};
