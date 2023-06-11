import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StandardUIX/VerticalLayout",
  propsConfig: {
    paddingTop: UnitProp.Float(0),
    paddingBottom: UnitProp.Float(0),
    paddingLeft: UnitProp.Float(0),
    paddingRight: UnitProp.Float(0),
    spacing: UnitProp.Float(0),
  },
  children: "multi" as "multi",
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
