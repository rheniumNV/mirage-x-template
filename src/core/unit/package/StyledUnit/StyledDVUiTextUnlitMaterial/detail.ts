import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "StyledUnit/StyledDVUiTextUnlitMaterial",
  propsConfig: {
    name: UnitProp.String("Name"),
    zWrite: UnitProp.EnumZWrite("Auto"),
    offsetFactor: UnitProp.Float(0),
    offsetUnits: UnitProp.Float(0),
  },
  children: "multi" as "multi",
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
