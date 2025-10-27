import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { MailService } from "../libs/mail/mail.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StorageService } from "../libs/storage/storage.service";
import { TelegramService } from "../libs/telegram/telegram.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7);

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo,
				},
			},
			include: {
				notificationSettings: true,
				stream: true,
			},
		});

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccoundDeletion(user.email);

			if (user.notificationSettings && user.telegramId) {
				await this.telegramService.sendAccountDeletion(user.telegramId);
			}

			if (user.avatar) this.storageService.remove(user.avatar as string);
			if (user.stream?.thumbnailUrl)
				this.storageService.remove(user.stream?.thumbnailUrl as string);
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo,
				},
			},
		});
	}

	@Cron("0 0 */4 * *")
	public async notifyUsersEnableTwoFactor() {
		const users = await this.prismaService.user.findMany({
			where: {
				isTotpEnabled: false,
			},
			include: {
				notificationSettings: true,
			},
		});

		for (const user of users) {
			await this.mailService.sendEnableTwoFactor(user.email);

			if (user.notificationSettings?.siteNotifications) {
				await this.notificationService.createEnableTwoFactor(user.id);
			}

			if (
				user.notificationSettings?.telegramNotifications &&
				user.telegramId
			) {
				await this.telegramService.sendEnableTwoFactor(user.telegramId);
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async verifyChannel() {
		const users = await this.prismaService.user.findMany({
			include: {
				notificationSettings: true,
			},
		});

		for (const user of users) {
			const followersCount = await this.prismaService.follow.count({
				where: {
					followingId: user.id,
				},
			});

			if (followersCount > 10 && !user.isVerified) {
				await this.prismaService.user.update({
					where: {
						id: user.id,
					},
					data: {
						isVerified: true,
					},
				});

				await this.mailService.sendVerifyChannel(user.email);

				if (user.notificationSettings?.siteNotifications) {
					await this.notificationService.createVerifyChannel(user.id);
				}

				if (
					user.notificationSettings?.telegramNotifications &&
					user.telegramId
				) {
					await this.telegramService.sendVerifyChannel(
						user.telegramId
					);
				}
			}
		}
	}
}
