import { Result, Success, Failed, FailedResult } from "../type/result";
import fs from "fs";

type FileErrorCode = "FILE_NOT_FOUND" | "PERMISSION_DENIED" | "UNKNOWN_ERROR";

export const readFileSync = ({
  path: pathName,
  errorHandler = (e: unknown): FailedResult<FileErrorCode, string> => {
    if (e instanceof Error) {
      if ("code" in e) {
        if (e.code === "ENOENT") {
          return Failed("FILE_NOT_FOUND", `File not found: ${pathName}`);
        } else if (e.code === "EACCES") {
          return Failed("PERMISSION_DENIED", `Permission denied: ${pathName}`);
        }
      }
    }
    return Failed("UNKNOWN_ERROR", "Unknown error occurred while reading file");
  },
}: {
  path: string;
  dirName?: string;
  errorHandler?: (e: unknown) => FailedResult<FileErrorCode, string>;
}): Result<string, FailedResult<FileErrorCode, string>> => {
  try {
    const content = fs.readFileSync(pathName, "utf-8");
    return Success(content);
  } catch (e) {
    return errorHandler(e);
  }
};
