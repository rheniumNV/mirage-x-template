import { ObjectContext, VirtualContext } from "../../../../virtualObject";
import ResFeedbackJson from "./ResFeedback.json";

export const generateInstallFrame = (option: {
  appCode: string;
  core: VirtualContext;
  generateEnv: () => VirtualContext;
}) => {
  //ファイルから読み込み
  const { context: frameContext, warnings: frameContextWarnings } =
    VirtualContext.generate(ResFeedbackJson as unknown as ObjectContext);
  if (frameContextWarnings.length > 0) {
    console.warn("frameContextWarnings", frameContextWarnings);
  }

  //名前変更
  frameContext.object.name.data.data = option.appCode + "Root";
  const panelRootRef = frameContext.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.PanelRoot",
  );
  if (
    !panelRootRef ||
    !panelRootRef.data.Reference ||
    !panelRootRef.data.Reference.data ||
    panelRootRef.data.Reference.data.type !== "Slot" ||
    panelRootRef.data.Reference.data.data.type !== "Ref" ||
    !panelRootRef.data.Reference.data.data.target
  ) {
    throw new Error("Static.PanelRoot not found");
  }
  panelRootRef.data.Reference.data.data.target.name.data.data = option.appCode;

  // 新しいCoreに置き換え
  const oldCoreRef = frameContext.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.AppRoot",
  )?.data["Reference"]?.data;
  if (
    !oldCoreRef ||
    oldCoreRef.type !== "Slot" ||
    oldCoreRef.data.type !== "Ref" ||
    !oldCoreRef.data.target
  ) {
    throw new Error("Static.AppRoot not found in FrameTemplate");
  }
  const oldCoreSlot = oldCoreRef.data.target;
  option.core.object.setParent(panelRootRef.data.Reference.data.data.target);
  oldCoreSlot.children.forEach((child) => {
    child.setParent(option.core.object);
  });
  oldCoreSlot.destroy();

  // ENVスロットを配置
  const frameDVSlot = frameContext.object.children.find(
    (child) => child.name.asPrimitive() === "DV",
  );
  if (!frameDVSlot) {
    throw new Error("DV slot not found");
  }
  option.generateEnv().object.setParent(frameDVSlot);

  // FrameのルートにStatic.AppRootを設定
  const dvStaticCore = frameContext.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.AppRoot",
  );
  if (!dvStaticCore || !dvStaticCore.data.Reference?.data) {
    throw new Error("Static.AppRoot not found");
  }
  dvStaticCore.data.Reference.data = {
    type: "Slot",
    data: {
      type: "Ref",
      target: option.core.object,
    },
  };

  // CoreのルートにStatic.MirageXRootを設定
  const dvStaticAppRoot = option.core.object.components.find(
    (comp) =>
      comp.type ===
        "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
      comp.data.VariableName?.asPrimitive() === "Static.FrameRoot",
  );
  if (!dvStaticAppRoot || !dvStaticAppRoot.data.Reference?.data) {
    throw new Error("Static.FrameRoot not found");
  }
  if (!dvStaticAppRoot.data.Reference?.data) {
    throw new Error("Static.FrameRoot not found");
  }
  dvStaticAppRoot.data.Reference.data = {
    type: "Slot",
    data: {
      type: "Ref",
      target: frameContext.object,
    },
  };

  return frameContext;
};
