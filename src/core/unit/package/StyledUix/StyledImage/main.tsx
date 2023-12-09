import {
  StyledColorVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<
    Parameters<typeof Unit>[0],
    "styledColor" | "styledSprite" | "styledMaterial"
  > & {
    styledColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
    styledMaterial?: StyledMaterialVariable;
  }
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
  });
};
