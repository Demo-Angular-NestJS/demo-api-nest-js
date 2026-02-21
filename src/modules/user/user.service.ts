
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserRepository } from './user.repository';
import { CheckExistenceResponseDTO } from './dto/check-exist-response.dto.model';
import { BaseService } from 'common/services/base.service';
import { UserConfigurationRepository } from 'modules/user-configuration/user-configuration.repository';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { BCryptService, EmailService, generateTempPassword, SendEmailModel, temporaryPasswordTemplateHTML, tempPassTempReplace } from 'common';

@Injectable()
export class UserService extends BaseService<User, UserResponseDTO> {
  constructor(
    protected readonly userRepository: UserRepository,
    private readonly userConfigurationRepository: UserConfigurationRepository,
    private readonly _emailService: EmailService,
    private readonly bcryptService: BCryptService,
  ) {
    super(userRepository, UserResponseDTO);
  }

  public async create(inputDto: any, userId?: string): Promise<UserResponseDTO> {
    const user = await super.create(inputDto, userId);
    const targetUserId = user.id || (user as any)._id;
    const existingConfig = await this.userConfigurationRepository.findOne({ userId: targetUserId });

    if (!existingConfig) {
      await this.userConfigurationRepository.create({ userId: targetUserId.toString() });
    }

    return user;
  }

  public async checkUserExists(userName?: string, email?: string): Promise<CheckExistenceResponseDTO> {
    if (!email && !userName) {
      throw new BadRequestException();
    };

    const userWithUserName = await this.userRepository.findOne({ userName: new RegExp(`^${userName}$`, 'i') });
    const userWithEmail = await this.userRepository.findOne({ email });

    return { userNameExist: !!userWithUserName, emailExist: !!userWithEmail };
  }

  public async sendTemporaryPassword(email: string): Promise<void> {
    try {
      if (!email) {
        return;
      }

      const user = await this.userRepository.findOne({ email });

      if (!user) {
        return;
      }

      const tempPassword = generateTempPassword(10);

      await this.userRepository.update({ _id: user._id }, { password: tempPassword });

      const loginUrl = `${process.env.APP_URL}login`;
      const htmlBody = temporaryPasswordTemplateHTML
        .replace(tempPassTempReplace.loginUrl, loginUrl)
        .replace(tempPassTempReplace.tempPassword, tempPassword);

      const emailData: SendEmailModel = {
        to: email,
        subject: 'Your Temporary Password - ToyStore',
        text: `Your temporary password is: ${tempPassword}. Log in here: ${loginUrl}`,
        hmtl: htmlBody,
      };

      await this._emailService.sendEmail(emailData);
    } catch(ex) {
      console.log('Send Email for Temp Password: ', ex.message);
    }
  }

  public async changePassword(userId: string, changePasswordDTO: ChangePasswordDTO): Promise<boolean> {
    return this.userRepository.updatePassword(userId, changePasswordDTO);
  }
}
