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
    "styledBackgroundColor" | "styledBackgroundSprite"
  > & {
    styledBackgroundColor?: StyledColorVariable;
    styledBackgroundSprite?: StyledSpriteVariable;
  }
) => {
  return Unit({
    ...props,
    styledBackgroundColor: props.styledBackgroundColor?.variableName,
    styledBackgroundSprite: props.styledBackgroundSprite?.variableName,
  });
};
