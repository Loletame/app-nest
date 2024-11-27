import { Module } from '@nestjs/common';
import { MailerServiceController } from './mailer-service.controller';
import { MailerServiceService } from './mailer-service.service';

@Module({
  imports: [],
  controllers: [MailerServiceController],
  providers: [MailerServiceService],
})
export class MailerServiceModule {}
