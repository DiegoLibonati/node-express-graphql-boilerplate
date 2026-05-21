import type { CodesError, CodesNot, CodesSuccess } from "@/types/constants";

export const CODES_SUCCESS: CodesSuccess = {
  healthLive: "SUCCESS_HEALTH_LIVE",
  healthReady: "SUCCESS_HEALTH_READY",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
  validation: "ERROR_VALIDATION",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
};
