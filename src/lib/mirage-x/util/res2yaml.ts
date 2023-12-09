import { stringify } from "yaml";

const round = (n: number, digit: number) => Math.round(n * 10 ** digit) / digit;

type ResID = string;

type ResField<T> = {
  ID: ResID;
  Data: T;
};

type ResComponentType = string;

type ResComponent = {
  Type: ResComponentType;
  Data: {
    ID: ResID;
    "Persistent-Id": ResID;
    UpdateOrder: ResField<number>;
    Enabled: ResField<boolean>;
  } & { [key: string]: ResField<any> | ResID };
};

type ResSlot = {
  ID: ResID;
  Name: ResField<string>;
  "Persistent-Id": ResID;
  Tag: ResField<string>;
  Active: ResField<boolean>;
  Position: ResField<[number, number, number]>;
  Rotation: ResField<[number, number, number, number]>;
  Scale: ResField<[number, number, number]>;
  OrderOffset: ResField<number>;
  Components: ResField<ResComponent[]>;
  Children: ResSlot[];
};

type ResObject = {
  Object: ResSlot;
  Assets: ResComponent[];
  TypeVersions: { [key: ResComponentType]: number };
};

const isUuid = (str: string) =>
  str.match(
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/
  );

const processResSlot = <T>(
  resSlot: ResSlot,
  processor: (resSlot: ResSlot, children: T[]) => T
): T => {
  return processor(
    resSlot,
    resSlot.Children.map((child) => processResSlot(child, processor))
  );
};

const convertComponentType = (type: string) =>
  type
    .replace(/\[([^,\[\]]+)[^\]]*\]/g, "$1")
    .replace(
      /Version=[0-9][0-9][0-9][0-9]\.[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9]/g,
      ""
    );

const processFieldData = (
  data: unknown,
  processor: (
    value: boolean | number | string,
    path: string[]
  ) => boolean | number | string,
  path: string[] = []
): unknown => {
  if (typeof data === "object" && data != null) {
    if (Array.isArray(data)) {
      return data.map((value: unknown, index) =>
        processFieldData(value, processor, [...path, `${index}`])
      );
    } else {
      return Object.entries(data).reduce(
        (
          acc,
          [key, value]
        ): {
          [key: string]: unknown;
        } => {
          return {
            ...acc,
            ...{ [key]: processFieldData(value, processor, [...path, key]) },
          };
        },
        {} as { [key: string]: unknown }
      );
    }
  } else if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return processor(data, path);
  } else if (data === null) {
    return null;
  } else {
    return {};
  }
};

const generateFunctions = () => {
  const idCountMap = new Map<ResID, number>();
  const altNameCountMap = new Map<string, number>();
  const idAltNameMap = new Map<ResID, string>();
  const _altNameIdMap = new Map<string, ResID>();

  const preSetId = (id: string, key?: string) => {
    if (key) {
      const altNameCount = altNameCountMap.get(key) ?? 0;
      const altName = `${key}:${altNameCount}`;
      altNameCountMap.set(key, altNameCount + 1);
      idAltNameMap.set(id, altName);
      _altNameIdMap.set(altName, id);
    } else {
      idCountMap.set(id, (idCountMap.get(id) ?? 0) + 1);
    }
  };

  const getAltName = (id: ResID) => {
    return (idCountMap.get(id) ?? 0 > 0 ? idAltNameMap.get(id) : "?") ?? "?";
  };

  const convertFiledData = (fieldData: unknown) => {
    return processFieldData(fieldData, (value: number | string | boolean) => {
      if (typeof value === "string" && isUuid(value)) {
        return getAltName(value); // TODO: よくわからないから確認
      } else if (typeof value === "number") {
        return round(value, 3);
        // } else if (Array.isArray(value) && value.length === 3) {
        //   return [round(value[0], 3), round(value[1], 3), round(value[2], 3)];
      } else {
        return value;
      }
    });
  };

  const toSimpleField = <T>(ID: ResID, Data: T): ResField<T> => {
    return {
      ID: getAltName(ID),
      Data: convertFiledData(Data) as T,
    };
  };

  const toSimpleComponent = (component: ResComponent): ResComponent => {
    const ComponentData: ResComponent["Data"] = Object.entries(
      component.Data
    ).reduce<ResComponent["Data"]>(
      (acc, [key, value]): ResComponent["Data"] => {
        const componentData = component.Data[key];
        if (typeof componentData === "string") {
          if ((key.endsWith("-ID") || key === "ID") && isUuid(componentData)) {
            return {
              ...acc,
              [key]: getAltName(componentData),
            };
          } else {
            throw new Error(`Invalid component data: ${key} ${componentData}`);
          }
        } else {
          return {
            ...acc,
            ...{
              [key]: toSimpleField(componentData?.ID, componentData?.Data),
            },
          };
        }
      },
      {} as ResComponent["Data"]
    );
    const simpleComponent: ResComponent = {
      Type: convertComponentType(component.Type),
      Data: ComponentData,
    };
    return simpleComponent;
  };

  return {
    preSetId,
    getAltName,
    toSimpleField,
    toSimpleComponent,
    states: { idCountMap, altNameCountMap, idAltNameMap, _altNameIdMap },
  };
};

