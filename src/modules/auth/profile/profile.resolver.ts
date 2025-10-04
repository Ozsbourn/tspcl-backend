import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { GraphQLUpload } from 'graphql-upload-ts';
import { Upload } from 'graphql-upload-ts';
import type { User } from '@/prisma/generated';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';

@Resolver('Profile')
export class ProfileResolver {
  public constructor(private readonly profileService: ProfileService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeUserAvatar' })
  public async changeAvatar(@Authorized() user: User, @Args('avatar', {type: () => GraphQLUpload}, FileValidationPipe) avatar: Upload) {
    return this.profileService.changeAvatar(user, avatar);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeUserAvatar' })
  public async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeUserInfo' })
  public async changeInfo(@Authorized() user: User, @Args('data') input: ChangeProfileInfoInput) {
    return this.profileService.changeInfo(user, input);
  }
}
