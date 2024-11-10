import { Unit } from "../../../../../lib/miragex/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/miragex/unit/main";
import {
  StyledColorVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledColor"
    | "styledSprite"
    | "styledMaterial"
    | "styledNormalColor"
    | "styledHighlightColor"
    | "styledPressColor"
    | "styledDisableColor"
  > & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledNormalColor?: StyledColorVariable;
    styledHighlightColor?: StyledColorVariable;
    styledPressColor?: StyledColorVariable;
    styledDisableColor?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledNormalColor: props.styledNormalColor?.variableName,
    styledHighlightColor: props.styledHighlightColor?.variableName,
    styledPressColor: props.styledPressColor?.variableName,
    styledDisableColor: props.styledDisableColor?.variableName,
  });
};
