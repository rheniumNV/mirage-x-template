type Config = {
  mirage: {
    url: string;
    port: string;
    serverId: string;
  };
  auth: {
    url: string;
    defaultAuthenticationToken?: string;
  };
  dev: {
    performanceTest: boolean;
  };
  platform: {
    api: {
      url: string;
    };
  };
};

const {
  MIRAGE_URL,
  MIRAGE_PORT,
  MIRAGE_SERVER_ID,
  AUTH_URL,
  PERFORMANCE_TEST_CODE,
  PLATFORM_API_URL,
  DEFAULT_AUTHENTICATION_TOKEN,
} = process.env;

export const config: Config = {
  mirage: {
    url: MIRAGE_URL ?? "http://localhost:3000/",
    port: MIRAGE_PORT ?? "3000",
    serverId: MIRAGE_SERVER_ID ?? "xxx",
  },
  auth: {
    url: AUTH_URL ?? "https://auth.resonite.love/",
    defaultAuthenticationToken:
      DEFAULT_AUTHENTICATION_TOKEN === ""
        ? undefined
        : DEFAULT_AUTHENTICATION_TOKEN,
  },
  dev: {
    performanceTest: PERFORMANCE_TEST_CODE === "PERFORMANCE_TEST",
  },
  platform: {
    api: {
      url: PLATFORM_API_URL ?? "https://api.resonite.com/",
    },
  },
};
