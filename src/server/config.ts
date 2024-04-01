type Config = {
  appCode: string;
  mirage: {
    url: string;
    port: string;
    serverId: string;
  };
  auth: {
    url: string;
  };
  dev: {
    performanceTest: boolean;
  };
};

const {
  MIRAGE_URL,
  MIRAGE_PORT,
  MIRAGE_SERVER_ID,
  AUTH_URL,
  APP_CODE,
  PERFORMANCE_TEST_CODE,
} = process.env;

export const config: Config = {
  appCode: APP_CODE ?? "SampleMirageXApp",
  mirage: {
    url: MIRAGE_URL ?? "http://localhost:3001",
    port: MIRAGE_PORT ?? "3001",
    serverId: MIRAGE_SERVER_ID ?? "xxx",
  },
  auth: {
    url: AUTH_URL ?? "https://auth.neauth.app",
  },
  dev: {
    performanceTest: PERFORMANCE_TEST_CODE === "PERFORMANCE_TEST",
  },
};
