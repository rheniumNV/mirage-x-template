import fs from "fs";
import path from "path";
import { res2yaml } from "../../util/res2yaml";
import { readFileSync } from "../../../file";

export const attachCore = async (option: {
  inputPath: string;
  outputPath: string;
}) => {
  const resFeedbackStringResult = readFileSync({
    path: path.resolve(option.inputPath, "./ResFeedbackOriginal.json"),
  });
  const resFeedbackString =
    resFeedbackStringResult.status === "SUCCESS"
      ? resFeedbackStringResult.data
      : "";
  const rawResFeedback = JSON.parse(resFeedbackString);
  const resFeedback = {
    ...rawResFeedback,
    Object:
      rawResFeedback.Object.Name.Data === "Holder"
        ? rawResFeedback.Object.Children[0]
        : rawResFeedback.Object,
  };
  const resFeedbackYaml = res2yaml(resFeedback);
  const prevResFeedbackYamlResult = readFileSync({
    path: path.resolve(option.outputPath, "ResFeedback.yaml"),
  });
  const prevResFeedbackYaml =
    prevResFeedbackYamlResult.status === "SUCCESS"
      ? prevResFeedbackYamlResult.data
      : "";

  if (prevResFeedbackYaml === resFeedbackYaml) {
    console.info("no change in core");
    return;
  }

  fs.writeFileSync(
    path.resolve(option.outputPath, "ResFeedback.json"),
    resFeedbackString,
  );

  fs.writeFileSync(
    path.resolve(option.outputPath, "ResFeedback.yaml"),
    resFeedbackYaml,
  );

  fs.copyFileSync(
    path.resolve(option.inputPath, "./ResFeedbackMetaOriginal.json"),
    path.resolve(option.outputPath, "ResFeedbackMeta.json"),
  );

  console.info("attached to core");
};
