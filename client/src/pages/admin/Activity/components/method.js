import { COLORS } from "../../../../constants/color";
import { ActionTypes } from "./activityLog";

export const getActionType = (status) => {
  switch (status) {
    case ActionTypes.AUTHENTICATION:
      return COLORS.error; // Example: Authentication actions in an info color
    case ActionTypes.ACCOUNT_MANAGEMENT:
      return COLORS.success; // Example: Account management actions in a success color
    case ActionTypes.PROFILE_MANAGEMENT:
      return COLORS.accent; // Example: Profile management actions in an accent color
    case ActionTypes.MESSAGING:
      return COLORS.primary; // Example: Messaging actions in a primary color
    case ActionTypes.SERVICE_REQUEST:
      return COLORS.secondary; // Example: Service request actions in a secondary color
    case ActionTypes.INVENTORY_MANAGEMENT:
      return COLORS.warning; // Example: Inventory management actions in a warning color
    case ActionTypes.ORDER_MANAGEMENT:
      return COLORS.success; // Example: Order management actions in a success color
    case ActionTypes.LAUNDRY_MANAGEMENT:
      return COLORS.in_laundry; // Example: Laundry management actions in a custom laundry color
    case ActionTypes.FINANCIAL_TRANSACTION:
      return COLORS.error; // Example: Financial transactions in an error color for emphasis
    case ActionTypes.ADMINISTRATIVE:
      return COLORS.at_store; // Example: Administrative actions in an at-store color
    case ActionTypes.SYSTEM_EVENT:
      return COLORS.accent; // Example: System events in an accent color
    default:
      return COLORS.secondary; // Default color if no action type matches
  }
};
