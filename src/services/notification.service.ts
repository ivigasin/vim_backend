import { BadRequestError } from '../error/badrequest';
import { NotFoundError } from '../error/notfound.error';
import { NotificationPubSub } from '../pubsub/notification.pubsub';
import { UserRepository } from '../repositories/user.repository';


interface SendNotificationRequest {
    userId?: string;
    email?: string;
    message: string;
  }

export class NotificationService {
    constructor(
        private userRepository: UserRepository,
        private notificationPubSub: NotificationPubSub
    ) {}

    public sendNotification = async (request: SendNotificationRequest): Promise<void> => {
        const { userId, email, message } = request;

        if(!message || (!userId && !email)) {
            throw new BadRequestError('Missing required fields');
        }
    
        const user = this.userRepository.findUserByCriteria({ userId , email });
        if(!user) {
            throw new NotFoundError('User not found');
        }

        //executinf asybcronously without waiting for the result
        this.notificationPubSub.dispatch(user, message);
    }
}