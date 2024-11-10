import fs from "fs";
import path from "path";
import { res2yaml } from "../../lib/miragex/util/res2yaml";
import { readFileSync } from "../../lib/file";
import { VirtualContext, deleteHolder } from "../../lib/virtualObject";

const args = process.argv.slice(2);

if (typeof args[0] !== "string") throw new Error("invalid args. set unit name");

const matchPattern = args[0];
const unitFilterRegex = new RegExp(`^${matchPattern}$`);
console.info(`matchPattern=${matchPattern}`);

const ResFeedbackOriginalJsonResult = readFileSync({
  path: path.resolve(__dirname, "./ResFeedbackOriginal.json"),
});

if (ResFeedbackOriginalJsonResult.status !== "SUCCESS") {
  throw new Error(
    `Failed to read ResFeedbackOriginal.json: ${ResFeedbackOriginalJsonResult.code}`,
  );
}

const ResFeedbackOriginalJson = JSON.parse(ResFeedbackOriginalJsonResult.data);

const ResFeedbackMetaOriginalResult = readFileSync({
  path: path.resolve(__dirname, "./ResFeedbackMetaOriginal.json"),
});

if (ResFeedbackMetaOriginalResult.status !== "SUCCESS") {
  throw new Error(
    `Failed to read ResFeedbackMetaOriginal.json: ${ResFeedbackMetaOriginalResult.code}`,
  );
}

const ResFeedbackMetaOriginal = ResFeedbackMetaOriginalResult.data;

const targets = fs
  .readdirSync(path.resolve(__dirname, "../../core/unit/package"))
  .flatMap((packageName) => {
    if (
      fs
        .statSync(
          path.resolve(__dirname, `../../core/unit/package/${packageName}`),
        )
        .isDirectory()
    ) {
      const units = fs
        .readdirSync(
          path.resolve(__dirname, `../../core/unit/package/${packageName}`),
        )
        .flatMap((fileName) =>
          fs
            .statSync(
              path.resolve(
                __dirname,
                `../../core/unit/package/${packageName}/${fileName}`,
              ),
            )
            .isDirectory()
            ? [fileName]
            : [],
        );
      return [{ packageName, units }];
    } else {
      return [];
    }
  });

const filteredTargets = targets.map(({ packageName, units }) => ({
  packageName,
  units: units.filter(
    (unit) => `${packageName}/${unit}`.match(unitFilterRegex) !== null,
  ),
}));

console.log(
  "unit:",
  filteredTargets
    .flatMap(({ units }) => units.length)
    .reduce((a, b) => a + b, 0),
  "/",
  targets.flatMap(({ units }) => units.length).reduce((a, b) => a + b, 0),
);

filteredTargets.forEach(({ packageName, units }) => {
  units.forEach((unit) => {
    const { context: unitContext, warnings: unitContextGenerateWarnings } =
      VirtualContext.generate(ResFeedbackOriginalJson);
    if (unitContextGenerateWarnings.length > 0) {
      console.warn(`warnings: ${unitContextGenerateWarnings.join("\n")}`);
    }
    deleteHolder(unitContext);

    const coreRef = unitContext.object.components.find(
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
    const mainSlot = coreRef.data.target.children.find(
      (child) => child.name.asPrimitive() === "Main",
    );
    if (!mainSlot) {
      throw new Error("Main slot not found");
    }
    const packageSlot = mainSlot.children.find(
      (child) => child.name.asPrimitive() === "Package",
    );
    if (!packageSlot) {
      throw new Error("Package slot not found");
    }

    const targetUnit = packageSlot.children
      .find((slot) => slot.name.data.data === packageName)
      ?.children.find(
        (slot) => slot.name.data.data === `${packageName}/${unit}`,
      );

    if (targetUnit) {
      unitContext.setRootObject(targetUnit);
      const { context: unitObjectResult, warnings: unitObjectWarnings } =
        unitContext.export();
      if (unitObjectWarnings.length > 0) {
        console.warn(`warnings: ${unitObjectWarnings.join("\n")}`);
      }
      const unitObjectYaml = res2yaml(unitObjectResult);

      const prevUnitObjectYamlResult = readFileSync({
        path: path.resolve(
          __dirname,
          `../../core/unit/package/${packageName}/${unit}/ResFeedback.yaml`,
        ),
      });
      const prevUnitObjectYaml =
        prevUnitObjectYamlResult.status === "SUCCESS"
          ? prevUnitObjectYamlResult.data
          : "";

      if (prevUnitObjectYaml === unitObjectYaml) {
        console.info(`no change in ${packageName}/${unit}`);
        return;
      }

      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../../core/unit/package/${packageName}/${unit}/ResFeedback.json`,
        ),
        JSON.stringify(unitObjectResult, null, 2),
      );

      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../../core/unit/package/${packageName}/${unit}/ResFeedback.yaml`,
        ),
        unitObjectYaml,
      );

      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../../core/unit/package/${packageName}/${unit}/ResFeedbackMeta.json`,
        ),
        ResFeedbackMetaOriginal,
      );

      console.info(`attached to ${packageName}/${unit}`);
    } else {
      console.info(`not found ${packageName}/${unit}`);
    }
  });
});
