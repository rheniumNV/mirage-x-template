type Config = {
  cv: {
    mirage: {
      host: { path: string; ownerId: string; fallback: string };
      useSsl: { path: string; ownerId: string; fallback: boolean };
    };
  };
  resetOnSave: boolean;
};

const {
  MIRAGE_HOST_CV_PATH,
  MIRAGE_USE_SSL_CV_PATH,
  MIRAGE_URL,
  MIRAGE_PORT,
  CV_OWNER_ID,
  MIRAGE_RESET_ON_SAVE,
} = process.env;

const rawFallbackUrl = MIRAGE_URL ?? `http://localhost:${MIRAGE_PORT ?? 3000}/`;
const fallbackHost =
  rawFallbackUrl.split("/")[2] ?? `localhost:${MIRAGE_PORT ?? 3000}/`;
const fallbackUseSSL = rawFallbackUrl.startsWith("https");

const appName = "core-console";

console.log(appName, fallbackHost, fallbackUseSSL);

if (MIRAGE_HOST_CV_PATH === undefined) {
  console.warn(appName, "MIRAGE_HOST_CV_PATH is not defined");
}
if (MIRAGE_USE_SSL_CV_PATH === undefined) {
  console.warn(appName, "MIRAGE_USE_SSL_CV_PATH is not defined");
}
if (CV_OWNER_ID === undefined) {
  console.warn(appName, "CV_OWNER_ID is not defined");
}
if (MIRAGE_RESET_ON_SAVE === undefined) {
  console.warn(appName, "MIRAGE_RESET_ON_SAVE is not defined");
}
if (MIRAGE_URL === undefined) {
  console.warn(
    appName,
    "MIRAGE_URL is not defined. use default value",
    rawFallbackUrl,
  );
}

export const config: Config = {
  cv: {
    mirage: {
      host: {
        path: MIRAGE_HOST_CV_PATH ?? "",
        ownerId: CV_OWNER_ID ?? "",
        fallback: fallbackHost,
      },
      useSsl: {
        path: MIRAGE_USE_SSL_CV_PATH ?? "",
        ownerId: CV_OWNER_ID ?? "",
        fallback: fallbackUseSSL,
      },
    },
  },
  resetOnSave:
    MIRAGE_RESET_ON_SAVE === "false"
      ? false
      : MIRAGE_RESET_ON_SAVE === "true"
        ? true
        : true,
};
