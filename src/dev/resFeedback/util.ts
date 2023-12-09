import axios from "axios";
import { DeCompress } from "brson.js";

export const getRecordInfo = async (
  recordLink: string
): Promise<{
  path: string;
  name: string;
  recordType: string;
  ownerType: "users" | "groups";
  ownerId: string;
}> => {
  const [_, ownerId, recordId] =
    recordLink.match(/resrec:\/\/\/(.+)\/(.+)/) ?? [];
  if (!ownerId || !recordId) {
    throw new Error("invalid record link");
  }
  const ownerType = ownerId.startsWith("U-") ? "users" : "groups";

  const {
    data: { path, name, recordType },
  } = await axios.get(
    `https://api.resonite.com/${ownerType}/${ownerId}/records/${recordId}`
  );

  return { path, name, recordType, ownerType, ownerId };
};

export const getRecords = async (recordUrl: string) => {
  const { ownerId, ownerType, path, name } = await getRecordInfo(recordUrl);
  const { data } = await axios.get(
    `https://api.resonite.com/${ownerType}/${ownerId}/records?path=${path}\\${name}`
  );

  return data.sort((x: any) => x.creationTime);
};

export const pickLatestObject = async (records: any[]) => {
  return records
    .filter((x: any) => x.recordType === "object")
    .sort((x: any) => x.creationTime)
    .pop();
};

export const getJson = async (assetUri: string) => {
  const [_, assetId] = assetUri.match(/resdb:\/\/\/(.+).brson/) ?? [];

  const { data } = await axios.get(`https://assets.resonite.com/${assetId}`, {
    responseType: "arraybuffer",
  });

  return DeCompress(data);
};
