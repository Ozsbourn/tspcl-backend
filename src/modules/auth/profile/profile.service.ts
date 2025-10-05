import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { StorageService } from "../../libs/storage/storage.service";
import type { User } from "@/prisma/generated";
import sharp from "sharp";
import { Upload } from "graphql-upload-ts/upload";
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input";
import {
	SocialLinkInput,
	SocialLinkOrderInput,
} from "./inputs/social-link.input";

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	public async changeAvatar(user: User, uploadedEntity: Upload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar);
		}

		const chunks: Array<Buffer> = [];
		for await (const chunk of uploadedEntity.file!.createReadStream()) {
			chunk.push(chunk);
		}

		const buffer = Buffer.concat(chunks);
		const fileName = `/channels/${user.username}.webp`;

		if (
			uploadedEntity.file!.filename &&
			uploadedEntity.file!.filename.endsWith(".gif")
		) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				"image/webp"
			);
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(512, 512)
				.webp()
				.toBuffer();

			await this.storageService.upload(
				processedBuffer,
				fileName,
				"image/webp"
			);
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: fileName,
			},
		});

		return true;
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) {
			return;
		}

		await this.storageService.remove(user.avatar);
		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: null,
			},
		});

		return true;
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input;

		const usernameExists = await this.prismaService.user.findUnique({
			where: {
				username,
			},
		});
		if (usernameExists && username !== user.username) {
			throw new ConflictException("This user already exists.");
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				username: username,
				displayName: displayName,
				bio: bio,
			},
		});

		return true;
	}

	public async getSocialLinks(user: User) {
		const socialLinks = await this.prismaService.socialLink.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				position: "asc",
			},
		});

		return socialLinks;
	}

	public async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input;
		const lastSocialLink = await this.prismaService.socialLink.findFirst({
			where: {
				userId: user.id,
			},
			orderBy: {
				position: "desc",
			},
		});

		const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1;
		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position: newPosition,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}

	public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
		if (!list.length) {
			return;
		}

		const updatePromises = list.map((socialLink) => {
			return this.prismaService.socialLink.update({
				where: {
					id: socialLink.id,
				},
				data: {
					position: socialLink.position,
				},
			});
		});

		await Promise.all(updatePromises);
		return true;
	}

	public async updateSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input;

		await this.prismaService.socialLink.update({
			where: {
				id,
			},
			data: {
				title,
				url,
			},
		});

		return true;
	}

	public async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: {
				id,
			},
		});

		return true;
	}
}
