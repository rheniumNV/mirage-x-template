import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "PrimitiveUix/GridLayout",
  propsConfig: {
    paddingTop: UnitProp.Float(0),
    paddingRight: UnitProp.Float(0),
    paddingBottom: UnitProp.Float(0),
    paddingLeft: UnitProp.Float(0),
    cellSize: UnitProp.Float2([100, 100]),
    spacing: UnitProp.Float2([0, 0]),
    horizontalAlignment: UnitProp.EnumLayoutHorizontalAlignment("Left"),
    verticalAlignment: UnitProp.EnumLayoutVerticalAlignment("Top"),
    expandWidthToFit: UnitProp.Boolean(false),
    preserveAspectOnExpand: UnitProp.Boolean(true),
    alignLastRowIndividually: UnitProp.Boolean(false),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
