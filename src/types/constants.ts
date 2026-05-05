export type MessagesSuccess = object;

export interface MessagesNot {
  foundRoute: string;
}

export interface MessagesError {
  generic: string;
}

export type CodesSuccess = object;

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
}
