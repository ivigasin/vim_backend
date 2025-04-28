import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { UserRepository } from '../repositories/user.repository';
import { NotificationPubSub } from '../pubsub/notification.pubsub';
import { validateRequest } from '../middlewares/validation.middleware'; // Import validation middleware
import { sendNotificationSchema } from '../validators/notification.validator'; // Import the schema

export const createNotificationRouter = (userRepository: UserRepository, notificationPubSub: NotificationPubSub) => {
  const router = Router();

  const notificationService = new NotificationService(userRepository, notificationPubSub);
  const notificationController = new NotificationController(notificationService);

  
  router.post('/', validateRequest(sendNotificationSchema), notificationController.sendNotification);

  return router;
}
