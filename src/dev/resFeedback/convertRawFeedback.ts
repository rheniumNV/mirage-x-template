import { v4 as uuidv4 } from "uuid";

type Obj =
  | {
      [key: string]: Obj;
    }
  | Obj[]
  | string
  | number
  | boolean
  | null;

const replaceObj = (obj: Obj, path: string[], newValue: Obj): Obj => {
  if (path.length === 0) {
    return newValue;
  }
  const [first, ...rest] = path;
  if (typeof obj === "object" && obj != null) {
    if (Array.isArray(obj)) {
      const index = parseInt(first, 10);
      if (Number.isNaN(index)) {
        throw new Error(`invalid index: ${first}`);
      }
      const newArray = [...obj];
      newArray[index] = replaceObj(newArray[index], rest, newValue);
      return newArray;
    } else {
      return {
        ...obj,
        [first]: replaceObj(obj[first], rest, newValue),
      };
    }
  } else {
    throw new Error(`invalid path: ${path}`);
  }
};

const EMPTY = "";

const isDebugUrl = (url: string) =>
  url.includes("http://") || url.includes("ws://");

const convertLocalId = (value: unknown) => {
  if (
    value &&
    typeof value === "object" &&
    "Type" in value &&
    typeof value["Type"] === "string" &&
    "Data" in value &&
    value["Data"]
  ) {
    const componentType = value["Type"];
    const valueData = value["Data"] as {
      [key: string]: { ID: string; Data: unknown };
    };
    if (
      componentType.startsWith("FrooxEngine.DynamicValueVariable`") &&
      "VariableName" in valueData
    ) {
      const variableName = valueData["VariableName"]?.["Data"];
      if (variableName === "Static.Web.Host") {
        console.log("DV", "Static.Web.Host", valueData["Value"]["Data"]);
        return replaceObj(value as Obj, ["Data", "Value", "Data"], EMPTY);
      }
      if (variableName === "Static.Web.Url.Ws") {
        console.log("DV", "Static.Web.Url.Ws", valueData["Value"]["Data"]);
        return replaceObj(value as Obj, ["Data", "Value", "Data"], EMPTY);
      }
      if (variableName === "Env.Host.Fallback") {
        console.log("DV", "Env.Host.Fallback", valueData["Value"]["Data"]);
        return replaceObj(value as Obj, ["Data", "Value", "Data"], EMPTY);
      }
      if (variableName === "Static.Web.Url.Http") {
        console.log("DV", "Static.Web.Url.Http", valueData["Value"]["Data"]);
        return replaceObj(value as Obj, ["Data", "Value", "Data"], EMPTY);
      }
    }
    if (componentType.startsWith("FrooxEngine.CloudValueVariable`")) {
      const variableName = valueData["VariableName"]?.["Data"];
      if (variableName === "Env.Host.Fallback") {
        console.log("CV", "Env.Host.Fallback", valueData["Value"]["Data"]);
        return replaceObj(value as Obj, ["Data", "Value", "Data"], EMPTY);
      }
    }
    if (componentType.startsWith("FrooxEngine.CloudValueVariableDriver`")) {
      const fallbackValue = valueData["FallbackValue"]?.["Data"];
      if (typeof fallbackValue === "string" && isDebugUrl(fallbackValue)) {
        console.log(
          "FrooxEngine.CloudValueVariableDriver",
          "FallbackValue",
          valueData["FallbackValue"]["Data"]
        );
        return replaceObj(
          value as Obj,
          ["Data", "FallbackValue", "Data"],
          EMPTY
        );
      }
    }
    if (componentType.startsWith("FrooxEngine.StaticBinary")) {
      const url = valueData["URL"]?.["Data"];
      if (typeof url === "string" && isDebugUrl(url)) {
        console.log(
          "FrooxEngine.StaticBinary",
          "URL",
          valueData["URL"]["Data"]
        );
        return replaceObj(value as Obj, ["Data", "URL", "Data"], EMPTY);
      }
    }
    if (componentType.startsWith("FrooxEngine.WebsocketClient")) {
      const url = valueData["URL"]?.["Data"];
      if (typeof url === "string" && isDebugUrl(url)) {
        console.log(
          "FrooxEngine.StaticBinary",
          "URL",
          valueData["URL"]["Data"]
        );
        return replaceObj(
          replaceObj(value as Obj, ["Data", "URL", "Data"], EMPTY),
          ["Data", "IsConnected", "Data"],
          false
        );
      }
    }
  }
  return value;
};

const convertRandomId = (map: Map<string, string>) => (value: unknown) => {
  if (
    typeof value === "string" &&
    value.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)
  ) {
    if (!map.has(value)) {
      map.set(value, uuidv4());
    }
    return map.get(value);
  }
  return value;
};

// TODO: 関数名考え直す
export const convertRawFeedback = (rawFeedback: unknown) => {
  const map = new Map<string, string>();
  const json = JSON.stringify(rawFeedback, (_key, value: unknown) =>
    convertLocalId(convertRandomId(map)(value))
  );
  return json;
};
