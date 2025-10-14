import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/prisma/generated';
import { NotificationModel } from './models/notification.model';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { ChangeNotificationSettingsResponse } from './models/notification-settings.model';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';

@Resolver('Notification')
export class NotificationResolver {
  public constructor(private readonly notificationService: NotificationService) {}

  @Query(() => Number, { name: 'findUnreadNotificationsCount' })
  public async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Authorization()
  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  public async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Authorization()
  @Mutation(() => ChangeNotificationSettingsResponse, {
    name: 'changeNotificationSettingsResponse'
  })
  public async changeSettings(@Authorized() user: User, @Args('data') input: ChangeNotificationSettingsInput) {
    this.notificationService.changeSettings(user, input);
  }
}
