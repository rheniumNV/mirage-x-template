import { Units } from "../../core/unit/package/standardUix/neos";
import fs from "fs";
import path from "path";
import { Template } from "./Template";

const output = (
  <Template>
    {Object.keys(Units).map((key: any) => {
      //@ts-ignore
      const Unit = Units[key];
      return <Unit />;
    })}
  </Template>
);

fs.writeFileSync(
  path.resolve(__dirname, "output.json"),
  JSON.stringify(output, null, 2)
);
