import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

// Initialize Arcjet 

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks like SQL injection, XSS, CSRF attacks
        shield({ mode: "LIVE" }),
        detectBot({
            // Block all bots except search engines
            mode: "LIVE", 
            allow:[
                "CATEGORY: SEARCH_ENGINE"
            ]
        }),
        // Token Bucket rate limiting
        tokenBucket({
            mode: "LIVE",
            refillRate: 10,
            interval: 5,
            capacity: 20
        })
    ]
})