import { Markup } from "telegraf";

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback("My followings", "followings"),
			Markup.button.callback("Show profile", "me"),
		],
		[Markup.button.url("To the website", "https://streplat.ru")],
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			"Account settings",
			"https://streplat.ru/dashboard/settings"
		),
	]),
};
