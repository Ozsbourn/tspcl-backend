import { Query, Resolver } from "@nestjs/graphql";
import { SubscriptionService } from "./subscription.service";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { SubscriptionModel } from "./models/subscription.model";
import type { User } from "@/prisma/generated";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";

@Resolver("Subscription")
export class SubscriptionResolver {
    public constructor(
        private readonly subscriptionService: SubscriptionService
    ) {}

    @Authorization()
    @Query(() => [SubscriptionModel], { name: "findMySponsors" })
    public async findMySponsors(@Authorized() user: User) {
        return this.subscriptionService.findMySponsors(user);
    }
}
