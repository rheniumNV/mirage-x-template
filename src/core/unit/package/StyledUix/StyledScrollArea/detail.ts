import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "StyledUix/StyledScrollArea",
  propsConfig: {
    normalizerPosition: UnitProp.Float2([1, 0]),
    verticalFit: UnitProp.EnumSizeFit("Disabled"),
    horizontalFit: UnitProp.EnumSizeFit("Disabled"),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
