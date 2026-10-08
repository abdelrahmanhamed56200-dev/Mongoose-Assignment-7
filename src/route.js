import { Router } from 'express';
import { authRouter } from './modules/auth/index.js';
import { userRouter } from './modules/user/index.js';
import { noteRouter } from './modules/note/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/notes', noteRouter);

export { router };
export default router;

