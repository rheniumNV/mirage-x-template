import { Unit } from "../../../../../lib/mirage-x/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
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
  }
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
