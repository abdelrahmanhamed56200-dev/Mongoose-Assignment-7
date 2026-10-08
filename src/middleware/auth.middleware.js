import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userModel } from '../db/models/user.model.js';

export const authentication = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies || {};

        if (!accessToken) {
            throw Object.assign(new Error('Access token is required'), { statusCode: 401, isOperational: true });
        }

        const decoded = jwt.verify(accessToken, env.jwt.secret);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            throw Object.assign(new Error('User not found'), { statusCode: 404, isOperational: true });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(Object.assign(new Error('Access token has expired'), { statusCode: 401, isOperational: true }));
        }

        if (error.name === 'JsonWebTokenError') {
            return next(Object.assign(new Error('Invalid access token'), { statusCode: 401, isOperational: true }));
        }

        return next(error);
    }
};

export const authenticatetion = authentication;