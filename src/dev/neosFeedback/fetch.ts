import fs from "fs";
import path from "path";
import { getJson, getRecords, pickLatestObject } from "./util";
import Config from "../config.private.json";

const main = async () => {
  const records = await getRecords(Config.feedbackLink);
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
