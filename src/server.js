
import http from 'http';
import { createApp } from './app.js';
import mongoose from 'mongoose';
import { env } from './config/env.js';


const app = await createApp();
const server = http.createServer(app);


server.listen(env.port, () => {
    console.info(`Server is running on port ${env.port}`);
}
)
async function shutdown() {
    console.info('Shutting down server...');
    server.close(async () => {
        
            await mongoose.disconnect();
            process.exit(0);
        
    });
}

server.on('SIGINT', shutdown);
server.on('SIGTERM', shutdown);



