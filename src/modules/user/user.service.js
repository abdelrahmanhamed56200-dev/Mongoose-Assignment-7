import bcrypt from 'bcrypt';
import { userModel } from '../../db/models/user.model.js';


export const getProfileUsers = async (userId) => {
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
        throw Object.assign(new Error('User not found'), { statusCode: 404, isOperational: true });
    }
    return { message: 'User found successfully', success: true, data: user };
};

export const updateUser = async (data, userId) => {
    const { password, ...updates } = data;

    if (updates.email) {
        const currentUser = await userModel.findById(userId);
        if (currentUser && currentUser.email !== updates.email) {
            const existEmail = await userModel.findOne({ email: updates.email });
            if (existEmail) {
                throw Object.assign(new Error('Email already exists'), { statusCode: 409, isOperational: true });
            }
        }
    }

    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userModel
        .findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
        .select('-password');

    if (!updatedUser) {
        throw Object.assign(new Error('User not found'), { statusCode: 404, isOperational: true });
    }

    return { message: 'User updated successfully', success: true, data: updatedUser };
};

export const deleteUser = async (userId) => {
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw Object.assign(new Error('User not found'), { statusCode: 404, isOperational: true });
    }

    return { message: 'User deleted successfully', success: true, data: deletedUser };
};

