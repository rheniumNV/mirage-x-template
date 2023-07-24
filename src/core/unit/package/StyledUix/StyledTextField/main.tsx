import { Unit } from "../../../../../base/common/unitChangeEvent";
import { generateMain } from "../../../base/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<
    Parameters<typeof Unit>[0],
    "styledTextColor" | "styledBackgroundColor" | "styledSprite"
  > & {
    styledTextColor?: StyledColorVariable;
    styledBackgroundColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
  }
) => {
  return Unit({
    ...props,
    styledTextColor: props.styledTextColor?.variableName,
    styledBackgroundColor: props.styledBackgroundColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
  });
};
