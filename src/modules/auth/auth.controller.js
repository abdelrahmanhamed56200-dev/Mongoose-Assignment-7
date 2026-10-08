import { Router } from 'express';
import * as authService from './auth.service.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return res.status(200)
            .cookie('accessToken', result.accessToken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                sameSite: 'lax',
            })
            .json({
                success: true,
                message: result.message,
                data: { accessToken: result.accessToken },
            });
    } catch (error) {
        next(error);
    }
});

export default router;