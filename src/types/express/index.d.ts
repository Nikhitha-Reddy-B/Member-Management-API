import { MemberPayload } from '../memberPayload';

declare global {
  namespace Express {
    interface Locals {
      member?: MemberPayload;
    }
  }
}
