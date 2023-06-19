import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StandardUix/RawImage",
  propsConfig: {
    url: UnitProp.Uri(""),
    preserveAspect: UnitProp.Boolean(false),
    interactionTarget: UnitProp.Boolean(true),
  },
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
