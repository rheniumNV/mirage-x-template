import { Unit } from "../../../../../lib/mirage-x/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledFontVariable,
  StyledMaterialVariable,
} from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<
    Parameters<typeof Unit>[0],
    "styledFont" | "styledColor" | "styledMaterial"
  > & {
    styledFont?: StyledFontVariable;
    styledColor?: StyledColorVariable;
    styledMaterial?: StyledMaterialVariable;
  }
) => {
  return Unit({
    ...props,
    styledFont: props.styledFont?.variableName,
    styledColor: props.styledColor?.variableName,
    styledMaterial: props.styledMaterial?.variableName,
  });
};
