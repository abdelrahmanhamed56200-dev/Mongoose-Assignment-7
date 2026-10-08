import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/mongoose.js';
import { globalErrorHandler } from './err/error.handler.js';
import router from './route.js';

export async function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    await connectDB();

    app.use('/api', router);
    app.use(globalErrorHandler);

    return app;
}