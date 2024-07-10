"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_expire_in: process.env.EXPIRE_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expire_in: process.env.REFRESH_EXPIRE_IN,
    reset_password_link: process.env.RESET_PASSWORD_LINK,
    emailSender: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
    reset_password_secret: process.env.RESET_PASSWORD_TOKEN,
    reset_password_token_expire_in: process.env.RESET_PASSWORD_TOKEN_EXPIRE_IN
};
