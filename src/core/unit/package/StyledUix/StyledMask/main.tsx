import { Unit } from "../../../../../base/common/unitChangeEvent";
import { generateMain } from "../../../base/main";
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
