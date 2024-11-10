import { res } from "../lib/miragex/res";
import { generateSimpleFrame } from "../lib/miragex/res/frame/simpleFrame";
import { Units } from "../core/unit/res";

import { config } from "./config";

const appCode = "MirageXSampleApp";

res(
  {
    appCode: appCode,
    outputPath: __dirname,
    ...config,
    hostAccessReason: {
      ja: `${appCode}を使用するため`,
      en: `To use ${appCode}`,
      ko: `${appCode}을 사용하기 위해`,
    },
    resetOnSave: config.resetOnSave,
  },
  Units,
  generateSimpleFrame,
);
