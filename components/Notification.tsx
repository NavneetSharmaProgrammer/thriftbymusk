import React from 'react';
import { useCart } from '../CartContext.tsx';
import { CheckCircleIcon } from './Icons.tsx';

/**
 * A "toast" style notification component that appears briefly at the bottom of the screen.
 * It's used to give users feedback, for example, when an item is added to their cart.
 * Its visibility and message are controlled by the `notification` state in the CartContext.
 */
const Notification: React.FC = () => {
  // Get the notification state from the CartContext.
  const { notification } = useCart();

  // If there is no notification object, the component renders nothing.
  if (!notification) {
    return null;
  }

  // When a notification object exists, the component renders the toast message.
  // The CartContext handles clearing the notification after a few seconds.
  return (
    <div
      className="toast-notification animate-fade-in"
      role="status" // Informs screen readers that this element's content may change.
      aria-live="polite" // Informs screen readers to announce changes politely without interrupting the user.
    >
      <div className="flex items-center gap-3">
        <CheckCircleIcon className="w-5 h-5 text-[var(--color-background)] flex-shrink-0" />
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;