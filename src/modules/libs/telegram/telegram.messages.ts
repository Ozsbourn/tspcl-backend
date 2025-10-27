import type { SponsorshipPlan, User } from "@/prisma/generated";
import type { SessionMetadata } from "@/src/shared/types/session-metadata.types";

export const MESSAGES = {
	welcome: `(｡･∀･)ﾉﾞ\n\n<b>Welcome to Streplat Bot</b>\n\n 
		If you want to get notification and improve your experienc, let's connect your Telegram with Streplat.\n\n
		Press the button below and go to the <b>Notifications</b> to complete a process. `,
	authSuccess: `╰(*°▽°*)╯ You successfuly authorized and your Telegram account was linked to Streplat!\n\n`,
	tokenNotFound: `Token not found!`,
	invalidToken: `＞﹏＜ Invalid or expired token!`,
	profile: (user: User, followersCount: number) =>
		`<b>User profile:</b>` +
		`Username: <b>${user.username}</b>` +
		`Email: <b>${user.email}</b>` +
		`Subs: <b>${followersCount}</b>` +
		`About me: <b>${user.bio || "There is empty..."}</b>` +
		`Press on the button below to come to the profile settings.`,
	follows: (user: User) =>
		`ヾ(≧▽≦*)o <a href="httpsL//streplat.ru/${user.username}">${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>Password reset request\n\n</b>` +
		`You requested a password reset to your account on <b>Streplat</b>.\n\n` +
		`To create a new password, please, click a link bellow:\n\n` +
		`<b><a href="https://streplat.ru/account/recovery/${token}">Reset password</a></b>\n\n` +
		`	<b>Date of request: ${new Date().toLocaleDateString()} in ${new Date().toLocaleTimeString()}</b>\n` +
		`	<b>Location: ${metadata.location.country}, ${metadata.location.city}</b>\n` +
		`	<b>OS: ${metadata.device.os}</b>\n` +
		`	<b>Browser: ${metadata.device.browser}</b>\n` +
		`	<b>IP: ${metadata.ip}</b>\n\n` +
		`If you didn't this request, so then ignore this message.`,
	deactivateAccount: (token: string, metadata: SessionMetadata) =>
		`<b>Account deactivation request\n\n</b>` +
		`You requested an account deactivation to your account on <b>Streplat</b>.\n\n` +
		`To verify yourt intentions, please, enter this verify code:.\n\n` +
		`To verify yourt intentions, please, enter this verify code:.\n\n` +
		`<b>Verify code: ${token}</b>\n\n` +
		`	<b>Date of request: ${new Date().toLocaleDateString()} in ${new Date().toLocaleTimeString()}</b>\n` +
		`	<b>Location: ${metadata.location.country}, ${metadata.location.city}</b>\n` +
		`	<b>OS: ${metadata.device.os}</b>\n` +
		`	<b>Browser: ${metadata.device.browser}</b>\n` +
		`	<b>IP: ${metadata.ip}</b>\n\n` +
		`If you didn't this request, so then ignore this message.\n\n` +
		`What will happened after a deactivation?\n` +
		`	• You automatically exit from your account and will lose an access to it.\n` +
		`	• If you don't cancel deactivation intention in a <b>7</b> days, your account will be completely deleted.\n` +
		`Note that if you change your mind in 7 days, you can cancel a deactivation process by write to our customer service.\n` +
		`If you have already changed your mind, just ignore this message and your account will keep an active.\n`,
	accountDeactivated:
		`<b>＞﹏＜</b> Your account was completely deleted.\n\n` +
		`Your account now has actually disapeared, so we, or any other guys, or even a God will not be able to get your data!\n` +
		`We love you and hope that someday you will return to us for create our new stories together.\n` +
		`See you soon, dear friend!\n` +
		`With pleasure, \nYour Streplat Team.`,
	streamStarted: (channel: User) =>
		`<b>Stream started on ${channel.displayName} channel!</b>\n\n` +
		`See here: <a href="https://streplat.ru/${channel.username}">Go to the stream</a>`,
	newFollowing: (follower: User, followersCount: number) =>
		`<b>You have new follower!</b>\n\n This is user <a href="https://streplat.ru/${follower.username}">${follower.displayName}</a>\n` +
		`Now you have ${followersCount} of followers.`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>You have new sponsor!</b>` +
		`You got new sponsorship on <b>${plan.title}</b> plan.` +
		`  Amount: <b>${plan.price}</b>` +
		`  Sponsor: <a href="https://streplat.ru/${sponsor.username}">${sponsor.displayName}</a>`,
	enableTwoFactor: `Force your defence. Enable two-factor authentication.`,
	verifyChannel:
		`ヾ(≧ ▽ ≦)ゝ <b>Congratulations! your channel was verified.</b>\n\n` +
		`Verification badge confirms that your channel is original and give more trust for your viewers or visitors.`,
};
