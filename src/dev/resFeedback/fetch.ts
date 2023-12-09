import fs from "fs";
import path from "path";
import { getJson, getRecords, pickLatestObject } from "./util";
import Config from "../config.private.json";
import { convertRawFeedback } from "./convertRawFeedback";

const prevInfo = (() => {
  try {
    return require("./ResFeedbackMetaOriginal.json");
  } catch {
    return {};
  }
})();

const main = async () => {
  const records = await getRecords(Config.feedbackLink);
  const latestObject = await pickLatestObject(records);
  if (!latestObject) {
    console.info("not found feedback");
    return;
  }
  if (latestObject.id === prevInfo?.id) {
    console.info(
      "no new feedback",
      `latestFeedbackTime=${latestObject.creationTime}`
    );
    return;
  }
  const rawJson = await getJson(latestObject.assetUri);

  const json = convertRawFeedback(JSON.parse(rawJson));

  if (json) {
    fs.writeFileSync(
      path.resolve(__dirname, "./ResFeedbackOriginal.json"),
      json
    );
    fs.writeFileSync(
      path.resolve(__dirname, "./ResFeedbackMetaOriginal.json"),
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
