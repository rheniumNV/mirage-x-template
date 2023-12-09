import fs from "fs";
import path from "path";
import { res2yaml } from "../../lib/mirage-x/util/res2yaml";
import { readFileSync } from "../../lib/fileUtil";

const main = () => {
  const resFeedbackString = readFileSync({
    path: path.resolve(__dirname, "./ResFeedbackOriginal.json"),
  });
  const rawResFeedback = JSON.parse(resFeedbackString);
  const resFeedback = {
    ...rawResFeedback,
    Object:
      rawResFeedback.Object.Name.Data === "Holder"
        ? rawResFeedback.Object.Children[0]
        : rawResFeedback.Object,
  };
  const resFeedbackYaml = res2yaml(resFeedback);
  const prevResFeedbackYaml = readFileSync({
    path: path.resolve(
      __dirname,
      "../../lib/mirage-x/res/static/ResFeedback.yaml"
    ),
    errorHandler: () => "",
  });

  if (prevResFeedbackYaml === resFeedbackYaml) {
    console.info("no change in base");
    return;
  }

  fs.writeFileSync(
    path.resolve(__dirname, "../../lib/mirage-x/res/static/ResFeedback.json"),
    resFeedbackString
  );

  fs.writeFileSync(
    path.resolve(__dirname, "../../lib/mirage-x/res/static/ResFeedback.yaml"),
    resFeedbackYaml
  );

  fs.copyFileSync(
    path.resolve(__dirname, "./ResFeedbackMetaOriginal.json"),
    path.resolve(
      __dirname,
      "../../lib/mirage-x/res/static/ResFeedbackMeta.json"
    )
  );

  console.info("attached to base");
};

main();
