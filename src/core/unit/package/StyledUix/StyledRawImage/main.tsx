import { Unit } from "../../../../../lib/miragex/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/miragex/unit/main";
import { StyledMaterialVariable } from "../../../../lib/styledUnit";

import { unitConfig } from "./detail";

const Unit = generateMain(unitConfig);

export const O = (
  props: Omit<Parameters<typeof Unit>[0], "styledMaterial"> & {
    styledMaterial?: StyledMaterialVariable;
  },
) => {
  return Unit({
    ...props,
    styledMaterial: props.styledMaterial?.variableName,
  });
};
