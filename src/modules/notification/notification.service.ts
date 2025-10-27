import {
	TokenType,
	type User,
	NotificationType,
	type SponsorshipPlan,
} from "@/prisma/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ChangeNotificationSettingsInput } from "./inputs/change-notification-settings.input";
import { generateToken } from "@/src/shared/utils/generate-token.util";

@Injectable()
export class NotificationService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				isRead: false,
				userId: user.id,
			},
		});

		return count;
	}

	public async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id,
			},
			data: {
				isRead: true,
			},
		});

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return notifications;
	}

	public async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>Don't miss it</b><p>Join to stream on channel <a href='/${channel.username}' className='font-semibold'>${channel.displayName}</a></p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createNewFollowing(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className='font-medium'>You got a new follower</b><p>This is a <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a></p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createNewSponsorship(
		userId: string,
		plan: SponsorshipPlan,
		sponsor: User
	) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">You have new sponsor!</b><p>User <a href="/${sponsor.username}">${sponsor.displayName}</a> became your sponsor with <strong>${plan.title}</strong> plan.</p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return notification;
	}

	public async createEnableTwoFactor(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">Protect your account</b><p>Enable two-factor authentication in settings of your account.</p>`,
				type: NotificationType.ENABLE_TWO_FACTOR,
				userId,
			},
		});

		return notification;
	}

	public async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b className="font-medium">Congratulations!</b><p>Your channel was verified and since now with your channel name will be stand apart verification badge.</p>`,
				type: NotificationType.VERIFIED_CHANNEL,
				userId,
			},
		});

		return notification;
	}

	public async changeSettings(
		user: User,
		input: ChangeNotificationSettingsInput
	) {
		const { siteNotifications, telegramNotifications } = input;

		const notificationSettings =
			await this.prismaService.notificationSettings.upsert({
				where: {
					userId: user.id,
				},
				create: {
					siteNotifications,
					telegramNotifications,
					user: {
						connect: {
							id: user.id,
						},
					},
				},
				update: {
					siteNotifications,
					telegramNotifications,
				},
				include: {
					user: true,
				},
			});

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user?.telegramId
		) {
			const token = await generateToken(
				this.prismaService,
				user,
				TokenType.TELEGRAM_AUTH
			);

			return {
				notificationSettings,
				telegramAuthToken: token.token,
			};
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user?.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: user.id,
				},
				data: {
					telegramId: null,
				},
			});

			return { notificationSettings };
		}

		return { notificationSettings };
	}
}
