import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "StyledUix/StyledRawImage",
  propsConfig: {
    url: UnitProp.Uri(""),
    preserveAspect: UnitProp.Boolean(false),
    interactionTarget: UnitProp.Boolean(true),
    tint: UnitProp.Color([1, 1, 1, 1]),
    styledMaterial: UnitProp.String(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
