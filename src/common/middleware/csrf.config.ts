import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

export const {
    doubleCsrfProtection,
    generateCsrfToken
} = doubleCsrf({
    getSecret: () => {
        const secret = process.env.CSRF_COOKIE_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
            throw new Error('CSRF_COOKIE_SECRET is missing in production!');
        }

        return secret || 'secret_key_csrf';
    },
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
    getSessionIdentifier: (req: Request) => req.cookies?.['connect.sid'] || 'anonymous-session',
});
