import React from "react";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";

interface Notification {
  id: number;
  message: string;
  createdAt: Date;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>Recent Notifications</CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`mb-2 ${
                  notification.read ? "text-gray-500" : "font-bold"
                }`}
              >
                {notification.message}
                <span className="text-sm text-gray-400 ml-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
