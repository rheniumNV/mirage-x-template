import fs from "fs";
import path from "path";
import { neos2yaml } from "../../base/util/neos2yaml";
import { readFileSync } from "../../base/util/file";

const main = () => {
  const neosFeedbackString = readFileSync({
    path: path.resolve(__dirname, "./NeosFeedbackOriginal.json"),
  });
  const neosFeedback = JSON.parse(neosFeedbackString);
  const neosFeedbackYaml = neos2yaml(neosFeedback);
  const prevNeosFeedbackYaml = readFileSync({
    path: path.resolve(__dirname, "../../neos/static/NeosFeedback.yaml"),
    errorHandler: () => "",
  });

  if (prevNeosFeedbackYaml === neosFeedbackYaml) {
    console.info("no change in base");
    return;
  }

  fs.writeFileSync(
    path.resolve(__dirname, "../../neos/static/NeosFeedback.json"),
    neosFeedbackString
  );

  fs.writeFileSync(
    path.resolve(__dirname, "../../neos/static/NeosFeedback.yaml"),
    neosFeedbackYaml
  );

  fs.copyFileSync(
    path.resolve(__dirname, "./NeosFeedbackMetaOriginal.json"),
    path.resolve(__dirname, "../../neos/static/NeosFeedbackMeta.json")
  );

  console.info("attached to base");
};

main();
