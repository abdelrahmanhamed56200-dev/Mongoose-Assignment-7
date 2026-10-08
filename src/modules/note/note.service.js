import mongoose from 'mongoose';
import { noteModel } from '../../db/models/note.model.js';

export const createNote = async (noteData, authenticatedId) => {
    const { title, content } = noteData;
    const newNote = await noteModel.create({
        title,
        content,
        userId: authenticatedId,
    });

    return { message: 'Note created successfully', data: newNote };
};

export const updateNote = async (noteId, noteData, authenticatedId) => {
    const { title, content } = noteData;

    const updatedNote = await noteModel.findOneAndUpdate(
        { _id: noteId, userId: authenticatedId },
        { title, content },
        { new: true, runValidators: true }
    );

    if (!updatedNote) {
        throw Object.assign(new Error('Note not found or not owned by authenticated user'), { statusCode: 404, isOperational: true });
    }

    return { message: 'Note updated successfully', data: updatedNote };
};

export const replaceNote = async (noteId, noteData, authenticatedId) => {
    const { title, content } = noteData;

    const updatedNote = await noteModel.findOneAndReplace(
        { _id: noteId, userId: authenticatedId },
        { title, content, userId: authenticatedId },
        { new: true, runValidators: true }
    );

    if (!updatedNote) {
        throw Object.assign(new Error('Note not found or not owned by authenticated user'), { statusCode: 404, isOperational: true });
    }

    return { message: 'Note replaced successfully', data: updatedNote };
};

export const deleteNote = async (noteId, authenticatedId) => {
    const updatedNote = await noteModel.findOneAndDelete({
        _id: noteId,
        userId: authenticatedId,
    });

    if (!updatedNote) {
        throw Object.assign(new Error('Note not found or not owned by authenticated user'), { statusCode: 404, isOperational: true });
    }

    return { message: 'Note deleted successfully', data: updatedNote };
};

export const pagination = async (page, limit, authenticatedId) => {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const notes = await noteModel
        .find({ userId: authenticatedId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    return { message: 'Notes retrieved successfully', data: notes };
};

export const aggregation = async (title, authenticatedId) => {
    const noteTitle = String(title || '').trim();

    if (!noteTitle) {
        throw Object.assign(new Error('Title is required'), { statusCode: 400, isOperational: true });
    }

    const notes = await noteModel.aggregate([
        { $match: { userId: authenticatedId, title: noteTitle } },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                user: {
                    name: '$user.name',
                    email: '$user.email',
                },
                createdAt: 1,
            },
        },
    ]);

    return { message: 'Notes retrieved successfully', data: notes };
};


export async function updateAllNotesTitle(userId, title) {

    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!title) {
        throw new Error("Title is required");
    }

    const result = await noteModel.updateMany(
        { userId },
        {
            $set: {
                title
            }
        }
    );

    return result;
}

export async function getNoteById(noteId, userId) {

   

    const note = await noteModel.findOne({
        _id: noteId,
        userId: userId
    });

    if (!note) {
        throw new Error("Note not found or you are not the owner");
    }

    return note;
}

export async function getNoteByContent(content, userId) {

    const note = await noteModel.findOne({
        content: content,
        userId: userId
    });

    if (!note) {
        throw new Error("Note not found");
    }

    return note;
}

export async function getNotesWithUser(userId) {

    const notes = await noteModel.find({ userId })
        .select('title userId createdAt')
        .populate({
            path: 'userId',
            select: 'email'
        });

    return notes;
}

export async function deleteAllNotes(userId) {

    const result = await noteModel.deleteMany({
        userId
    });

    return result;
}