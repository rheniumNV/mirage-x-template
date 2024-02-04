import fs from "fs";
import path from "path";
import { res2yaml } from "../../lib/mirage-x/util/res2yaml";
import { readFileSync } from "../../lib/fileUtil";

const appCode = process.env.APP_CODE ?? "MirageX";

const args = process.argv.slice(2);

if (typeof args[0] !== "string") throw new Error("invalid args. set unit name");

const matchPattern = args[0];
const unitFilterRegex = new RegExp(`^${matchPattern}$`);
console.info(`matchPattern=${matchPattern}`);

const getObject = (o: any) => (o.Name.Data === "Holder" ? o.Children[0] : o);

const ResFeedbackOriginal = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "./ResFeedbackOriginal.json"),
    "utf-8"
  )
);

const ResFeedbackMetaOriginal = fs.readFileSync(
  path.resolve(__dirname, "./ResFeedbackMetaOriginal.json"),
  "utf-8"
);

const targets = fs
  .readdirSync(path.resolve(__dirname, "../../core/unit/package"))
  .flatMap((packageName) => {
    if (
      fs
        .statSync(
          path.resolve(__dirname, `../../core/unit/package/${packageName}`)
        )
        .isDirectory()
    ) {
      const units = fs
        .readdirSync(
          path.resolve(__dirname, `../../core/unit/package/${packageName}`)
        )
        .flatMap((fileName) =>
          fs
            .statSync(
              path.resolve(
                __dirname,
                `../../core/unit/package/${packageName}/${fileName}`
              )
            )
            .isDirectory()
            ? [fileName]
            : []
        );
      return [{ packageName, units }];
    } else {
      return [];
    }
  });

const PackageParentObject = getObject(ResFeedbackOriginal.Object)
  .Children.find((o: any) => o.Name.Data === appCode)
  .Children.find((o: any) => o.Name.Data === "Package");

const filteredTargets = targets.map(({ packageName, units }) => ({
  packageName,
  units: units.filter(
    (unit) => `${packageName}/${unit}`.match(unitFilterRegex) !== null
  ),
}));

filteredTargets.forEach(({ packageName, units }) => {
  const packageObject = PackageParentObject.Children.find(
    (o: any) => o.Name.Data === packageName
  );
  if (packageObject) {
    units.forEach((unit) => {
      const unitSlot = packageObject.Children.find(
        (o: any) => o.Name.Data === `${packageName}/${unit}`
      );

      const unitObject = {
        Object: unitSlot,
        Assets: ResFeedbackOriginal.Assets,
        TypeVersions: ResFeedbackOriginal.TypeVersions,
      };

      if (unitSlot) {
        const unitObjectYaml = res2yaml(unitObject);
        const prevUnitObjectYaml = readFileSync({
          path: path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/ResFeedback.yaml`
          ),
          errorHandler: () => "",
        });

        if (prevUnitObjectYaml === unitObjectYaml) {
          console.info(`no change in ${packageName}/${unit}`);
          return;
        }

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/ResFeedback.json`
          ),
          JSON.stringify(unitObject, null, 2)
        );

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/ResFeedback.yaml`
          ),
          unitObjectYaml
        );

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/ResFeedbackMeta.json`
          ),
          ResFeedbackMetaOriginal
        );

        console.info(`attached to ${packageName}/${unit}`);
      }
    });
  }
});
