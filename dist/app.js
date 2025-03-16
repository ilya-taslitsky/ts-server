"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swap_controller_1 = require("./controllers/swap-controller");
async function startServer() {
    // Create Express app
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Create controller instance
    const swapController = new swap_controller_1.SwapController();
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
