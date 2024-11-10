import { readFileSync } from "../../file";
import {
  deleteHolder,
  ObjectContext,
  VirtualContext,
} from "../../virtualObject";
import { res2yaml } from "../util/res2yaml";
import fs from "fs";
import path from "path";

export const attachInstallFrame = async (option: {
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
  const { context: frameContext, warnings: frameContextWarnings } =
    VirtualContext.generate(resFeedbackJson);
  deleteHolder(frameContext);
  if (frameContextWarnings.length > 0) {
    console.warn("frameContextWarnings", frameContextWarnings);
  }

  //FrameCodeを確認
  const frameCode = frameContext.object.components
    .find(
      (comp) =>
        comp.type === "[FrooxEngine]FrooxEngine.DynamicValueVariable<string>" &&
        comp.data.VariableName?.asPrimitive() === "Static.FrameCode",
    )
    ?.data["Value"]?.asPrimitive();
  if (!frameCode) {
    throw new Error("FrameCode not found");
  }
  if (frameCode !== "Simple") {
    console.warn(`FrameCode is not Simple. FrameCode: ${frameCode}`);
    return;
  }

  //ルートのDVからStatic.AppRootを取得
  const appRootRef = frameContext.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.AppRoot",
  )?.data["Reference"]?.data;
  if (
    !appRootRef ||
    appRootRef.type !== "Slot" ||
    appRootRef.data.type !== "Ref" ||
    !appRootRef.data.target
  ) {
    throw new Error("Static.AppRoot not found");
  }

  //AppRootのMainを削除
  const appRootMainSlot = appRootRef.data.target.children.find(
    (child) => child.name.asPrimitive() === "Main",
  );
  if (!appRootMainSlot) {
    throw new Error("AppRoot/Main slot not found");
  }
  appRootMainSlot.destroy();

  //ENVスロットを削除
  const envSlot = frameContext.object.children
    .find((child) => child.name.asPrimitive() === "DV")
    ?.children.find((child) => child.name.asPrimitive() === "ENV");

  if (!envSlot) {
    throw new Error("Env slot not found");
  }
  envSlot.destroy();

  //エクスポートと差分チェック
  const { context: frameJson, warnings: frameContextExportWarnings } =
    frameContext.export();
  if (frameContextExportWarnings.length > 0) {
    console.warn("frameContextExportWarnings", frameContextExportWarnings);
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
    console.info("no change in frame");
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

  console.info("attached to simple frame");
};

attachInstallFrame({
  inputPath: path.resolve(__dirname, ""),
  outputPath: path.resolve(__dirname, "../res/frame/simpleFrame/"),
});
