import { FunctionEnv } from "../../../../../base/common/interactionEvent";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StyledUix/StyledTextField",
  propsConfig: {
    defaultValue: UnitProp.String(""),
    size: UnitProp.Float(64),
    styledTextColor: UnitProp.String(""),
    defaultTextColor: UnitProp.Color([0, 0, 0, 1]),
    styledBackgroundColor: UnitProp.String(""),
    defaultBackgroundColor: UnitProp.Color([0.8, 0.8, 0.8, 1]),
    styledSprite: UnitProp.String(""),
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
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
