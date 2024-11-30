export const NotificationStatus = {
  PENDING_PICKUP: "Pending Pickup",
  ONGOING_PICKUP: "Ongoing Pickup",
  COMPLETED_PICKUP: "Completed Pickup",
  AT_STORE: "At Store",
  IN_QUEUE: "In Queue",
  IN_LAUNDRY: "In Laundry",
  LAUNDRY_COMPLETED: "Laundry Completed",
  LAUNDRY_COMPLETED_CUSTOMER: "Laundry Completed",
  READY_FOR_DELIVERY: "Ready for Delivery",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED_DELIVERY: "Completed Delivery",
  CANCELED: "Canceled",
};

export const NotificationDescriptions = {
  // FOR STAFF TO SEE

  [NotificationStatus.PENDING_PICKUP]: (userName, serviceType) =>
    `A ${serviceType} service has been requested by ${userName}, but the clothes are still awaiting pickup.`,

  // FOR CUSTOMER TO SEE
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

  [NotificationStatus.LAUNDRY_COMPLETED]: (customerName) =>
    `Laundry process completed for ${customerName}'s clothes.`,

  [NotificationStatus.READY_FOR_DELIVERY]: (customerName) =>
    `${customerName}'s clothes are ready to be delivered back to them.`,

  [NotificationStatus.OUT_FOR_DELIVERY]: (customerName) =>
    `The delivery staff is on the way to deliver clothes to ${customerName}.`,

  [NotificationStatus.COMPLETED_DELIVERY]: (customerName) =>
    `Delivery completed for ${customerName}. Payment has been confirmed.`,

  [NotificationStatus.CANCELED]: () =>
    `Your service request have been canceled.`,
};
