import express,  { Application } from 'express';
import { createUserRouter } from './routes/user.routes';
import { createNotificationRouter } from './routes/notification.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import  { config } from './config/config';
import { UserRepository } from './repositories/user.repository';
import { NotificationPubSub } from './pubsub/notification.pubsub';
const app: Application = express();

const userRepository = new UserRepository();
const notificationPubSub = new NotificationPubSub();

app.use(express.json());

app.use(authMiddleware(config.allowedUsername));

app.use('/users', createUserRouter(userRepository));
app.use('/notification', createNotificationRouter(userRepository, notificationPubSub));

app.use(errorMiddleware);

export default app;
