import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
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

} 