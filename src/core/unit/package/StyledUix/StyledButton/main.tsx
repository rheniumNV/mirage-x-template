import { Unit } from "../../../../../base/common/unitChangeEvent";
import { generateMain } from "../../../base/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";
import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../base/common";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<Parameters<typeof Unit>[0], "styledColor" | "styledSprite"> & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
  }
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
  });
};
