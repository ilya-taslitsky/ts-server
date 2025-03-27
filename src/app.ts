import express, { Request, Response } from 'express';
import {SwapController} from './controllers/swap-controller';
import {SwapReqDto} from "./models/swap-req-dto";
import {SwapRespDto} from "./models/swap-resp-dto";

async function startServer() {
    // Create Express app
    const app = express();
    app.use(express.json());

    // Create controller instance
    const swapController = new SwapController();

    // Register routes
    app.post('/api/swap',
        (req: Request<{}, any, SwapReqDto>, res: Response<SwapRespDto>) =>
            swapController.swap(req, res));

    // Start server
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
        console.log(`Swap Service started and running on port ${PORT}`);
    });
}

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});