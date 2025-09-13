import { Injectable, Logger } from '@nestjs/common';
import { ENUM_EMAIL } from 'src/modules/email/enums/email.enum';
import { title } from 'case';
import { ConfigService } from '@nestjs/config';
import { IEmailService } from 'src/modules/email/interfaces/email.service.interface';
import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';
import { EmailTempPasswordDto } from 'src/modules/email/dtos/email.temp-password.dto';
import { EmailWelcomeAdminDto } from 'src/modules/email/dtos/email.welcome-admin.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService implements IEmailService {
    private readonly debug: boolean;
    private readonly logger = new Logger(EmailService.name);

    private readonly fromEmail: string;
    private readonly supportEmail: string;

    private readonly appName: string;

    private readonly clientUrl: string;

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {
        this.debug = this.configService.get<boolean>('app.debug');

        this.fromEmail = this.configService.get<string>('email.fromEmail');
        this.supportEmail =
            this.configService.get<string>('email.supportEmail');

        this.appName = this.configService.get<string>('app.name');

        this.clientUrl = this.configService.get<string>('email.clientUrl');
    }

    async sendChangePassword({ name, email }: EmailSendDto): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: ENUM_EMAIL.CHANGE_PASSWORD,
                template: 'email.change-password.template.pug',
                context: {
                    appName: this.appName,
                    name: title(name),
                    supportEmail: this.supportEmail,
                    clientUrl: this.clientUrl,
                },
            });

            return true;
        } catch (err: unknown) {
            if (this.debug) {
                this.logger.error(err);
            }
            return false;
        }
    }

    async sendWelcome({ name, email }: EmailSendDto): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: ENUM_EMAIL.WELCOME,
                template: 'email.welcome.template.pug',
                context: {
                    appName: this.appName,
                    name: title(name),
                    email: title(email),
                    supportEmail: this.supportEmail,
                    clientUrl: this.clientUrl,
                },
            });
            return true;
        } catch (err: unknown) {
            if (this.debug) {
                this.logger.error(err);
            }
            return false;
        }
    }

    async sendWelcomeAdmin(
        { name, email }: EmailSendDto,
        { password: passwordString }: EmailWelcomeAdminDto
    ): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: ENUM_EMAIL.WELCOME_ADMIN,
                template: 'email.welcome-admin.template.pug',
                context: {
                    name: name,
                    email: email,
                    password: passwordString,
                },
            });
            return true;
        } catch (err: unknown) {
            if (this.debug) {
                this.logger.error(err);
            }
            return false;
        }
    }

    async sendTempPassword(
        { name, email }: EmailSendDto,
        { password: passwordString }: EmailTempPasswordDto
    ): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: ENUM_EMAIL.TEMP_PASSWORD,
                template: 'email.temp-password.template.pug',
                context: {
                    appName: this.appName,
                    name: title(name),
                    password: passwordString,
                    supportEmail: this.supportEmail,
                    clientUrl: this.clientUrl,
                },
            });
        } catch (err: unknown) {
            if (this.debug) {
                this.logger.error(err);
            }
            return false;
        }
    }

    async sendForgotPasswordEmail(
        email: string,
        resetLink: string
    ): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: ENUM_EMAIL.FORGOT_PASSWORD,
                template: 'email.forgot-password.template.pug',
                context: {
                    appName: this.appName,
                    resetLink,
                    supportEmail: this.supportEmail,
                    clientUrl: this.clientUrl,
                },
            });
        } catch (err: unknown) {
            if (this.debug) {
                this.logger.error(err);
            }
            return false;
        }
    }
}
