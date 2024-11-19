import { Controller, Get } from '@nestjs/common';
import { MailerServiceService } from './mailer-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailerServiceController {
  constructor(private readonly mailerServiceService: MailerServiceService) {}

  @EventPattern('send-mail')
  sendMail(@Payload() payload: any): string {
    console.log(payload);
    return this.mailerServiceService.getHello();
  }
}
