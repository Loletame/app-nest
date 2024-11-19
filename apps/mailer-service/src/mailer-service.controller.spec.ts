import { Test, TestingModule } from '@nestjs/testing';
import { MailerServiceController } from './mailer-service.controller';
import { MailerServiceService } from './mailer-service.service';

describe('MailerServiceController', () => {
  let mailerServiceController: MailerServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailerServiceController],
      providers: [MailerServiceService],
    }).compile();

    mailerServiceController = app.get<MailerServiceController>(MailerServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mailerServiceController.getHello()).toBe('Hello World!');
    });
  });
});
