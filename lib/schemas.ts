export let Schemas: any = {
  'users':
    {
      FileOptions: { version: 5, name: 'users', map: false },
      Schema: {
        id: 'S',
        name: 'S',
        email: 'S',
        hashPW: 'S',
        verified: 'BOOL',
        admin: 'BOOL',
        roles: 'M',
        verifyGUID: 'S',
        resetGUID: 'S',
        resetTime: 'S',
        lastActive: 'S',
        modifyTime: 'S',
        resetCount: 'N',
        accessed: 'M',
        likeID: 'S',
        visitData: 'M',
        groups: 'M',
        cache: 'N',
        cached: 'N',
      },
      KeySchema: { id: 'HASH' },
      GlobalSecondaryIndexes: [
          { email: 'HASH' },
          { verifyGUID: 'HASH' },
          { resetGUID: 'HASH' },
        ],
    },
  'state':
    {
      FileOptions: { version: 7, name: 'sessions', map: true },
      Schema: {
        id: 'S',
        name: 'S',
        type: 'S',
        description: 'S',
        labels: 'L',
        flags: 'L',
        createdBy: 'S',
        lastActive: 'S',
        createTime: 'S',
        modifyTime: 'S',
        clientCount: 'N',
        maxClients: 'N',
        requestCount: 'N',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
        loadFailed: 'BOOL',
        accessMap: 'M',
        revisions: 'L',
        xprops: 'M',
        groups: 'M',
        xid: 'S',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { published: 'HASH' },
          { xid: 'HASH' },
          { id: 'HASH' }
        ],  // sparse
    },
  'expungestate':
    {
      FileOptions: { version: 7, name: 'sessions', map: true },
      Schema: {
        id: 'S',
        name: 'S',
        type: 'S',
        description: 'S',
        labels: 'L',
        createdBy: 'S',
        lastActive: 'S',
        createTime: 'S',
        modifyTime: 'S',
        clientCount: 'N',
        maxClients: 'N',
        requestCount: 'N',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
        loadFailed: 'BOOL',
        accessMap: 'M',
        revisions: 'L',
        xprops: 'M',
      },
      KeySchema: { id: 'HASH' },
      // Expunging a user's data queries this table by createdBy. Without the index that query
      // degrades to a full table scan (see DynamoCollection.toInternalQuery, which drops a filter it
      // cannot satisfy) - 1.4M records read to find the handful belonging to one user.
      GlobalSecondaryIndexes: [
          { createdBy: 'HASH' },
        ],
    },
  'splitblock':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        chunk: 'S',
        chunkKey: 'S',
        state: 'S',
        datasource: 'S',
        geoid: 'S',
        blocks: 'L'
      },
      KeySchema: { id: 'HASH' },
      GlobalSecondaryIndexes: [
          { chunkKey: 'HASH', id: 'RANGE' },
        ],
    },
  'blockset':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        chunk: 'S',
        chunkKey: 'S',
        chunkList: 'L',
        state: 'S',
        datasource: 'S',
        geoid: 'S',
        blocks: 'L'
      },
      KeySchema: { id: 'HASH' },
      GlobalSecondaryIndexes: [
          { state: 'HASH' },
        ],
    },
  'blockchunk':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        recompute: 'BOOL',
        splits: 'L',
      },
    },
  // One row per (user, access id) for the "Shared with Me" list. Keyed like the 'state' table -
  // createdBy as the partition key, id as the range - rather than by id alone, because a share link
  // is ONE access id used by many users (access.userIDs is empty in the live path), so id is not
  // unique: in a 400-user production sample, 631 of 3,515 access ids appeared for more than one user
  // and the worst was shared by 39. Making createdBy the partition key also makes the per-user query
  // native, so no secondary index is needed.
  'sharedwithme':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        createdBy: 'S',
        modifyTime: 'S',
        deleted: 'BOOL',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
    },
  // Keyed the same way as sharedwithme and for the same reason: one row per (user, dataset), with
  // createdBy as the partition key so the per-user query is native and needs no secondary index. A
  // row only ever exists as an exception to the dataset's default show value.
  // Enforces one account per email address.
  //
  // The users table is keyed by id and finds an account by email through a GSI, and GSIs are
  // EVENTUALLY consistent - DynamoDB does not even allow a consistent read on one. So the signup
  // check "is this email taken?" can legitimately answer no for an address written moments earlier,
  // and two signups close together both pass it and both create an account. This table is the
  // atomic gate: email is the partition key of a base table, so a conditional write against it is
  // decided under the item's own lock, with no index lag to race.
  //
  // Deliberately NOT backfilled from users: the GSI check in front of it is reliable for anything
  // written more than a moment ago, so this only has to cover the hot window.
  'emailclaim':
    {
      FileOptions: { map: true },
      Schema: {
        email: 'S',
        id: 'S',
        createTime: 'S',
      },
      KeySchema: { email: 'HASH' },
    },
  'showdataset':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        createdBy: 'S',
        show: 'BOOL',
        deleted: 'BOOL',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
    },
  'access':
    {
      FileOptions: { map: true, noobject: true },
      Schema: {
        id: 'S',
        value: 'S',
      },
      KeySchema: { id: 'HASH' }
    },
  'visitor':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        lastModified: 'S',
        /* ... others */
      },
      KeySchema: { id: 'HASH' }
    },
  'session':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        lastActive: 'S',
        value: 'S',
      },
      KeySchema: { id: 'HASH' }
    },
  'userlikes':
    {},
  'likes':
    {},
  'comments':
    {},
  'stats':
    {},
  'livestats':
    {},
  'workqueue':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        priority: 'N',
        functionName: 'S',
        params: 'M',
      },
      KeySchema: { id: 'HASH' },
      GlobalSecondaryIndexes: [
          { priority: 'HASH' },
        ],
    },
  'failqueue':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        priority: 'N',
        functionName: 'S',
        params: 'M',
        failType: 'S',
      },
      KeySchema: { id: 'HASH' },
    },
  'layer':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        name: 'S',
        description: 'S',
        createdBy: 'S',
        createTime: 'S',
        modifyTime: 'S',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
        state: 'S',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { published: 'HASH' },
          { id: 'HASH' }
        ],  // sparse
    },
  'dataset':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        name: 'S',
        description: 'S',
        createdBy: 'S',
        createTime: 'S',
        modifyTime: 'S',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
        state: 'S',
        datasource: 'S',
        groups: 'M',
        // meta: { dataset metadata structure },
        // dotmap: 'BOOL',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { published: 'HASH' },
          { id: 'HASH' }
        ],  // sparse
    },
  'groups':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        name: 'S',
        description: 'S',
      },
      KeySchema: { id: 'HASH' },
    },
  'groupsusers':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        uid: 'S',
        flags: 'N',
      },
      KeySchema: { id: 'HASH', uid: 'RANGE' },
    },
  'groupsmaps':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        sid: 'S',
        permission: 'N',
      },
      KeySchema: { id: 'HASH', sid: 'RANGE' },
    },
  'groupsdatasets':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        sid: 'S',
        permission: 'N',
      },
      KeySchema: { id: 'HASH', sid: 'RANGE' },
    },
  'notifications':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        createdBy: 'S',
        message: 'S',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
    },
  'operations':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        createdBy: 'S',
        createTime: 'S',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
    },
  'cull':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        key: 'S',
        bucket: 'S',
        expires: 'S',
      },
      KeySchema: { id: 'HASH' },
    },
  'precincts':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        state: 'S',
        datasource: 'S',
        name: 'S',
        description: 'S',
        labels: 'L',
        createdBy: 'S',
        createTime: 'S',
        modifyTime: 'S',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { id: 'HASH' },
          { published: 'HASH' },
        ],  // sparse
    },
  'places':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        state: 'S',
        datasource: 'S',
        name: 'S',
        description: 'S',
        labels: 'L',
        createdBy: 'S',
        createTime: 'S',
        modifyTime: 'S',
        deleted: 'BOOL',
        published: 'S',
        official: 'BOOL',
      },
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { id: 'HASH' },
          { published: 'HASH' },
        ],  // sparse
    },
}
