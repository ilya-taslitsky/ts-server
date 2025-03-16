import express from 'express';
import { SwapController } from './controllers/swap-controller';

async function startServer() {
    // Create Express app
    const app = express();
    app.use(express.json());

    // Create controller instance
    const swapController = new SwapController();

    // Register routes
    app.post('/api/swap/usdc-to-sol', (req, res) => swapController.swapUsdcForSol(req, res));

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`USDC-SOL Swap Service running on port ${PORT}`);
    });
}

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});