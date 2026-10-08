import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { userModel } from '../../db/models/user.model.js';

export const checkExistUser = async (email) => {
    return userModel.findOne({ email });
};

export const signup = async (input) => {
    const { email, password } = input;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        throw Object.assign(new Error('User already exists'), { statusCode: 409, isOperational: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ ...input, password: hashedPassword });

    return {
        message: 'User created successfully',
        data: user,
    };
};

export const login = async (data) => {
    const { email, password } = data;
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
        throw Object.assign(new Error('Email or password is incorrect'), { statusCode: 401, isOperational: true });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        throw Object.assign(new Error('Email or password is incorrect'), { statusCode: 401, isOperational: true });
    }

    const accessToken = jwt.sign({ id: existingUser._id }, env.jwt.secret, { expiresIn: '1h' });

    return {
        message: 'User logged in successfully',
        accessToken,
    };
};