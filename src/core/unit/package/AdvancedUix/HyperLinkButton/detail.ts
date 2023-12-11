import { FunctionEnv } from "../../../../../lib/mirage-x/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "AdvancedUix/HyperLinkButton",
  propsConfig: {
    urlEn: UnitProp.Uri(""),
    urlJa: UnitProp.Uri(""),
    urlKo: UnitProp.Uri(""),
    reasonEn: UnitProp.String(""),
    reasonJa: UnitProp.String(""),
    reasonKo: UnitProp.String(""),
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    styledMaterial: UnitProp.String(""),
    tintColorMode: UnitProp.EnumInteractionElementColorMode("Explicit"),
    styledNormalColor: UnitProp.String(""),
    styledHighlightColor: UnitProp.String(""),
    styledPressColor: UnitProp.String(""),
    styledDisableColor: UnitProp.String(""),
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
