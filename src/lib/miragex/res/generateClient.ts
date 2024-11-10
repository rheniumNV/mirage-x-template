import {
  ObjectContext,
  VirtualContext,
  dynamicValueVariable,
} from "../../virtualObject";
import RawResFeedbackJson from "./core/ResFeedback.json";

const ResFeedbackJson = RawResFeedbackJson as unknown as ObjectContext;

export const generateClient = ({
  appCode,
  hostCVPath,
  useSSLCVPath,
  cvOwnerId,
  fallbackHost,
  fallbackUseSSL,
  currentVersion,
  hostAccessReason,
  units,
  generateFrame,
  developCode,
  resetOnSave,
}: {
  appCode: string;
  hostCVPath: string;
  useSSLCVPath: string;
  cvOwnerId: string;
  fallbackHost: string;
  fallbackUseSSL: boolean;
  currentVersion: string;
  hostAccessReason: {
    ja: string;
    en: string;
    ko: string;
  };
  developCode?: string;
  resetOnSave: boolean;
  units: {
    [key: string]: { [key: string]: VirtualContext };
  };
  generateFrame: (option: {
    appCode: string;
    core: VirtualContext;
    generateEnv: () => VirtualContext;
  }) => VirtualContext;
}): VirtualContext => {
  //ファイルから読み込み
  const { context: coreContext, warnings: coreContextWarnings } =
    VirtualContext.generate(ResFeedbackJson);
  if (coreContextWarnings.length > 0) {
    console.warn("coreContextWarnings", coreContextWarnings);
  }

  //ENVスロットを作成
  const { context: envContext, warnings: envContextWarnings } =
    VirtualContext.createEmpty();
  if (envContextWarnings.length > 0) {
    console.warn("envContextWarnings", envContextWarnings);
  }
  envContext.object.name.data.data = "ENV";
  const slotEnv = envContext.object;
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: hostCVPath },
      variableName: "Env.Host.CVPath",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: fallbackHost },
      variableName: "Env.Host.Fallback",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: useSSLCVPath },
      variableName: "Env.UseSSL.CVPath",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: cvOwnerId },
      variableName: "Env.CVOwnerID",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "bool", value: fallbackUseSSL },
      variableName: "Env.UseSSL.Fallback",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: currentVersion },
      variableName: "Env.Version.Current",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: appCode },
      variableName: "Env.AppCode",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "bool", value: true },
      variableName: "Env._IsCompatibleWithGeneralHub",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: hostAccessReason.ja },
      variableName: "ENV.HostAccessReason.Ja",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: hostAccessReason.en },
      variableName: "ENV.HostAccessReason.En",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: hostAccessReason.ko },
      variableName: "ENV.HostAccessReason.Ko",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "string", value: developCode ?? "" },
      variableName: "ENV.DEVELOP_CODE",
    }),
  );
  slotEnv.createComponent(
    dynamicValueVariable({
      typeValue: { type: "bool", value: resetOnSave },
      variableName: "ENV.ResetOnSave",
    }),
  );

  //Packageスロットの子要素を作成
  const slotPackage = coreContext.object.children
    .find((child) => child.name.asPrimitive() === "Main")
    ?.children.find((slot) => slot.name.data.data === "Package");
  if (!slotPackage) {
    throw new Error("Package not found");
  }
  Object.entries(units).forEach(([key, category]) => {
    const unitCategory = slotPackage.createChild({ name: key });
    Object.entries(category).forEach(([, unit]) => {
      try {
        unit.object.setParent(unitCategory);
      } catch (e) {
        console.error("Failed to set parent", category, key);
        throw e;
      }
    });
  });

  // ENVを配置する予定のCore/Main/DVを確保
  const coreMainDVSlot = coreContext.object.children
    .find((child) => child.name.asPrimitive() === "Main")
    ?.children.find((child) => child.name.asPrimitive() === "DV");
  if (!coreMainDVSlot) {
    throw new Error("Main/DV slot not found");
  }

  // ENVを複製する関数を作成
  const generateEnv = (): VirtualContext => {
    const { context: envJson, warnings: envJsonWarnings } = envContext.export();
    if (envJsonWarnings.length > 0) {
      console.warn("envJsonWarnings", envJsonWarnings);
    }

    const { context: duplicatedEnvContext, warnings: envContextWarnings } =
      VirtualContext.generate(envJson);
    if (envContextWarnings.length > 0) {
      console.warn("envContextWarnings", envContextWarnings);
    }
    return duplicatedEnvContext;
  };

  const frameContext = generateFrame({
    appCode,
    core: coreContext,
    generateEnv,
  });

  //ENVスロットを配置
  envContext.object.setParent(coreMainDVSlot);

  return frameContext;
};
