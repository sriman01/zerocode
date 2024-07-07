import { v4 as uuidv4 } from 'uuid';

export type Uuid = string;

export function generateUuid(): Uuid {
  return uuidv4() as Uuid;
}
