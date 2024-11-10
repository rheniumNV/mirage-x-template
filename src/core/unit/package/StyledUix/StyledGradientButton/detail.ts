import { FunctionEnv } from "../../../../../lib/miragex/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/miragex/unit/common";

const detail = {
  code: "StyledUix/StyledGradientButton",
  propsConfig: {
    enabled: UnitProp.Boolean(true),
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    tintColorModeTopLeft: UnitProp.EnumInteractionElementColorMode("Direct"),
    styledNormalColorTopLeft: UnitProp.String(""),
    styledHighlightColorTopLeft: UnitProp.String(""),
    styledPressColorTopLeft: UnitProp.String(""),
    styledDisableColorTopLeft: UnitProp.String(""),
    tintColorModeTopRight: UnitProp.EnumInteractionElementColorMode("Direct"),
    styledNormalColorTopRight: UnitProp.String(""),
    styledHighlightColorTopRight: UnitProp.String(""),
    styledPressColorTopRight: UnitProp.String(""),
    styledDisableColorTopRight: UnitProp.String(""),
    tintColorModeBottomLeft: UnitProp.EnumInteractionElementColorMode("Direct"),
    styledNormalColorBottomLeft: UnitProp.String(""),
    styledHighlightColorBottomLeft: UnitProp.String(""),
    styledPressColorBottomLeft: UnitProp.String(""),
    styledDisableColorBottomLeft: UnitProp.String(""),
    tintColorModeBottomRight:
      UnitProp.EnumInteractionElementColorMode("Direct"),
    styledNormalColorBottomRight: UnitProp.String(""),
    styledHighlightColorBottomRight: UnitProp.String(""),
    styledPressColorBottomRight: UnitProp.String(""),
    styledDisableColorBottomRight: UnitProp.String(""),
    onClick: UnitProp.Function((_env: FunctionEnv) => {}),
    requireLockInToPress: UnitProp.Boolean(false),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    preserveAspect: UnitProp.Boolean(true),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
