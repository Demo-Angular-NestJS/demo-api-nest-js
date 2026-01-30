import { Controller, Post, Body, Res, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequestDTO } from './dto/login-request.dto';

const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 900,000

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public() // This route is now accessible without a cookie/JWT
    @Post('login')
    async login(
        @Body() loginRequestDTO: LoginRequestDTO,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { accessToken, refreshToken } = await this.authService.login(loginRequestDTO);

        response.cookie('access_token', accessToken, {
            httpOnly: true, // Prevents JavaScript from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: ACCESS_TOKEN_EXPIRY, // 15 min
            sameSite: 'lax',
        });

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: ACCESS_TOKEN_EXPIRY * 2, // 10min
            sameSite: 'lax',
        });

        return { message: 'Logged in successfully' };
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    async refresh(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ) {
        const userId = req.user.sub;
        return this.authService.refreshTokens(userId, res);
    }

    @Get('me')
    getProfile(@Req() req: Request) {
        return req.user; // Contains the payload from JwtStrategy.validate()
    }

    @Public() // This route is now accessible without a cookie/JWT
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return { message: 'Logged out successfully' };
    }
}
