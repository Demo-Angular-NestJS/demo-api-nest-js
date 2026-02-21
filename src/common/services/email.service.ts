import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailModel } from 'common/models';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(data: SendEmailModel) {
        return await this.mailerService.sendMail({
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.hmtl,
        });
    }
}