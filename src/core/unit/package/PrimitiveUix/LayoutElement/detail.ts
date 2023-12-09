import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "PrimitiveUix/LayoutElement",
  propsConfig: {
    minWidth: UnitProp.Float(-1),
    preferredWidth: UnitProp.Float(-1),
    flexibleWidth: UnitProp.Float(-1),
    minHeight: UnitProp.Float(-1),
    preferredHeight: UnitProp.Float(-1),
    flexibleHeight: UnitProp.Float(-1),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
