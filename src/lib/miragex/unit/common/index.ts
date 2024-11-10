import * as MainProp from "../../common/mainProp";
export * as UnitProp from "./unitProp";

export type DetailBase = {
  code: string;
  propsConfig: {
    [key: string]: MainProp.Base;
  };
  children?: "multi";
};

export type getDefaultProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["main"];
};

export type getMainProps<C extends DetailBase> = Partial<
  getDefaultProps<C> &
    (C["children"] extends "multi" ? { children?: React.ReactNode } : object)
>;

export type getMirrorProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["mirror"];
};

export type getWebProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["mirror"];
} & (C["children"] extends "multi" ? { children?: React.ReactNode } : object);

type SyncPropConfig = {
  name: string;
  type: MainProp.Base["type"];
  resDVType: string;
  dvMode: MainProp.DvMode;
  enumType?: string;
  enumKeys?: string[];
};

export type UnitConfig<C extends DetailBase> = {
  code: string;
  defaultProps: getDefaultProps<C>;
  syncPropConfigList: SyncPropConfig[];
};

export const generateUnitConfig = <C extends DetailBase>(
  config: C,
): UnitConfig<C> => {
  return {
    code: config.code,
    defaultProps: Object.entries(config.propsConfig).reduce(
      (acc, [key, propConfig]: [keyof C["propsConfig"], MainProp.Base]) => {
        acc[key] = propConfig.main;
        return acc;
      },
      {} as getDefaultProps<C>,
    ),
    syncPropConfigList: Object.entries(config.propsConfig).map(
      ([key, propConfig]) => ({
        name: key,
        type: propConfig.type,
        resDVType: propConfig.resDVType,
        dvMode: propConfig.dvMode,
        enumType: propConfig.enumType,
        enumKeys: propConfig.enumKeys,
      }),
    ),
  };
};
