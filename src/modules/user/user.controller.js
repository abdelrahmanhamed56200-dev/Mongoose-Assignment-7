import { Router } from 'express';
import { authentication } from '../../middleware/auth.middleware.js';
import * as userService from './user.service.js';

const router = Router();

router.patch('/update', authentication, async (req, res, next) => {
    try {
        const result = await userService.updateUser(req.body, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/delete', authentication, async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/profile', authentication, async (req, res, next) => {
    try {
        const result = await userService.getProfileUsers(req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

export default router;