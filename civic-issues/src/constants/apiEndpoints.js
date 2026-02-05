/**
 * Re-export all endpoint groups from the canonical source.
 * Components may import from either location:
 *   import { AUTH } from '../api/endpoints';
 *   import { AUTH } from '../constants/apiEndpoints';
 */
export {
  AUTH,
  DEPARTMENTS,
  ADMIN,
  OFFICER,
  CITIZEN,
  EMERGENCY,
  REPORTS,
  HEALTH,
} from '../api/endpoints';