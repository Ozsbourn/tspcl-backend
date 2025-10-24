import { type SponsorshipSubscription } from "@/prisma/generated";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PlanModel } from "../../plan/models/plan.model";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
    @Field(() => ID)
    public id: string;

    @Field(() => Date)
    public expiresAt: Date;

    @Field(() => PlanModel)
    public plan: PlanModel;
    @Field(() => String, { nullable: true })
    public planId: string;

    @Field(() => UserModel)
    public user: UserModel;
    @Field(() => String, { nullable: true })
    public userId: string;

    @Field(() => UserModel)
    public channel: UserModel;
    @Field(() => String, { nullable: true })
    public channelId: string;

    @Field(() => Date)
    public createdAt: Date;
    @Field(() => Date)
    public updatedAt: Date;
}
