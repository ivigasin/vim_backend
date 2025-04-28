import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    public sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          await this.notificationService.sendNotification(req.body);
          res.status(200).json({ message: 'Notification sent successfully.' });
        } catch (error) {
            next(error);
        }
    }
}