import express from 'express';
import { AuthControllers } from './auth.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';


const router = express.Router();



router.post('/login', AuthControllers.loginUser)
router.post('/refresh-token', AuthControllers.refreshToken);
router.post('/change-password', auth(UserRole.ADMIN, UserRole.USER), AuthControllers.changePassword);
export const authRoutes = router;