import { FunctionEnv } from "../../../../../lib/mirage-x/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "StyledUix/StyledTextField",
  propsConfig: {
    styledFont: UnitProp.String(""),
    defaultValue: UnitProp.String(""),
    size: UnitProp.Float(64),
    styledTextColor: UnitProp.String(""),
    defaultTextColor: UnitProp.Color([0, 0, 0, 1]),
    styledTextMaterial: UnitProp.String(""),
    styledBackgroundColor: UnitProp.String(""),
    defaultBackgroundColor: UnitProp.Color([0.8, 0.8, 0.8, 1]),
    styledBackgroundSprite: UnitProp.String(""),
    styledBackgroundMaterial: UnitProp.String(""),
    styledBackgroundNormalColor: UnitProp.String(""),
    styledBackgroundHighlightColor: UnitProp.String(""),
    styledBackgroundPressColor: UnitProp.String(""),
    styledBackgroundDisableColor: UnitProp.String(""),
    onChange: UnitProp.Function((_env: FunctionEnv, _text: string) => {}),
    horizontalAlign: UnitProp.EnumTextHorizontalAlignment("Left"),
    verticalAlign: UnitProp.EnumTextVerticalAlignment("Middle"),
    autoSizeMin: UnitProp.Float(0),
    autoSizeMax: UnitProp.Float(64),
    horizontalAutoSize: UnitProp.Boolean(true),
    verticalAutoSize: UnitProp.Boolean(true),
    paddingTop: UnitProp.Float(5),
    paddingRight: UnitProp.Float(5),
    paddingBottom: UnitProp.Float(5),
    paddingLeft: UnitProp.Float(5),
    nineSliceSizing: UnitProp.EnumNineSliceSizing("TextureSize"),
    alignmentMode: UnitProp.EnumAlignmentMode("Geometric"),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
