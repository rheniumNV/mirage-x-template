import {
  StyledColorVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";
import { generateMain } from "../../../base/main";
import { unitConfig } from "./detail";

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
