import type { TypeLiveKitOptions } from "@/src/modules/libs/livekit/types/livekit.types";
import { ConfigService } from "@nestjs/config";

export function getLiveKitConfig(configService: ConfigService): TypeLiveKitOptions {
	return {
		apiUrl: configService.getOrThrow<string>('LIVEKIT_API_URL'),
		apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),
		apicSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
	};
};