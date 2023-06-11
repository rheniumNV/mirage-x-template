import fs from "fs";
import path from "path";
import { getJson, getRecords, pickLatestObject } from "./util";

const main = async () => {
  const records = await getRecords(
    "neosrec:///G-Aesc-Shared/R-15ec8c16-31f5-48f8-90ad-32e3e5cc8d82"
  );
  console.log(records.map((record: any) => [record.name, record.creationTime]));
  const latestObject = await pickLatestObject(records);
  const json = await getJson(latestObject.assetUri);
  if (json) {
    fs.writeFileSync(path.resolve(__dirname, "./index.json"), json);
    fs.writeFileSync(
      path.resolve(__dirname, "./info.json"),
      JSON.stringify({ creationTime: latestObject.creationTime })
    );
  }
};
main();
