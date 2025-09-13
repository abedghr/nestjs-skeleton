import { EmailSendDto } from 'src/modules/email/dtos/email.send.dto';
import { EmailTempPasswordDto } from 'src/modules/email/dtos/email.temp-password.dto';
import { EmailWelcomeAdminDto } from 'src/modules/email/dtos/email.welcome-admin.dto';

export interface IEmailProcessor {
    processWelcome(data: EmailSendDto): Promise<boolean>;
    processWelcomeAdmin(
        { name, email }: EmailSendDto,
        { password }: EmailWelcomeAdminDto
    ): Promise<boolean>;
    processChangePassword(data: EmailSendDto): Promise<boolean>;
    processTempPassword(
        { name, email }: EmailSendDto,
        { password }: EmailTempPasswordDto
    ): Promise<boolean>;
}
