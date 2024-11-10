import {
  DetailBase,
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/miragex/unit/common";

const detail = {
  code: "StyledUnit/StyledDVUiUnlitMaterial",
  propsConfig: {
    name: UnitProp.String("Name"),
    zWrite: UnitProp.EnumZWrite("On"),
    offsetFactor: UnitProp.Float(1),
    offsetUnits: UnitProp.Float(100),
    alphaCutoff: UnitProp.Float(0.1),
    alphaClip: UnitProp.Boolean(true),
  },
  children: "multi",
} satisfies DetailBase;

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
