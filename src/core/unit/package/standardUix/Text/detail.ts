import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StandardUIX/Text",
  propsConfig: {
    content: UnitProp.String(""),
    size: UnitProp.Float(64),
    color: UnitProp.Color([0, 0, 0, 1]),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
