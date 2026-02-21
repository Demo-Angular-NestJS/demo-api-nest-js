import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from './user.service';
import { EmailService, Public, registeredUserTemplate, registerTempReplace } from 'common';
import type { AuthenticatedRequestModel, SendEmailModel } from 'common/models';
import { UserResponseDTO } from './dto/user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CheckExistenceResponseDTO } from './dto/check-exist-response.dto.model';
import { BaseController } from 'modules/base.controller';
import { User } from './schemas/user.schema';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { TemporaryPasswordDTO } from './dto/temporary-password.dto';

@Controller('user')
export class UserController extends BaseController<User, CreateUserDTO, UpdateUserDTO, UserResponseDTO> {
  constructor(
    private readonly userService: UserService,
    private readonly _emailService: EmailService,
  ) {
    super(userService, UserResponseDTO);
  }

  @Public()
  @Get('exists')
  public async checkExistence(
    @Query('userName') userName?: string,
    @Query('email') email?: string,
  ) {
    const resp = await this.userService.checkUserExists(userName, email);
    return new CheckExistenceResponseDTO(resp);
  }

  @Get('current')
  public async current(@Req() req: AuthenticatedRequestModel) {
    const current = await this.userService.getByFilter({ _id: new Types.ObjectId(req?.user?.sub) });

    if (!current) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDTO(current);
  }

  @Public()
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDTO,
  ) {
    const created = await this.userService.create(createUserDto);
    const userDTO = new UserResponseDTO(created);
    const homeUrl = `${process.env.APP_URL}home`;
    const htmlBody = registeredUserTemplate
      .replace(registerTempReplace.userName, userDTO.userName)
      .replace(registerTempReplace.url, homeUrl);;
    const emailData: SendEmailModel = {
      to: userDTO.email,
      subject: `Welcome ${userDTO.userName} - ToyStore`,
      text: `Congratulations, you have been registered succesfuly.`,
      hmtl: htmlBody,
    };

    this._emailService.sendEmail(emailData);

    return userDTO;
  }

  @Public()
  @Post('tempPassword')
  @HttpCode(HttpStatus.OK)
  public async sendTemporalPassword(
    @Body() temporaryPasswordDTO: TemporaryPasswordDTO,
  ) {
    await this.userService.sendTemporaryPassword(temporaryPasswordDTO?.email ?? null);
    return {};
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @Req() req: AuthenticatedRequestModel,
    @Body() changePasswordDto: ChangePasswordDTO,
  ) {
    const userId = req.user.sub;
    const result = await this.userService.changePassword(userId, changePasswordDto);
    return { message: result ? 'Password updated successfully' : 'An error ocurred changing the password' };
  }
}
