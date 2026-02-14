import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthService } from './auth.service';
import { JWTTokenDTO, Public, StringService } from 'common';
import { LoginRequestDTO } from './dto/login-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { generateCsrfToken } from 'common/middleware';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private stringService: StringService,
        private jwtService: JwtService,
    ) { }

    @Public() // This route is now accessible without a cookie/JWT
    @Post('login')
    async login(
        @Body() loginRequestDTO: LoginRequestDTO,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.authService.login(loginRequestDTO);
        const jwtToken = this.stringService.removeUndefined(new JWTTokenDTO(user));
        const accessToken = this.jwtService.sign({ ...jwtToken }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as StringValue | number,
        });

        response.cookie((process.env.COOKIE_NAME || 'cn'), accessToken, {
            httpOnly: true, // Prevents JavaScript from reading the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: +(process.env.COOKIE_LIFE_TIME_MS || '300000'), // default 5 min
            sameSite: 'lax',
        });

        return new LoginResponseDTO(user.toObject ? user.toObject() : user);
    }

    @Get('me')
    getProfile(@Req() req: Request) {
        return;
    }

    @Public()
    @Get('token')
    getCsrfToken(@Req() req: Request, @Res() res: Response) {
        const token = generateCsrfToken(req, res);
        return res.json({ token });
    }

    @Public()
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie((process.env.COOKIE_NAME || 'cn'));
        return;
    }
}
