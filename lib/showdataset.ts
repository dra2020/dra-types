// Per-user dataset show/hide settings.
//
// These used to live in the `showDatasets` and `hideDatasets` maps on the user record. Both grew
// without bound: a user who multi-selects the whole published dataset list and hits Show writes one
// key per dataset, and in production those two properties accounted for 27.9MB of 178.3MB of user
// record JSON - on a record that is cached in memory and returned whole by a dozen APIs. The worst
// single record spent 152KB on them. They now live in a `showdataset` table (see schemas.ts), one
// row per (user, dataset).
//
// A row is an *override of the default*, which is why one `show` boolean replaces the two maps: a
// dataset that is show-by-default needs a row only to hide it, and one that is hide-by-default needs
// a row only to show it. Setting a dataset back to its default tombstones the row rather than
// writing a redundant one, so the row count tracks the number of real exceptions.

/** One row of the `showdataset` table. */
export interface ShowDataset
{
  /** The dataset id. Unique per user, so the table is keyed by (createdBy, id). */
  id: string;
  /** The user this setting belongs to. Partition key. */
  createdBy: string;
  /** The override: true to show a hide-by-default dataset, false to hide a show-by-default one. */
  show: boolean;
  /** The setting went back to the default for this dataset. Tombstoned rather than deleted so the
   *  client cache can be told the override is gone; the expungeDeleted lambda reclaims these. */
  deleted?: boolean;
}
