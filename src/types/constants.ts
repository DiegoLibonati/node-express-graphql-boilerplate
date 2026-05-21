export interface MessagesSuccess {
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
}

export interface MessagesError {
  generic: string;
  validation: string;
}

export interface CodesSuccess {
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
  validation: "ERROR_VALIDATION";
}
