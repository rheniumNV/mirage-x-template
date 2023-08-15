import { Units } from "../core/unit/neos";
import fs from "fs";
import path from "path";
import { Template } from "./Template";
import { Slot } from "neos-script/core/Slot";
import { neos2yaml } from "../base/util/neos2yaml";
import { readFileSync } from "../base/util/file";
import axios from "axios";

const { API_HOST, PORT } = process.env;

const rawUrl = API_HOST ?? `http://localhost:${PORT ?? 3000}`;
const apiHost = rawUrl.split("/").pop() ?? `localhost:${PORT ?? 3000}`;
const useSSL = rawUrl.startsWith("https");
const version = `${new Date().getTime()}`;

const main = async () => {
  const preOutput = (
    <Template apiHost={apiHost} useSSL={useSSL} version={version}>
      {Object.keys(Units).map((key: any) => {
        return (
          <Slot name={key}>
            {
              //@ts-ignore
              Object.keys(Units[key]).map((key2: any) => {
                //@ts-ignore
                const Unit = Units[key][key2];
                return <Unit />;
              })
            }
          </Slot>
        );
      })}
    </Template>
  );

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

  const outputYaml = neos2yaml(output);
  const prevOutputYaml = readFileSync({
    path: path.resolve(__dirname, "output.yaml"),
    errorHandler: () => "{}",
  });
  const prevVersion = JSON.parse(
    readFileSync({
      path: path.resolve(__dirname, "version.json"),
      errorHandler: () => "{}",
    })
  ).version;
  const fixedPrevOutput = prevOutputYaml.replace(
    new RegExp(prevVersion, "g"),
    version
  );

  if (outputYaml === fixedPrevOutput) {
    console.info(`no change in output`);
    process.exit(0);
  }

  const output7zbson = (
    await axios.post("https://compress.kokoa.dev", output, {
      responseType: "arraybuffer",
    })
  ).data;

  fs.writeFileSync(
    path.resolve(__dirname, "output.json"),
    JSON.stringify({ ...output, Assets: newAssets }, null, 2)
  );

  fs.writeFileSync(path.resolve(__dirname, "output.yaml"), outputYaml);

  fs.writeFileSync(
    path.resolve(__dirname, "output.7zbson"),
    Buffer.from(output7zbson),
    "binary"
  );

  fs.writeFileSync(
    path.resolve(__dirname, "version.json"),
    JSON.stringify({ version }, null, 2)
  );

  console.info(`generated version ${version}`);
};

main();
