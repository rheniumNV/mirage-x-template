import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const detail = {
  code: "StyledUix/StyledButton",
  propsConfig: {
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    onClick: UnitProp.Function(() => {}),
    requireLockInToPress: UnitProp.Boolean(false),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
