import axios from "axios";
import { Decompress } from "7zbson.js";

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
    recordLink.match(/neosrec:\/\/\/(.+)\/(.+)/) ?? [];
  if (!ownerId || !recordId) {
    throw new Error("invalid record link");
  }
  const ownerType = ownerId.startsWith("U-") ? "users" : "groups";

  const {
    data: { path, name, recordType },
  } = await axios.get(
    `https://api.neos.com/api/${ownerType}/${ownerId}/records/${recordId}`
  );

  return { path, name, recordType, ownerType, ownerId };
};

export const getRecords = async (recordUrl: string) => {
  const { ownerId, ownerType, path, name } = await getRecordInfo(recordUrl);
  const { data } = await axios.get(
    `https://api.neos.com/api/${ownerType}/${ownerId}/records?path=${path}\\${name}`
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
  const [_, assetId] = assetUri.match(/neosdb:\/\/\/(.+).7zbson/) ?? [];

  const { data } = await axios.get(
    `https://cloudxstorage.blob.core.windows.net/assets/${assetId}`,
    { responseType: "arraybuffer" }
  );

  return Decompress(new Uint8Array(data));
};
