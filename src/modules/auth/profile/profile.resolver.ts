import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import { GraphQLUpload } from "graphql-upload-ts";
import { Upload } from "graphql-upload-ts";
import type { User } from "@/prisma/generated";
import { Authorized } from "@/src/shared/decorators/authorized.decorator";
import { Authorization } from "@/src/shared/decorators/auth.decorator";
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe";
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input";
import {
    SocialLinkInput,
    SocialLinkOrderInput,
} from "./inputs/social-link.input";

@Resolver("Profile")
export class ProfileResolver {
    public constructor(private readonly profileService: ProfileService) {}

    @Authorization()
    @Mutation(() => Boolean, { name: "changeUserAvatar" })
    public async changeAvatar(
        @Authorized() user: User,
        @Args("avatar", { type: () => GraphQLUpload }, FileValidationPipe)
        avatar: Upload
    ) {
        return this.profileService.changeAvatar(user, avatar);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "removeUserAvatar" })
    public async removeAvatar(@Authorized() user: User) {
        return this.profileService.removeAvatar(user);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "changeUserInfo" })
    public async changeInfo(
        @Authorized() user: User,
        @Args("data") input: ChangeProfileInfoInput
    ) {
        return this.profileService.changeInfo(user, input);
    }

    @Authorization()
    @Query(() => Boolean, { name: "getSocialLinks" })
    public async getSocialLinks(@Authorized() user: User) {
        return this.profileService.getSocialLinks(user);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "createUserSocialLink" })
    public async createSocialLink(
        @Authorized() user: User,
        @Args("data") input: SocialLinkInput
    ) {
        return this.profileService.createSocialLink(user, input);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "reorderUserSocialLinks" })
    public async reorderSocialLinks(
        @Args("list", { type: () => [SocialLinkOrderInput] })
        list: SocialLinkOrderInput[]
    ) {
        return this.profileService.reorderSocialLinks(list);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "updateUserSocialLink" })
    public async updateSocialLink(
        @Args("id") id: string,
        @Args("data") input: SocialLinkInput
    ) {
        return this.profileService.updateSocialLink(id, input);
    }

    @Authorization()
    @Mutation(() => Boolean, { name: "removeUserSocialLink" })
    public async removeSocialLink(@Args("id") id: string) {
        return this.profileService.removeSocialLink(id);
    }
}
