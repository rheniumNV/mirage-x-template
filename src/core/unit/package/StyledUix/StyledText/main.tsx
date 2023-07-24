import { Unit } from "../../../../../base/common/unitChangeEvent";
import { generateMain } from "../../../base/main";
import { unitConfig } from "./detail";
import { StyledColorVariable } from "../../../../lib/styledUnit";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<Parameters<typeof Unit>[0], "styledColor"> & {
    styledColor?: StyledColorVariable;
  }
) => {
  return Unit({
    ...props,
    styledColor: props.styledColor?.variableName,
  });
};
