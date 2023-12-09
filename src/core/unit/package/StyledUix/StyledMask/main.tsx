import { Unit } from "../../../../../lib/mirage-x/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";
import { StyledSpriteVariable } from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<Parameters<typeof Unit>[0], "styledSprite"> & {
    styledSprite?: StyledSpriteVariable;
  }
) => {
  return Unit({
    ...props,
    styledSprite: props.styledSprite?.variableName,
  });
};
