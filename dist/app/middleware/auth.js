"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const tokenParts = authorizationHeader.split(' ');
            const token = (tokenParts.length === 2 && tokenParts[0] === 'Bearer') ? tokenParts[1] : authorizationHeader;
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = decoded;
                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
                next();
            });
        },
    ];
};
exports.default = auth;
