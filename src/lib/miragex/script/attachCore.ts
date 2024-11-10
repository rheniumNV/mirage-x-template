import { readFileSync } from "../../file";
import {
  deleteHolder,
  ObjectContext,
  VirtualContext,
} from "../../virtualObject";
import { res2yaml } from "../util/res2yaml";
import fs from "fs";
import path from "path";

export const attachCore = async (option: {
  inputPath: string;
  outputPath: string;
}) => {
  //ファイルから読み込み
  const resFeedbackJson = JSON.parse(
    fs.readFileSync(
      path.resolve(option.inputPath, "./ResFeedbackOriginal.json"),
      "utf-8",
    ),
  ) as unknown as ObjectContext;
  const { context: coreContext, warnings: coreContextGenerateWarning } =
    VirtualContext.generate(resFeedbackJson);
  if (coreContextGenerateWarning.length > 0) {
    console.warn("coreContextGenerateWarning", coreContextGenerateWarning);
  }
  deleteHolder(coreContext);

  //ルートのDVからStatic.AppRootを取得
  const coreRef = coreContext.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.AppRoot",
  )?.data["Reference"]?.data;
  if (
    !coreRef ||
    coreRef.type !== "Slot" ||
    coreRef.data.type !== "Ref" ||
    !coreRef.data.target
  ) {
    throw new Error("Static.AppRoot not found");
  }

  //Static.AppRootをルートに設定
  coreContext.setRootObject(coreRef.data.target);

  //Main以外のSlotを削除
  const mainSlot = coreContext.object.children.find(
    (child) => child.name.asPrimitive() === "Main",
  );
  if (!mainSlot) {
    throw new Error("Main slot not found");
  }
  coreContext.object.children.forEach((child) => {
    if (child !== mainSlot) {
      child.destroy();
    }
  });

  //ENVスロットを削除
  const envSlot = mainSlot.children
    .find((child) => child.name.asPrimitive() === "DV")
    ?.children.find((child) => child.name.asPrimitive() === "ENV");

  if (!envSlot) {
    throw new Error("Env slot not found");
  }
  envSlot.destroy();

  //Packageの子要素を削除
  const packageSlot = mainSlot.children.find(
    (child) => child.name.asPrimitive() === "Package",
  );
  if (!packageSlot) {
    throw new Error("Package slot not found");
  }
  packageSlot.children.forEach((child) => {
    child.destroy();
  });

  //エクスポートと差分チェック
  const { context: frameJson, warnings: coreContextExportWarnings } =
    coreContext.export();
  if (coreContextExportWarnings.length > 0) {
    console.warn("coreContextExportWarnings", coreContextExportWarnings);
  }
  const frameYaml = res2yaml(frameJson);
  const prevResFeedbackYamlResult = readFileSync({
    path: path.resolve(option.outputPath, "ResFeedback.yaml"),
  });
  const prevResFeedbackYaml =
    prevResFeedbackYamlResult.status === "SUCCESS"
      ? prevResFeedbackYamlResult.data
      : "";

  if (prevResFeedbackYaml === frameYaml) {
    console.info("no change in core");
    return;
  }

  //ファイルに書き込み
  fs.writeFileSync(
    path.resolve(option.outputPath, "ResFeedback.json"),
    JSON.stringify(frameJson),
  );
  fs.writeFileSync(
    path.resolve(option.outputPath, "ResFeedback.yaml"),
    frameYaml,
  );
  fs.copyFileSync(
    path.resolve(option.inputPath, "./ResFeedbackMetaOriginal.json"),
    path.resolve(option.outputPath, "ResFeedbackMeta.json"),
  );

  console.info("attached to core");
};

attachCore({
  inputPath: path.resolve(__dirname, ""),
  outputPath: path.resolve(__dirname, "../res/core/"),
});
