import { ConfigService } from "@nestjs/config";
import type { TelegrafModuleOptions } from "nestjs-telegraf";

export function getTelegraphConfig(
	configService: ConfigService
): TelegrafModuleOptions {
	return {
		token: configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN"),
	};
}
