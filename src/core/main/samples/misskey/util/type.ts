export type MisskeyWsMessage = {
  type: "channel";
  body: {
    id: "testId";
    type: "note";
    body: Note;
  };
};

export type Note = {
  id: string; // "9icx7419la";
  createdAt: string; // "2023-08-13T11:21:52.173Z";
  userId: string; //"9aemsw8ouu";
  user: User;
  text: string; // "aa";
  cw: string | null;
  //   visibility: "public";
  //   localOnly: false;
  //   reactionAcceptance: null;
  //   renoteCount: 0;
  //   repliesCount: 0;
  //   reactions: {};
  //   reactionEmojis: {};
  //   fileIds: string[];
  files: File[];
  //   replyId: null;
  //   renoteId: null;
  renote?: Note;
};

export type User = {
  id: string; // '9aemsw8ouu',
  name: string; // ':nkf::ntf:よっしー:neos::NeosJapan:',
  username: string; // 'yoshi1123_',
  //   host: null,
  avatarUrl: string; // 'https://misskey.resonite.love/proxy/avatar.webp?url=https%3A%2F%2Fmisskey.resonite.love%2Ffiles%2F444cdfaa-74bc-4161-a70f-da83460d1b50&avatar=1',
  //   avatarBlurhash: 'eSOMgk--yrS*?bxgScJzs;NKKhR7IvXfD,Y6kCMya6nP9urxRUSbkS',
  //   isBot: false,
  //   isCat: true,
  //   emojis: {},
  //   onlineStatus: 'online',
  //   badgeRoles: []
};

export type File = {
  id: string; // '9f9s7efzju',
  // createdAt: '2023-05-27T16:39:42.047Z',
  // name: '2023-05-28 01.32.38.jpg',
  type: string; // "image/jpeg";
  // md5: '05ee43cbd6d7c451406127b730667ffc',
  // size: 211795,
  isSensitive: boolean; // false,
  // blurhash: 'eEIOnCMw55$MMyO_X-oJR5xaD=IooNMdtjH?ITsSs:tPMvxGeTkDV[',
  // properties: { width: 1153, height: 2048 },
  url: string; // 'https://s3.neos.love/misskey/a6bdd81b-b46b-4b55-a444-8a276099d4a9.jpg',
  thumbnailUrl: string; // 'https://s3.neos.love/misskey/thumbnail-230c49bd-dd0c-443f-a8b0-34cc2b9372c1.webp',
  // comment: null,
  // folderId: '9alzo7tu43',
  // folder: null,
  // userId: null,
  // user: null
};
