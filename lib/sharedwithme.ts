// "Shared with me" list management.
//
// A user's shared-with-me list used to live in the `accessed` map on the user record, which grew
// without bound - in production it reached 3,715 entries and 208KB for a single active user, on a
// record that is cached in memory and returned whole by a dozen APIs. It now lives in its own
// `sharedwithme` table (see schemas.ts), one record per (user, access id).

/**
 * How many shared-with-me records a user keeps.
 *
 * Enforced by the expungeDeleted lambda, which runs periodically for active users - not on write. The
 * list is therefore allowed to drift above this between runs, which is deliberate: it was entirely
 * unbounded before, and the records are no longer on the hot user record.
 *
 * Also the cap applied when migrating a user's old `accessed` map into the new table.
 */
export const SHARED_WITH_ME_LRU_SIZE = 50;

/** One row of the `sharedwithme` table. */
export interface SharedWithMe
{
  /** The access id - the same id used for a record in the `access` table. NOT unique on its own: a
   *  share link is one access id used by many users, so the table is keyed by (createdBy, id). */
  id: string;
  /** The user this list entry belongs to. Partition key. */
  createdBy: string;
  /** When the user last accessed this map. Drives the LRU cull. */
  modifyTime: string;
  /** The user explicitly removed this map from their list, or their access went away. Tombstoned
   *  rather than deleted so a later access can resurrect it by setting this back to false. */
  deleted?: boolean;
}
