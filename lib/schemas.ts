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
        resetCount: 'N',
        accessed: 'M',
        likeID: 'S',
        visitData: 'M',
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
      KeySchema: { createdBy: 'HASH', id: 'RANGE' },
      GlobalSecondaryIndexes: [
          { published: 'HASH' },
          { id: 'HASH' }
        ],  // sparse
    },
  'splitblock':
    {
      FileOptions: { map: true },
      Schema: {
        id: 'S',
        chunk: 'S',
        state: 'S',
        datasource: 'S',
        geoid: 'S',
        blocks: 'L'
      },
      KeySchema: { id: 'HASH' }
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
}
