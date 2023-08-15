import { FunctionEnv } from "../../../../../base/common/interactionEvent";
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
    enabled: UnitProp.Boolean(true),
    styledSprite: UnitProp.String(""),
    styledColor: UnitProp.String(""),
    defaultColor: UnitProp.Color([1, 1, 1, 1]),
    preserveAspect: UnitProp.Boolean(true),
    onClick: UnitProp.Function((_env: FunctionEnv) => {}),
    requireLockInToPress: UnitProp.Boolean(false),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
