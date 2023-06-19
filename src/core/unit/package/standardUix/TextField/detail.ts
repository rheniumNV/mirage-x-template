import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StandardUix/TextField",
  propsConfig: {
    defaultValue: UnitProp.String(""),
    size: UnitProp.Float(64),
    baseColor: UnitProp.Color([0.8, 0.8, 0.8, 1]),
    onChange: UnitProp.Function(),
    horizontalAlign: UnitProp.EnumTextHorizontalAlignment("Left"),
    verticalAlign: UnitProp.EnumTextVerticalAlignment("Center"),
    autoSizeMin: UnitProp.Float(0),
    autoSizeMax: UnitProp.Float(64),
    horizontalAutoSize: UnitProp.Boolean(true),
    verticalAutoSize: UnitProp.Boolean(true),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
