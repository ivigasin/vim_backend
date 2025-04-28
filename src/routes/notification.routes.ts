import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { UserRepository } from '../repositories/user.repository';
import { NotificationPubSub } from '../pubsub/notification.pubsub';

export const createNotificationRouter = (userRepository: UserRepository, notificationPubSub: NotificationPubSub) => {
  const router = Router();

  const notificationService = new NotificationService(userRepository, notificationPubSub);
  const notificationController = new NotificationController(notificationService);

  router.post('/', notificationController.sendNotification);

  return router;
}
