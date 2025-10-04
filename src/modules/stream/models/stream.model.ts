import type { Stream } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
	public id: string;

	@Field(() => String)
	title: string;
	@Field(() => String, { nullable: true })
    thumbnailUrl: string;

    @Field(() => String, { nullable: true })
    ingressId: string;
    @Field(() => String, { nullable: true })
    serverUrl: string;
    @Field(() => String, { nullable: true })
    streamKey: string;

    @Field(() => Boolean)
    isLive: boolean;

    @Field(() => UserModel)
    user: UserModel;
	@Field(() => String)
    userId: string;

	@Field(() => Date)
	public createdAt: Date;
	@Field(() => Date)
	public updatedAt: Date;
}
