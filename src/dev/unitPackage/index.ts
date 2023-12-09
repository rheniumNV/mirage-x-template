import fs from "fs";
import path from "path";

fs.readdirSync(path.resolve(__dirname, "../../core/unit/package")).forEach(
  (packageDir) => {
    if (
      packageDir !== "000_template" &&
      fs
        .statSync(
          path.resolve(__dirname, `../../core/unit/package/${packageDir}`)
        )
        .isDirectory()
    ) {
      const mainFileList: string[] = [];
      const resFileList: string[] = [];
      const webFileList: string[] = [];
      fs.readdirSync(
        path.resolve(__dirname, `../../core/unit/package/${packageDir}`)
      ).forEach((unitFile) => {
        if (
          fs
            .statSync(
              path.resolve(
                __dirname,
                `../../core/unit/package/${packageDir}/${unitFile}`
              )
            )
            .isDirectory()
        ) {
          const files = fs.readdirSync(
            path.resolve(
              __dirname,
              `../../core/unit/package/${packageDir}/${unitFile}`
            )
          );
          if (files.includes("main.tsx")) {
            mainFileList.push(unitFile);
          }
          if (files.includes("res.tsx")) {
            resFileList.push(unitFile);
          }
          if (files.includes("web.tsx")) {
            webFileList.push(unitFile);
          }
        }
      });

      console.log(packageDir, mainFileList);
      if (mainFileList.length + resFileList.length + webFileList.length === 0) {
        return;
      }

      const mainCode =
        mainFileList
          .map(
            (unitFile) =>
              `export { o as ${unitFile} } from "./${unitFile}/main";`
          )
          .join("\n") + "\n";
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../../core/unit/package/${packageDir}/main.ts`
        ),
        mainCode
      );

      const resCode = `${resFileList
        .map(
          (unitFile) =>
            `import { res as ${unitFile} } from "./${unitFile}/res";`
        )
        .join("\n")}

export const Units = {
${resFileList.map((unitFile) => `  ${unitFile},`).join("\n")}
};
`;
      fs.writeFileSync(
        path.resolve(__dirname, `../../core/unit/package/${packageDir}/res.ts`),
        resCode
      );

      const webCode = `${webFileList
        .map(
          (unitFile) =>
            `import { web as ${unitFile} } from "./${unitFile}/web";`
        )
        .join("\n")}

export const Units = {
${webFileList.map((unitFile) => `  ...${unitFile},`).join("\n")}
};
`;
      fs.writeFileSync(
        path.resolve(__dirname, `../../core/unit/package/${packageDir}/web.ts`),
        webCode
      );
    }
  }
);
