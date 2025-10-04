import { Args, Query, Resolver } from "@nestjs/graphql";
import { StreamService } from "./stream.service";
import { StreamModel } from "./models/stream.model";
import { StreamsQueryBoundariesInput } from "./input/streams-query-boundaries.input";

@Resolver("Stream")
export class StreamResolver {
    public constructor(private readonly streamService: StreamService) {}

    @Query(() => [StreamModel], { name: 'findAllStreams' })
    public async findAll(@Args('boundaries') input: StreamsQueryBoundariesInput){
        return this.streamService.findAll(input);
    }
}
