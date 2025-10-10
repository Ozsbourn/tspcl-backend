import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StreamService } from "./stream.service";
import { StreamModel } from "./models/stream.model";
import { StreamsQueryBoundariesInput } from "./input/streams-query-boundaries.input";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { ChangeStreamInfoInput } from "./input/change-stream-info.input";
import type { User } from "@/prisma/generated";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { Upload } from "graphql-upload-ts/upload";
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe";
import { GraphQLUpload } from "graphql-upload-ts/graphql-upload";
import { GenerateStreamTokenModel } from "./models/generate-token.model";
import { GenerateStreamTokenInput } from "./input/generate-stream-token.input";

@Resolver("Stream")
export class StreamResolver {
    public constructor(private readonly streamService: StreamService) {}

    @Query(() => [StreamModel], { name: "findAllStreams" })
    public async findAll(
        @Args("boundaries") input: StreamsQueryBoundariesInput
    ) {
        return this.streamService.findAll(input);
    }

    @Query(() => [StreamModel], { name: "findRandomStreams" })
    public async findRandomStreams() {
        return this.streamService.findRandom();
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "changeStreamInfo" })
    public async changeInfo(
        @Authorized() user: User,
        @Args("data") input: ChangeStreamInfoInput
    ) {
        return this.streamService.changeStreamInfo(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "changeStreamThumbnail" })
    public async changeStreamThumbnail(
        @Authorized() user: User,
        @Args("thumbnail", { type: () => GraphQLUpload }, FileValidationPipe)
        thumbnail: Upload
    ) {
        return this.streamService.changeStreamThumbnail(user, thumbnail);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "removeStreamThumbnail" })
    public async removeStreamThumbnail(@Authorized() user: User) {
        return this.streamService.removeStreamThumbnail(user);
    }

    @Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
    public async generateStreamToken(@Args('data') input: GenerateStreamTokenInput) {
        return this.streamService.generateToken(input);
    }
}
