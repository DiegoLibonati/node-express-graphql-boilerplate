import type { MessagesSuccess, MessagesError, MessagesNot } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  healthLive: "Service is alive.",
  healthReady: "Service is ready.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "[GraphQL] Something went wrong!",
  validation: "Validation failed.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "[GraphQL] Route not found.",
};
