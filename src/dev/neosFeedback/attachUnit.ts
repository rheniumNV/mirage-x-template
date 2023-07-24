import fs from "fs";
import path from "path";
import { neos2yaml } from "../../base/util/neos2yaml";
import { readFileSync } from "../../base/util/file";

const args = process.argv.slice(2);

if (typeof args[0] !== "string") throw new Error("invalid args. set unit name");

const matchPattern = args[0];
const unitFilterRegex = new RegExp(`^${matchPattern}$`);
console.info(`matchPattern=${matchPattern}`);

const getObject = (o: any) => (o.Name.Data === "Holder" ? o.Children[0] : o);

const NeosFeedbackOriginal = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "./NeosFeedbackOriginal.json"),
    "utf-8"
  )
);

const NeosFeedbackMetaOriginal = fs.readFileSync(
  path.resolve(__dirname, "./NeosFeedbackMetaOriginal.json"),
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

const PackageParentObject = getObject(
  NeosFeedbackOriginal.Object
).Children.find((o: any) => o.Name.Data === "Package");

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
        Assets: NeosFeedbackOriginal.Assets,
        TypeVersions: NeosFeedbackOriginal.TypeVersions,
      };

      if (unitSlot) {
        const unitObjectYaml = neos2yaml(unitObject);
        const prevUnitObjectYaml = readFileSync({
          path: path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/NeosFeedback.yaml`
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
            `../../core/unit/package/${packageName}/${unit}/NeosFeedback.json`
          ),
          JSON.stringify(unitObject, null, 2)
        );

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/NeosFeedback.yaml`
          ),
          unitObjectYaml
        );

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${packageName}/${unit}/NeosFeedbackMeta.json`
          ),
          NeosFeedbackMetaOriginal
        );

        console.info(`attached to ${packageName}/${unit}`);
      }
    });
  }
});
