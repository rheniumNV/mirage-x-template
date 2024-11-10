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
    | "styledNormalColorTopLeft"
    | "styledHighlightColorTopLeft"
    | "styledPressColorTopLeft"
    | "styledDisableColorTopLeft"
    | "styledNormalColorTopRight"
    | "styledHighlightColorTopRight"
    | "styledPressColorTopRight"
    | "styledDisableColorTopRight"
    | "styledNormalColorBottomLeft"
    | "styledHighlightColorBottomLeft"
    | "styledPressColorBottomLeft"
    | "styledDisableColorBottomLeft"
    | "styledNormalColorBottomRight"
    | "styledHighlightColorBottomRight"
    | "styledPressColorBottomRight"
    | "styledDisableColorBottomRight"
  > & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
    styledNormalColorTopLeft?: StyledColorVariable;
    styledHighlightColorTopLeft?: StyledColorVariable;
    styledPressColorTopLeft?: StyledColorVariable;
    styledDisableColorTopLeft?: StyledColorVariable;
    styledNormalColorTopRight?: StyledColorVariable;
    styledHighlightColorTopRight?: StyledColorVariable;
    styledPressColorTopRight?: StyledColorVariable;
    styledDisableColorTopRight?: StyledColorVariable;
    styledNormalColorBottomLeft?: StyledColorVariable;
    styledHighlightColorBottomLeft?: StyledColorVariable;
    styledPressColorBottomLeft?: StyledColorVariable;
    styledDisableColorBottomLeft?: StyledColorVariable;
    styledNormalColorBottomRight?: StyledColorVariable;
    styledHighlightColorBottomRight?: StyledColorVariable;
    styledPressColorBottomRight?: StyledColorVariable;
    styledDisableColorBottomRight?: StyledColorVariable;
  },
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
    styledNormalColorTopLeft: props.styledNormalColorTopLeft?.variableName,
    styledHighlightColorTopLeft:
      props.styledHighlightColorTopLeft?.variableName,
    styledPressColorTopLeft: props.styledPressColorTopLeft?.variableName,
    styledDisableColorTopLeft: props.styledDisableColorTopLeft?.variableName,
    styledNormalColorTopRight: props.styledNormalColorTopRight?.variableName,
    styledHighlightColorTopRight:
      props.styledHighlightColorTopRight?.variableName,
    styledPressColorTopRight: props.styledPressColorTopRight?.variableName,
    styledDisableColorTopRight: props.styledDisableColorTopRight?.variableName,
    styledNormalColorBottomLeft:
      props.styledNormalColorBottomLeft?.variableName,
    styledHighlightColorBottomLeft:
      props.styledHighlightColorBottomLeft?.variableName,
    styledPressColorBottomLeft: props.styledPressColorBottomLeft?.variableName,
    styledDisableColorBottomLeft:
      props.styledDisableColorBottomLeft?.variableName,
    styledNormalColorBottomRight:
      props.styledNormalColorBottomRight?.variableName,
    styledHighlightColorBottomRight:
      props.styledHighlightColorBottomRight?.variableName,
    styledPressColorBottomRight:
      props.styledPressColorBottomRight?.variableName,
    styledDisableColorBottomRight:
      props.styledDisableColorBottomRight?.variableName,
  });
};
