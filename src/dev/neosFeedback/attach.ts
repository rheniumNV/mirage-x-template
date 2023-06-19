import fs from "fs";
import path from "path";

const getObject = (object: any) =>
  object.Name.Data === "Holder" ? object.Children[0] : object;

const NeosFeedback = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./index.json"), "utf-8")
);

fs.copyFileSync(
  path.resolve(__dirname, "./index.json"),
  path.resolve(__dirname, "../../neos/src/static/NeosFeedback.json")
);

fs.readdirSync(path.resolve(__dirname, "../../core/unit/package")).forEach(
  (file) => {
    if (
      fs
        .statSync(path.resolve(__dirname, `../../core/unit/package/${file}`))
        .isDirectory()
    ) {
      const Object = getObject(NeosFeedback.Object)
        .Children.find((o: any) => o.Name.Data === "Package")
        ?.Children.find(
          (o: any) => o.Name.Data.toUpperCase() === file.toUpperCase()
        );
      if (Object) {
        fs.writeFileSync(
          path.resolve(
            __dirname,
            `../../core/unit/package/${file}/NeosFeedback.json`
          ),
          JSON.stringify(
            {
              Object,
              Assets: NeosFeedback.Assets,
              TypeVersions: NeosFeedback.TypeVersions,
            },
            null,
            2
          )
        );
      }
    }
  }
);
