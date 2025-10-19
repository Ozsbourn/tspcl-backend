import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { StripeService } from "../../libs/stripe/stripe.service";
import { User } from "@/prisma/generated";
import { CreatePlanInput } from "./inputs/create-plan.input";

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id,
			},
		});

		return plans;
	}

	public async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input;

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id,
			},
		});
		if (!channel?.isVerified) {
			throw new ForbiddenException(
				"Plan cration allow only for verified users."
			);
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: "rub",
			interval: "month",
			product: {
				name: title,
			},
		});

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan.product!.toString(),
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return true;
	}
}
