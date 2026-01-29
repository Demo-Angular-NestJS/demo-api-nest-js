import { Controller, Post, Body, Res, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public() // This route is now accessible without a cookie/JWT
    @Post('login')
    async login(
        @Body() loginDto: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        const token = await this.authService.login(loginDto);

        response.cookie('Authentication', token, {
            httpOnly: true, // Prevents JavaScript from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 3600000, // 1 hour
            sameSite: 'lax',
        });

        return { message: 'Success' };
    }

    @Get('profile')
    getProfile(@Req() req: Request) {
        return req.user; // Contains the payload from JwtStrategy.validate()
    }

    @Public() // This route is now accessible without a cookie/JWT
    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authentication');
        return { message: 'Logged out' };
    }
}
