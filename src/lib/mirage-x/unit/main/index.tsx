import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { DetailBase, UnitConfig, getMainProps } from "../common";
import { useMainRootContext } from "../../main";

export const UnitContext = createContext<{ id: string }>({ id: "root" });

const useUnitId = () => {
  return useMemo(() => uuidv4(), []);
};

const solveProp = <C extends DetailBase>(
  propConfig: UnitConfig<C>["syncPropConfigList"][number],
  value: unknown,
  functionSolver: (func: (...args: unknown[]) => unknown) => string
): {
  key: string;
  type: string;
  value: unknown;
  option: unknown;
} => {
  switch (propConfig.type) {
    case "Function":
      return {
        key: propConfig.name,
        type: propConfig.type,
        value: functionSolver(value as (...args: unknown[]) => unknown),
        option: {},
      };
    case "Enum":
      return {
        key: propConfig.name,
        type: propConfig.type,
        value:
          typeof value === "string"
            ? propConfig.enumKeys?.indexOf(value) ?? value
            : value,
        option: { enum: propConfig.enumType },
      };
    default:
      return {
        key: propConfig.name,
        type: propConfig.type,
        value: value,
        option: {},
      };
  }
};

const useSyncProp = <C extends DetailBase>(
  unitId: string,
  value: unknown,
  propConfig: UnitConfig<C>["syncPropConfigList"][number],
  defaultValue: unknown
) => {
  const { eventEmitter, functionMap } = useMainRootContext();
  const functionIdRef = useRef<string>();
  const isFirstTimeRef = useRef(true);
  const prevValueRef = useRef<unknown>(defaultValue);

  useEffect(() => {
    if (!eventEmitter || !functionMap) {
      return;
    }

    // 初期値の場合は何もしない
    if (isFirstTimeRef.current) {
      isFirstTimeRef.current = false;
      if (
        value === defaultValue ||
        (Array.isArray(value) && `${value}` === `${defaultValue}`)
      ) {
        return;
      }
    }

    // 値が変わっていない場合は何もしない
    if (Array.isArray(value) && `${value}` === `${prevValueRef.current}`) {
      return;
    }
    prevValueRef.current = value;

    const event = solveProp(propConfig, value, (func) => {
      if (functionIdRef.current) {
        functionMap?.delete(functionIdRef.current);
      }
      functionIdRef.current = uuidv4();
      functionMap.set(functionIdRef.current, func);
      return functionIdRef.current;
    });

    eventEmitter?.({
      type: "updateProp",
      unit: {
        id: unitId,
        prop: event,
      },
    });
  }, [value]);
};

const GeneralUnit = ({
  id,
  unitCode,
  defaultProps,
  children,
}: {
  id: string;
  unitCode: string;
  defaultProps: {
    key: string;
    type: string;
    value: unknown;
    option: unknown;
  }[];
  children?: React.ReactNode;
}) => {
  const { id: parentId } = useContext(UnitContext);
  const { eventEmitter } = useMainRootContext();

  useEffect(() => {
    eventEmitter?.({
      type: "generateUnit",
      unit: { id, parentId, code: unitCode, defaultProps },
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
        rawProps[propConfig.name] === undefined
          ? config.defaultProps[propConfig.name]
          : rawProps[propConfig.name],
        propConfig,
        config.defaultProps[propConfig.name]
      );
    });

    const defaultProps = useMemo(
      () =>
        config.syncPropConfigList.map((propConfig) =>
          solveProp(
            propConfig,
            config.defaultProps[propConfig.name],
            () => "EMPTY"
          )
        ),
      []
    );

    return (
      <GeneralUnit
        id={unitId}
        unitCode={config.code}
        defaultProps={defaultProps}
      >
        {rawProps.children as React.ReactNode}
      </GeneralUnit>
    );
  };
