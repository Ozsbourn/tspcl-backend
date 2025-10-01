import { PrismaService } from "@/src/core/prisma/prisma.service";
import {
	type CanActivate,
	Injectable,
	type ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		console.log(`context in gqlAuthGurd: ${context}`);

		if (typeof request.session.userId === "undefined") {
			throw new UnauthorizedException(`User isn't authorized`);
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId,
			},
		});

		request.user = user;
		return true;
	}
}
