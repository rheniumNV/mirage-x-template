import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/miragex/unit/common";

const detail = {
  code: "StyledUix/StyledGradientImage",
  propsConfig: {
    styledSprite: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    styledColorTopLeft: UnitProp.String(""),
    styledColorTopRight: UnitProp.String(""),
    styledColorBottomLeft: UnitProp.String(""),
    styledColorBottomRight: UnitProp.String(""),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    preserveAspect: UnitProp.Boolean(true),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
