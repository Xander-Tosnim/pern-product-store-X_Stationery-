import express from 'express'; 
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
import path from 'path';

import productRoutes from './routes/productRoutes.js'
import { sql } from './config/db.js'
import { aj } from './lib/arcjet.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));  // helmet is a middleware for security purpose
app.use(morgan("dev")); // log the requests to the console

// Apply Arcjet rate limiting middleware to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 // Sprcifies that each request consumes 1 token
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too many requests." })
            } else if(decision.reason.isBot()) {
                res.status(403).json({ error: " Bot access denied." })
            } else {
                res.status(403).json({ error: "Forbidden." })
            }
            return;
        }

        // Check for spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected." })
            return;
        }

        next();
    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
})

// Product routes
app.use("/api/products", productRoutes);

if(process.env.NODE_ENV === "production") {
    // Serve React frontend static files
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.get("/{/*path}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

// Initialize the database and create products table if it doesn't exist
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price decimal(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

// Start the server after initializing the database
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})