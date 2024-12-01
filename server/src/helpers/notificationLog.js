export const NotificationStatus = {
  RETURN_TO_PENDING: "Pending Pickup",
  ONGOING_PICKUP: "Ongoing Pickup",
  COMPLETED_PICKUP: "Completed Pickup",
  AT_STORE: "At Store",
  IN_QUEUE: "In Queue",
  IN_LAUNDRY: "In Laundry",
  LAUNDRY_COMPLETED_CUSTOMER: "Your Laundry is Completed",
  READY_FOR_DELIVERY_CUSTOMER: "Ready for Delivery",
  OUT_FOR_DELIVERY_CUSTOMER: "Out for Delivery",
  COMPLETED_DELIVERY_CUSTOMER: "Completed Delivery",
  ATTEMPTED_DELIVERY_CUSTOMER: "Attempted Delivery",
  CANCELED: "Canceled",

  // For Staff
  PENDING_PICKUP_SENT_TO_STAFF: "Request By Customer",
  READY_FOR_DELIVERY_STAFF: "Delivery Ready for Staff",
  OUT_FOR_DELIVERY_STAFF: "Staff Delivering",
  COMPLETED_DELIVERY_STAFF: "Staff Completed Delivery",
};

export const NotificationDescriptions = {
  // FOR CUSTOMER TO SEE
  [NotificationStatus.RETURN_TO_PENDING]: (userName) =>
    `Your service request has been returned to pending status by ${userName}, the pickup staff. Please await further updates.`,

  [NotificationStatus.ONGOING_PICKUP]: (userName) =>
    `Your service request has been assigned, and the pickup staff is on their way to pick up your clothes from ${userName}'s location.`,

  [NotificationStatus.COMPLETED_PICKUP]: () =>
    `The pickup has been completed. Your clothes have been successfully collected by the pickup staff.`,

  [NotificationStatus.AT_STORE]: () =>
    `Your clothes have been dropped off at the laundry store.`,

  [NotificationStatus.IN_QUEUE]: () =>
    `Your clothes are currently waiting for an available laundry unit.`,

  [NotificationStatus.IN_LAUNDRY]: () =>
    `Your clothes are in the process of being cleaned or dried.`,

  [NotificationStatus.LAUNDRY_COMPLETED_CUSTOMER]: () =>
    `The laundry process for your clothes has been completed.`,

  [NotificationStatus.READY_FOR_DELIVERY_CUSTOMER]: () =>
    `Your clothes are ready to be delivered back to you.`,

  [NotificationStatus.OUT_FOR_DELIVERY_CUSTOMER]: (userName) =>
    `The delivery staff, ${userName}, is on the way to deliver your clothes.`,

  [NotificationStatus.COMPLETED_DELIVERY_CUSTOMER]: (userName) =>
    `The delivery staff, ${userName}, has successfully delivered your clothes.`,

  [NotificationStatus.ATTEMPTED_DELIVERY_CUSTOMER]: (userName) =>
    `The delivery staff, ${userName}, attempted to deliver your clothes, but the delivery was unsuccessful.`,

  [NotificationStatus.CANCELED]: () =>
    `Your service request have been canceled.`,

  // FOR STAFF TO SEE
  [NotificationStatus.PENDING_PICKUP_SENT_TO_STAFF]: (userName, serviceType) =>
    `A ${serviceType} service has been requested by ${userName}, but the clothes are still awaiting pickup.`,

  [NotificationStatus.READY_FOR_DELIVERY_STAFF]: (customerName) =>
    `${customerName}'s clothes are ready to be delivered back to them.`,

  [NotificationStatus.COMPLETED_DELIVERY_STAFF]: (customerName) =>
    `Delivery completed for ${customerName}. Payment has been confirmed.`,
};
