// middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const adminRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login/registration attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});