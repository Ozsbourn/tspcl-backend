import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { VerificationTemplate } from "./templates/verification.template";
import { render } from "@react-email/components";
import { PasswordRecoveryTemplate } from "./templates/password-recovery.template";
import { SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { DeactivateTemplate } from "./templates/deactivate.template";
import { AccountDeletionTemplate } from "./templates/account-deletion.template";

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
		const html = await render(VerificationTemplate({ domain, token }));

		return this.sendMail(email, "Account Verification", html);
	}

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata })
		);

		return this.sendMail(email, "Password Reset", html);
	}

	public async sendDeactivationToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const html = await render(DeactivateTemplate({ token, metadata }));

		return this.sendMail(email, "Account Deactivation", html);
	}

	public async sendAccoundDeletion(email: string) {
		const html = await render(AccountDeletionTemplate());

		return this.sendMail(email, "Account deleted", html);
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
