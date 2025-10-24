import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    RawBody,
    UnauthorizedException,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
    public constructor(private readonly webhookService: WebhookService) {}

    @Post("livekit")
    @HttpCode(HttpStatus.OK)
    public async receiveWebhookLiveKit(
        @Body() body: string,
        @Headers("Authorization") authorization: string
    ) {
        if (!authorization) {
            throw new UnauthorizedException("Missed authorization header");
        }

        return this.webhookService.receiveWebhookLiveKit(body, authorization);
    }

    @Post("stripe")
    @HttpCode(HttpStatus.OK)
    public async reciveStripeWebhook(
        @RawBody() rawBody: string,
        @Headers("stripe-signature") sig: string
    ) {
        if (!sig) {
            throw new UnauthorizedException(
                `There isn't Stripe signature at headers`
            );
        }

        const event = this.webhookService.constructStripeEvent(rawBody, sig);
        await this.webhookService.reciveStripeWebhook(event);
    }
}
