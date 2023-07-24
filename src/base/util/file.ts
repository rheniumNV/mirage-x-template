import fs from "fs";

export const readFileSync = ({
  path: pathName,
  errorHandler = (e: any) => {
    throw e;
  },
}: {
  path: string;
  dirName?: string;
  errorHandler?: (e: any) => string;
}) => {
  try {
    return fs.readFileSync(pathName, "utf-8");
  } catch (e) {
    return errorHandler(e);
  }
};
