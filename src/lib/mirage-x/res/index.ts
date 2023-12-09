import fs from "fs";
import path from "path";
import { generateClient } from "./generateClient";
import { res2yaml } from "../util/res2yaml";
import { readFileSync } from "../../fileUtil";
import { Compress } from "brson.js";

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
  },
  units: { [key: string]: { [key: string]: () => void } }
) => {
  const preOutput = generateClient({
    appCode: config.appCode,
    hostCVPath: config.cv.mirage.host.path,
    useSSLCVPath: config.cv.mirage.useSsl.path,
    cvOwnerId: config.cv.mirage.host.ownerId,
    fallbackHost: config.cv.mirage.host.fallback,
    fallbackUseSSL: config.cv.mirage.useSsl.fallback,
    currentVersion,
    units,
  });

  const newAssets: any[] = [];

  preOutput.Assets.forEach((asset: any) => {
    if (
      !asset.Data.ID ||
      !newAssets.find((a: any) => a.Data.ID === asset.Data.ID)
    ) {
      newAssets.push(asset);
    }
  });

  const output = { ...preOutput, Assets: newAssets };

  const outputYaml = res2yaml(output);
  const prevOutputYaml = readFileSync({
    path: path.resolve(config.outputPath, "output.yaml"),
    errorHandler: () => "{}",
  });
  const prevVersion = JSON.parse(
    readFileSync({
      path: path.resolve(config.outputPath, "version.json"),
      errorHandler: () => "{}",
    })
  ).version;
  const fixedPrevOutput = prevOutputYaml.replace(
    new RegExp(prevVersion, "g"),
    currentVersion
  );

  if (outputYaml === fixedPrevOutput) {
    console.info(`no change in output`);
    process.exit(0);
  }

  const newOutput = JSON.stringify({ ...output, Assets: newAssets }, null, 0);

  console.log("start compressing");
  const output7zbson = Compress(newOutput);
  console.log("end compressing");

  fs.writeFileSync(path.resolve(config.outputPath, "output.json"), newOutput);

  fs.writeFileSync(path.resolve(config.outputPath, "output.yaml"), outputYaml);

  fs.writeFileSync(
    path.resolve(config.outputPath, "output.brson"),
    Buffer.from(output7zbson),
    "binary"
  );

  fs.writeFileSync(
    path.resolve(config.outputPath, "version.json"),
    JSON.stringify({ version: currentVersion }, null, 2)
  );

  console.info(`generated version ${currentVersion}`);
};
