import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookLiveKit(@Body() body: string, @Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Missed authorization header');
    }

    return this.webhookService.receiveWebhookLiveKit(body, authorization);
  }
}
