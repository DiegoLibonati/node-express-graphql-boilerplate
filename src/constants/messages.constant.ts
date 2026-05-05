import type { MessagesSuccess, MessagesError, MessagesNot } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {};

export const MESSAGES_ERROR: MessagesError = {
  generic: "[GraphQL] Something went wrong!",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "[GraphQL] Route not found.",
};
