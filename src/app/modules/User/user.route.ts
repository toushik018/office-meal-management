import express from 'express'
import { userControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchema } from './user.validation';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();



router.get("/users", auth(UserRole.ADMIN), userControllers.getAllUsers);
router.get("/user/:id", auth(UserRole.ADMIN), userControllers.getUserController);
router.get('/me', auth(), userControllers.getUserProfile);
router.get("/admin/stats", auth("ADMIN"), userControllers.getAdminStatsController);
router.put("/user/update", auth(), userControllers.updateUserController);
router.patch("/user/ban", auth(UserRole.ADMIN), userControllers.banUserController);
router.patch('/user/update-role', auth(UserRole.ADMIN), userControllers.updateUserRole);
router.post('/register', validateRequest(userValidationSchema.createUserSchema),
    userControllers.createUser);
router.post("/register", validateRequest(userValidationSchema.createAdminSchema), userControllers.createAdmin);

// router.delete('/delete/:userId', auth(UserRole.ADMIN), userControllers.deleteUser);


export const userRoutes = router;