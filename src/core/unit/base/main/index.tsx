import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { DetailBase, UnitConfig, getMainProps } from "../common";
import { MainRootContext } from "../../../../base/main";

export const UnitContext = createContext<{ id: string }>({ id: "root" });

export const useUnitId = () => {
  return useMemo(() => uuidv4(), []);
};
export const useSyncProp = (
  unitId: string,
  key: string,
  type: string,
  value: unknown,
  enumType?: string,
  enumKeys?: string[]
) => {
  const { eventEmitter, functionMap } = useContext(MainRootContext) ?? {};
  const functionIdRef = useRef<string>();
  useEffect(() => {
    if (eventEmitter && functionMap) {
      let mirrorValue = (() => {
        switch (type) {
          case "Enum":
            return typeof value === "string"
              ? enumKeys?.indexOf(value as string) ?? value
              : value;
          default:
            return value;
        }
      })();
      let option = {};

      switch (type) {
        case "Function":
          if (functionIdRef.current) {
            functionMap?.delete(functionIdRef.current);
          }
          functionIdRef.current = uuidv4();
          functionMap.set(functionIdRef.current, value as (args: any) => any);
          mirrorValue = functionIdRef.current;
          break;
        case "Enum":
          option = { enum: enumType };
          break;
      }

      eventEmitter?.({
        type: "updateProp",
        unit: {
          id: unitId,
          prop: { key, type, value: mirrorValue, option },
        },
      });
    }
  }, [value]);
};

export const GeneralUnit = ({
  id,
  unitCode,
  children,
}: {
  id: string;
  unitCode: string;
  children?: React.ReactNode;
}) => {
  const { id: parentId } = useContext(UnitContext);
  const { eventEmitter } = useContext(MainRootContext) ?? {};

  useEffect(() => {
    eventEmitter?.({
      type: "generateUnit",
      unit: { id, parentId, code: unitCode },
    });
    return () => {
      eventEmitter?.({ type: "destroyUnit", unit: { id } });
    };
  }, []);
  return <UnitContext.Provider value={{ id }}>{children}</UnitContext.Provider>;
};

export const generateMain =
  <C extends DetailBase>(config: UnitConfig<C>) =>
  (rawProps: getMainProps<C>) => {
    const unitId = useUnitId();

    config.syncPropConfigList.forEach((propConfig) => {
      useSyncProp(
        unitId,
        propConfig.name,
        propConfig.type,
        rawProps[propConfig.name] ?? config.defaultProps[propConfig.name],
        propConfig.enumType,
        propConfig.enumKeys
      );
    });
    return (
      <GeneralUnit id={unitId} unitCode={config.code}>
        {rawProps.children as React.ReactNode}
      </GeneralUnit>
    );
  };
