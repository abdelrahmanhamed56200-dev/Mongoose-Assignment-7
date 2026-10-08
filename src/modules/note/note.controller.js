import { Router } from 'express';
import { authentication } from '../../middleware/auth.middleware.js';
import * as noteService from './note.service.js';

const router = Router();

router.post('/create', authentication, async (req, res, next) => {
    try {
        const result = await noteService.createNote(req.body, req.user._id);
        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/update/:id', authentication, async (req, res, next) => {
    try {
        const result = await noteService.updateNote(req.params.id, req.body, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.put('/replace/:id', authentication, async (req, res, next) => {
    try {
        const result = await noteService.replaceNote(req.params.id, req.body, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/update-all', authentication, async (req, res, next) => {

    try {

        const { id } = req.query;
        const { title } = req.body;

        const result = await noteService.updateAllNotesTitle(
            id,
            title
        );

        return res.status(200).json({
            success: true,
            message: "All notes titles updated successfully",
            data: result
        });

    } catch (error) {

        next(error);

    }
})

router.delete('/delete/:id', authentication, async (req, res, next) => {
    try {
        const result = await noteService.deleteNote(req.params.id, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/pagination', authentication, async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await noteService.pagination(page, limit, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/aggregation', authentication, async (req, res, next) => {
    try {
        const { title } = req.query;
        const result = await noteService.aggregation(title, req.user._id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
});


router.get('/note-by-content', authentication, async (req, res, next) => {
    try {
        const { content, userId } = req.query;

        const note = await noteService.getNoteByContent(
            content,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Note retrieved successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
});


router.get('/note-with-user', authentication, async (req, res, next) => {
    try {
        const { userId } = req.query;

        const notes = await noteService.getNotesWithUser(userId);

        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data: notes
        });

    } catch (error) {
        next(error);
    }
});


router.delete('/', authentication, async (req, res, next) => {
    try {
        const { userId } = req.query;

        const result = await noteService.deleteAllNotes(userId);

        return res.status(200).json({
            success: true,
            message: "All notes deleted successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
});

router.get('/:id', authentication, async (req, res, next) => {

    try {

        const { id } = req.params;
        

        const note = await noteService.getNoteById(
            id,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Note retrieved successfully",
            data: note
        });

    } catch (error) {

        next(error);

    }
});

export default router;