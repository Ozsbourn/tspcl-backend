import { Global, Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { TelegrafModule } from "nestjs-telegraf";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getTelegraphConfig } from "@/src/core/config/telegraf.config";

@Global()
@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getTelegraphConfig,
            inject: [ConfigService],
        }),
    ],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}
