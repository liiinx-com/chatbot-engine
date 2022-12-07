export interface User {
  id: number;
  name: string;
}

export interface IncomingMessage {
  text: string;
  user: User;
}

export const ERRORS = {
  STEP_NOT_FOUND: 'STEP_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
};
