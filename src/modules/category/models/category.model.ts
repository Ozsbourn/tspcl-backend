import type { Category } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { StreamModel } from "../../stream/models/stream.model";

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	public id: string;

	@Field(() => String)
	public title: string;

	@Field(() => String)
	public slug: string;

	@Field()
	public description: string;

	@Field(() => String, { nullable: true })
    public thumbnailUrl: string;

    @Field(() => [StreamModel])
    public streams: StreamModel;

	@Field(() => Date)
	public createdAt: Date;

	@Field(() => Date)
	public updatedAt: Date;
};