const res2flat = (
  resObject: ResObject
): { data: ResObject; _altNameIdMap: Map<string, ResID> } => {
  const {
    preSetId,
    getAltName,
    toSimpleField,
    toSimpleComponent,
    states: { _altNameIdMap },
  } = generateFunctions();

  const resObjectObject =
    resObject.Object.Name.Data === "Holder"
      ? resObject.Object.Children[0]
      : resObject.Object;

  processResSlot(resObjectObject, (slot) => {
    preSetId(slot.ID, `ID:${slot.Name.Data}`);
    preSetId(slot["Persistent-Id"], `ID:${slot.Name.Data}:Persistent-Id`);
    preSetId(slot.Tag.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.Active.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.Position.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.Rotation.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.Scale.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.OrderOffset.ID, `ID:${slot.Name.Data}:Tag`);
    preSetId(slot.Components.ID, `ID:${slot.Name.Data}:Tag`);

    slot.Components.Data.forEach((component) => {
      preSetId(
        component.Data.ID,
        `ID:${slot.Name.Data}:Components:${convertComponentType(
          component.Type
        )}`
      );

      Object.keys(component.Data)
        .filter((key) => !["ID"].includes(key))
        .forEach((key) => {
          const field = component.Data[key];
          const id = typeof field === "object" ? field.ID : field;
          const data = typeof field === "object" ? field.Data : undefined;

          preSetId(
            id,
            `ID:${slot.Name.Data}:Components:${convertComponentType(
              component.Type
            )}:${key}`
          );

          processFieldData(
            data,
            (value: number | string | boolean, path: string[]) => {
              if (typeof value === "string" && isUuid(value)) {
                preSetId(
                  value,
                  path[path.length - 1] === "ID"
                    ? `ID:${slot.Name.Data}:Components:${convertComponentType(
                        component.Type
                      )}:${key}.${path.join(".")}`
                    : undefined
                );
              }
              return value;
            }
          );
        });
    });
  });

  resObject.Assets.forEach((component) => {
    preSetId(
      component.Data.ID,
      `ID:Assets:${convertComponentType(component.Type)}`
    );
    Object.keys(component.Data).forEach((key) => {
      const field = component.Data[key];
      const id = typeof field === "object" ? field.ID : field;
      const data = typeof field === "object" ? field.Data : undefined;

      preSetId(id, `ID:Assets:${convertComponentType(component.Type)}:${key}`);

      if (data) {
        preSetId(data);
      }
    });
  });

  const result: ResSlot = processResSlot<ResSlot>(
    resObjectObject,
    (slot, children) => {
      const simpleComponents = slot.Components.Data.filter(
        (comp) => !["FrooxEngine.InventoryItem"].includes(comp.Type)
      ).map(toSimpleComponent);
      const simpleSlot: ResSlot = {
        Name: toSimpleField(slot.Name.ID, slot.Name.Data),
        Active: toSimpleField(slot.Active.ID, slot.Active.Data),
        ID: getAltName(slot.ID),
        "Persistent-Id": getAltName(slot["Persistent-Id"]),
        Position: toSimpleField(
          slot.Position.ID,
          slot.Position.Data.map((n) => round(n, 3)) as [number, number, number]
        ),
        Rotation: toSimpleField(
          slot.Rotation.ID,
          slot.Rotation.Data.map((n) => round(n, 3)) as [
            number,
            number,
            number,
            number
          ]
        ),
        Scale: toSimpleField(
          slot.Scale.ID,
          slot.Scale.Data.map((n) => round(n, 3)) as [number, number, number]
        ),
        Tag: toSimpleField(slot.Tag.ID, slot.Tag.Data),
        OrderOffset: toSimpleField(slot.OrderOffset.ID, slot.OrderOffset.Data),
        Components: {
          ID: getAltName(slot.Components.ID),
          Data: simpleComponents,
        },
        Children: children,
      };
      return simpleSlot;
    }
  );

  return {
    data: {
      Object: {
        ...result,
        Position: { ID: "?", Data: [0, 0, 0] },
        Rotation: { ID: "?", Data: [0, 0, 0, 1] },
        Scale: { ID: "?", Data: [1, 1, 1] },
      },
      Assets: resObject.Assets.map(toSimpleComponent),
      TypeVersions: resObject.TypeVersions,
    },
    _altNameIdMap: _altNameIdMap,
  };
};

export const res2yaml = (resObject: ResObject): string =>
  stringify(res2flat(resObject).data.Object);
