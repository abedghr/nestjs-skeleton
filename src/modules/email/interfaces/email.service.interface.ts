import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';
import { EmailTempPasswordDto } from 'src/modules/email/dtos/email.temp-password.dto';
import { EmailWelcomeAdminDto } from 'src/modules/email/dtos/email.welcome-admin.dto';

export interface IEmailService {
    sendChangePassword({ name, email }: EmailSendDto): Promise<boolean>;
    sendWelcome({ name, email }: EmailSendDto): Promise<boolean>;
    sendWelcomeAdmin(
        { name, email }: EmailSendDto,
        { password }: EmailWelcomeAdminDto
    ): Promise<boolean>;
    sendTempPassword(
        { name, email }: EmailSendDto,
        { password }: EmailTempPasswordDto
    ): Promise<boolean>;
}
