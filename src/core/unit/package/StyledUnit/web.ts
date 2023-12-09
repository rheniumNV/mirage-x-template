import { web as StyledDVColor } from "./StyledDVColor/web";
import { web as StyledDVFont } from "./StyledDVFont/web";
import { web as StyledDVSpace } from "./StyledDVSpace/web";
import { web as StyledDVSprite } from "./StyledDVSprite/web";
import { web as StyledDVUiTextUnlitMaterial } from "./StyledDVUiTextUnlitMaterial/web";
import { web as StyledDVUiUnlitMaterial } from "./StyledDVUiUnlitMaterial/web";

export const Units = {
  ...StyledDVColor,
  ...StyledDVFont,
  ...StyledDVSpace,
  ...StyledDVSprite,
  ...StyledDVUiTextUnlitMaterial,
  ...StyledDVUiUnlitMaterial,
};
