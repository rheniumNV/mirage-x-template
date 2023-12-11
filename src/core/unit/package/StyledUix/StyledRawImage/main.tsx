import { Unit } from "../../../../../lib/mirage-x/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";
import { StyledMaterialVariable } from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<Parameters<typeof Unit>[0], "styledMaterial"> & {
    styledMaterial?: StyledMaterialVariable;
  }
) => {
  return Unit({
    ...props,
    styledMaterial: props.styledMaterial?.variableName,
  });
};
