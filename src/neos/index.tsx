import { Units } from "../core/unit/neos";
import fs from "fs";
import path from "path";
import { Template } from "./Template";
import { Slot } from "neos-script/core/Slot";

const output = (
  <Template>
    {Object.keys(Units).map((key: any) => {
      return (
        <Slot name={key}>
          {
            //@ts-ignore
            Object.keys(Units[key]).map((key2: any) => {
              //@ts-ignore
              const Unit = Units[key][key2];
              return <Unit />;
            })
          }
        </Slot>
      );
    })}
  </Template>
);

fs.writeFileSync(
  path.resolve(__dirname, "output.json"),
  JSON.stringify(output, null, 2)
);
