import type { SponsorshipPlan } from "@/prisma/generated";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, ID } from "@nestjs/graphql";

export class PlanModel implements SponsorshipPlan {
   	@Field(() => ID)
    public id: string;

    @Field(() => String)
    public title: string;
    @Field(() => String, { nullable: true })
    public description: string;
    @Field(() => Number)
    public price: number;

    @Field(() => String)
    public stripeProductId: string;
    @Field(() => String)
    public stripePlanId: string;

    public channel: UserModel;
    @Field(() => String, { nullable: true })
    public channelId: string;
    
    @Field(() => Date)
    public createdAt: Date;
    @Field(() => Date)
    public updatedAt: Date;
}