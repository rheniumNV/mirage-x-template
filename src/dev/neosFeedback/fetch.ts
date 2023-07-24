import fs from "fs";
import path from "path";
import { getJson, getRecords, pickLatestObject } from "./util";

const Config = require("../config.private.json");

const prevInfo = require("./NeosFeedbackMetaOriginal.json");

const main = async () => {
  const records = await getRecords(Config.feedbackLink);
  const latestObject = await pickLatestObject(records);
  if (!latestObject) {
    console.info("not found feedback");
    return;
  }
  if (latestObject.id === prevInfo.id) {
    console.info(
      "no new feedback",
      `latestFeedbackTime=${latestObject.creationTime}`
    );
    return;
  }
  const json = await getJson(latestObject.assetUri);
  if (json) {
    fs.writeFileSync(
      path.resolve(__dirname, "./NeosFeedbackOriginal.json"),
      json
    );
    fs.writeFileSync(
      path.resolve(__dirname, "./NeosFeedbackMetaOriginal.json"),
      JSON.stringify({
        id: latestObject.id,
        creationTime: latestObject.creationTime,
      })
    );
    console.info(
      "updated ",
      `${prevInfo?.creationTime} --> ${latestObject.creationTime}`
    );
  } else {
    new Error("no json error");
  }
};
main();
