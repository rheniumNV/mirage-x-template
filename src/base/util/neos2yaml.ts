import { stringify } from "yaml";

type NeosID = string;

type NeosField<T> = {
  ID: NeosID;
  Data: T;
};

type NeosComponentType = string;

type NeosComponent = {
  Type: NeosComponentType;
  Data: {
    ID: NeosID;
    "Persistent-Id": NeosID;
    UpdateOrder: NeosField<number>;
    Enabled: NeosField<boolean>;
  } & { [key: string]: NeosField<any> | NeosID };
};

type NeosSlot = {
  ID: NeosID;
  Name: NeosField<string>;
  "Persistent-Id": NeosID;
  Tag: NeosField<string>;
  Active: NeosField<boolean>;
  Position: NeosField<[number, number, number]>;
  Rotation: NeosField<[number, number, number, number]>;
  Scale: NeosField<[number, number, number]>;
  OrderOffset: NeosField<number>;
  Components: NeosField<NeosComponent[]>;
  Children: NeosSlot[];
};

type NeosObject = {
  Object: NeosSlot;
  Assets: NeosComponent[];
  TypeVersions: { [key: NeosComponentType]: number };
};

const isUuid = (str: string) =>
  str.match(
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/
  );

const processNeosSlot = <T>(
  neosSlot: NeosSlot,
  processor: (neosSlot: NeosSlot, children: T[]) => T
): T => {
  return processor(
    neosSlot,
    neosSlot.Children.map((child) => processNeosSlot(child, processor))
  );
};

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
  const idCountMap = new Map<NeosID, number>();
  const altNameCountMap = new Map<string, number>();
  const idAltNameMap = new Map<NeosID, string>();
  const _altNameIdMap = new Map<string, NeosID>();

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

  const getAltName = (id: NeosID) => {
    return (idCountMap.get(id) ?? 0 > 0 ? idAltNameMap.get(id) : "?") ?? "?";
  };

  const convertFiledData = (fieldData: unknown) => {
    return processFieldData(fieldData, (value: number | string | boolean) => {
      if (typeof value === "string" && isUuid(value)) {
        return getAltName(value); // TODO: よくわからないから確認
      } else {
        return value;
      }
    });
  };

  const toSimpleField = <T>(ID: NeosID, Data: T): NeosField<T> => {
    return {
      ID: getAltName(ID),
      Data: convertFiledData(Data) as T,
    };
  };

  const toSimpleComponent = (component: NeosComponent): NeosComponent => {
    const ComponentData: NeosComponent["Data"] = Object.entries(
      component.Data
    ).reduce<NeosComponent["Data"]>(
      (acc, [key, value]): NeosComponent["Data"] => {
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
      {} as NeosComponent["Data"]
    );
    const simpleComponent: NeosComponent = {
      Type: component.Type,
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

const neos2flat = (
  neosObject: NeosObject
): { data: NeosObject; _altNameIdMap: Map<string, NeosID> } => {
  const {
    preSetId,
    getAltName,
    toSimpleField,
    toSimpleComponent,
    states: { _altNameIdMap },
  } = generateFunctions();

  processNeosSlot(neosObject.Object, (slot) => {
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
        `ID:${slot.Name.Data}:Components:${component.Type}`
      );

      Object.keys(component.Data)
        .filter((key) => !["ID"].includes(key))
        .forEach((key) => {
          const field = component.Data[key];
          const id = typeof field === "object" ? field.ID : field;
          const data = typeof field === "object" ? field.Data : undefined;

          preSetId(
            id,
            `ID:${slot.Name.Data}:Components:${component.Type}:${key}`
          );

          processFieldData(
            data,
            (value: number | string | boolean, path: string[]) => {
              if (typeof value === "string" && isUuid(value)) {
                preSetId(
                  value,
                  path[path.length - 1] === "ID"
                    ? `ID:${slot.Name.Data}:Components:${
                        component.Type
                      }:${key}.${path.join(".")}`
                    : undefined
                );
              }
              return value;
            }
          );
        });
    });
  });

  neosObject.Assets.forEach((component) => {
    preSetId(component.Data.ID, `ID:Assets:${component.Type}`);
    Object.keys(component.Data).forEach((key) => {
      const field = component.Data[key];
      const id = typeof field === "object" ? field.ID : field;
      const data = typeof field === "object" ? field.Data : undefined;

      preSetId(id, `ID:Assets:${component.Type}:${key}`);

      if (data) {
        preSetId(data);
      }
    });
  });

  const result: NeosSlot = processNeosSlot<NeosSlot>(
    neosObject.Object,
    (slot, children) => {
      const simpleComponents = slot.Components.Data.map(toSimpleComponent);
      const simpleSlot: NeosSlot = {
        Name: toSimpleField(slot.Name.ID, slot.Name.Data),
        Active: toSimpleField(slot.Active.ID, slot.Active.Data),
        ID: getAltName(slot.ID),
        "Persistent-Id": getAltName(slot["Persistent-Id"]),
        Position: toSimpleField(slot.Position.ID, slot.Position.Data),
        Rotation: toSimpleField(slot.Rotation.ID, slot.Rotation.Data),
        Scale: toSimpleField(slot.Scale.ID, slot.Scale.Data),
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
      Object: result,
      Assets: neosObject.Assets.map(toSimpleComponent),
      TypeVersions: neosObject.TypeVersions,
    },
    _altNameIdMap: _altNameIdMap,
  };
};

export const neos2yaml = (neosObject: NeosObject): string =>
  stringify(neos2flat(neosObject).data);
