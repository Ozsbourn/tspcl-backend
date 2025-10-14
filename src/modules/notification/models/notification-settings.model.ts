import { Field, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import type { NotificationSettings } from "@/prisma/generated";

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {

	@Field(() => String)
	public id: string

	@Field(() => Boolean)
	public siteNotifications: boolean;
	@Field(() => Boolean)
	public telegramNotifications: boolean;

	@Field(() => String)
	public userId: string;
	@Field(() => UserModel)
	public user: UserModel;

	@Field(() => Date)
	public createdAt: Date;
	@Field(() => Date)
	public updatedAt: Date;
};

@ObjectType()
export class ChangeNotificationSettingsResponse {
	@Field(() => NotificationSettingsModel)
	public notificationsSettings: NotificationSettingsModel;

	@Field(() => String, { nullable: true })
	public telegramAuthToken?: string;
}