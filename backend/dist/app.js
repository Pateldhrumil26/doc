"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const document_routes_js_1 = __importDefault(require("./routes/document.routes.js"));
const template_routes_js_1 = __importDefault(require("./routes/template.routes.js"));
const letterheadProfile_routes_js_1 = __importDefault(require("./routes/letterheadProfile.routes.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '25mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '25mb' }));
    // Health check
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Letter Pad & Document Editor API',
        });
    });
    // API Routes
    app.use('/api/auth', auth_routes_js_1.default);
    app.use('/api/documents', document_routes_js_1.default);
    app.use('/api/templates', template_routes_js_1.default);
    app.use('/api/letterhead-profiles', letterheadProfile_routes_js_1.default);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
        });
    });
    // Centralized Error Middleware
    app.use(error_middleware_js_1.errorHandler);
    return app;
};
exports.createApp = createApp;
