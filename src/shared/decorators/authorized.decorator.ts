import type { User } from "@/prisma/generated";
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User;

		if (ctx.getType() === "http") {
			user = ctx.switchToHttp().getRequest().user;
			console.log(`http-user: ${user}`);
		} else {
			const context = GqlExecutionContext.create(ctx);
			user = context.getContext().req.user;
			console.log(`gql-user: ${user}`);
		}

		console.log(`Data: ${data}`);
		console.log(`Data[user]: ${user}`);
		return data ? user[data] : user;
	}
);
