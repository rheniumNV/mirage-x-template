import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "PrimitiveUix/RectTransform",
  propsConfig: {
    active: UnitProp.Boolean(true),
    anchorMin: UnitProp.Float2([0, 0]),
    anchorMax: UnitProp.Float2([1, 1]),
    offsetMin: UnitProp.Float2([0, 0]),
    offsetMax: UnitProp.Float2([0, 0]),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
