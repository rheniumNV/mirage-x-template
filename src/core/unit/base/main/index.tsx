import { createContext, useContext, useEffect, useMemo } from "react";
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
  value: unknown
) => {
  const { eventEmitter } = useContext(MainRootContext) ?? {};
  useEffect(() => {
    eventEmitter?.({
      type: "updateProp",
      unit: { id: unitId, prop: { key, type, value } },
    });
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
    const props = { ...config.defaultProps, ...rawProps };
    const unitId = useUnitId();

    config.syncPropConfigList.forEach((config) => {
      useSyncProp(unitId, config.name, config.type, props[config.name]);
    });
    return (
      <GeneralUnit id={unitId} unitCode={config.code}>
        {props.children as React.ReactNode}
      </GeneralUnit>
    );
  };
