import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { StreamsQueryBoundariesInput } from "./input/streams-query-boundaries.input";
import type { Prisma } from "@/prisma/generated";

@Injectable()
export class StreamService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll(input: StreamsQueryBoundariesInput) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined;

		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false,
				},
				...whereClause,
			},
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return streams;
	}

	private findBySearchTermFilter(
		searchTerm: string
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: "insensitive",
					},
				},
				{
					user: {
						username: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
				},
			],
		};
	}
}
