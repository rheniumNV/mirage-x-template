import { readFileSync } from "../../file";
import { VirtualContext } from "../../virtualObject";
import { Compress } from "brson.js";
import { res2yaml } from "../util/res2yaml";
import { generateClient } from "./generateClient";
import fs from "fs";
import path from "path";

const currentVersion = `${new Date().getTime()}`;

export const res = async (
  config: {
    appCode: string;
    cv: {
      mirage: {
        host: {
          path: string;
          ownerId: string;
          fallback: string;
        };
        useSsl: {
          path: string;
          fallback: boolean;
        };
      };
    };
    outputPath: string;
    hostAccessReason?: {
      ja: string;
      en: string;
      ko: string;
    };
    resetOnSave?: boolean;
    developCode?: string;
  },
  units: { [key: string]: { [key: string]: VirtualContext } },
  generateFrame: (option: {
    appCode: string;
    core: VirtualContext;
    generateEnv: () => VirtualContext;
  }) => VirtualContext,
) => {
  console.debug(`start generating version ${currentVersion}`);
  const { context: output, warnings: outputExportWarnings } = generateClient({
    appCode: config.appCode,
    hostCVPath: config.cv.mirage.host.path,
    useSSLCVPath: config.cv.mirage.useSsl.path,
    cvOwnerId: config.cv.mirage.host.ownerId,
    fallbackHost: config.cv.mirage.host.fallback,
    fallbackUseSSL: config.cv.mirage.useSsl.fallback,
    currentVersion,
    hostAccessReason: config.hostAccessReason ?? {
      ja: `${config.appCode}を使用するため`,
      en: `for use ${config.appCode}`,
      ko: `${config.appCode}을 사용하기 위해`,
    },
    developCode: config.developCode,
    resetOnSave: config.resetOnSave ?? true,
    units,
    generateFrame,
  }).export();
  if (outputExportWarnings.length > 0) {
    console.warn("outputExportWarnings", outputExportWarnings);
  }
  console.debug(`end generating version ${currentVersion}`);

  const outputYaml = res2yaml(output);

  const prevOutputYamlOutput = readFileSync({
    path: path.resolve(config.outputPath, "output.yaml"),
  });
  const prevOutputYaml =
    prevOutputYamlOutput.status === "SUCCESS"
      ? prevOutputYamlOutput.data
      : "{}";

  const prevVersionResult = readFileSync({
    path: path.resolve(config.outputPath, "version.json"),
  });
  const prevVersion = JSON.parse(
    prevVersionResult.status === "SUCCESS" ? prevVersionResult.data : "{}",
  ).version;

  const fixedPrevOutput = prevOutputYaml.replace(
    new RegExp(prevVersion, "g"),
    currentVersion,
  );

  if (outputYaml === fixedPrevOutput) {
    console.info(`no change in output`);
    process.exit(0);
  }

  const newOutput = JSON.stringify(output, null, 0);

  console.log("start compressing");
  const output7zbson = Compress(newOutput);
  console.log("end compressing");

  fs.writeFileSync(path.resolve(config.outputPath, "output.json"), newOutput);

  fs.writeFileSync(path.resolve(config.outputPath, "output.yaml"), outputYaml);

  fs.writeFileSync(
    path.resolve(config.outputPath, "output.brson"),
    Buffer.from(output7zbson),
    "binary",
  );

  fs.writeFileSync(
    path.resolve(config.outputPath, "version.json"),
    JSON.stringify({ version: currentVersion }, null, 2),
  );

  console.info(`generated version ${currentVersion}`);
};
