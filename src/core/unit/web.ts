import { Units as PrimitiveUixUnits } from "./package/PrimitiveUix/web";
import { Units as StyledUnitUnits } from "./package/StyledUnit/web";
import { Units as StyledUixUnits } from "./package/StyledUix/web";

export const Units = {
  ...PrimitiveUixUnits,
  ...StyledUnitUnits,
  ...StyledUixUnits,
};
