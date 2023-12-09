import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "PrimitiveUix/VerticalLayout",
  propsConfig: {
    paddingTop: UnitProp.Float(0),
    paddingBottom: UnitProp.Float(0),
    paddingLeft: UnitProp.Float(0),
    paddingRight: UnitProp.Float(0),
    spacing: UnitProp.Float(0),
    forceExpandChildWidth: UnitProp.Boolean(true),
    forceExpandChildHeight: UnitProp.Boolean(true),
    horizontalAlign: UnitProp.EnumLayoutHorizontalAlignment("Left"),
    verticalAlign: UnitProp.EnumLayoutVerticalAlignment("Top"),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
