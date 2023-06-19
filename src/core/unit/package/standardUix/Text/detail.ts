import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StandardUix/Text",
  propsConfig: {
    content: UnitProp.String(""),
    size: UnitProp.Float(64),
    color: UnitProp.Color([0, 0, 0, 1]),
    nullContent: UnitProp.String(""),
    lineHeight: UnitProp.Float(0.8),
    horizontalAutoSize: UnitProp.Boolean(false),
    verticalAutoSize: UnitProp.Boolean(false),
    horizontalAlign: UnitProp.EnumTextHorizontalAlignment("Left"),
    verticalAlign: UnitProp.EnumTextVerticalAlignment("Top"),
    autoSizeMin: UnitProp.Float(8),
    autoSizeMax: UnitProp.Float(64),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
