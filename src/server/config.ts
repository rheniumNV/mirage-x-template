type Config = {
  appCode: string;
  mirage: {
    port: string;
    serverId: string;
  };
  auth: {
    url: string;
  };
};

const { MIRAGE_PORT, MIRAGE_SERVER_ID, AUTH_URL, APP_CODE } = process.env;

export const config: Config = {
  appCode: APP_CODE ?? "SampleMirageXApp",
  mirage: {
    port: MIRAGE_PORT ?? "3000",
    serverId: MIRAGE_SERVER_ID ?? "xxx",
  },
  auth: {
    url: AUTH_URL ?? "https://auth.neauth.app",
  },
};
