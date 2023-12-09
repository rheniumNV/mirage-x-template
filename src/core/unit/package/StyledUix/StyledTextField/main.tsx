import { useCallback, useMemo } from "react";
import { Unit } from "../../../../../lib/mirage-x/common/unitChangeEvent";
import { generateMain } from "../../../../../lib/mirage-x/unit/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledFontVariable,
  StyledMaterialVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";
import { FunctionEnv } from "../../../../../lib/mirage-x/common/interactionEvent";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<
    Parameters<typeof Unit>[0],
    | "styledFont"
    | "styledTextColor"
    | "styledTextMaterial"
    | "styledBackgroundColor"
    | "styledBackgroundSprite"
    | "styledBackgroundMaterial"
    | "styledBackgroundNormalColor"
    | "styledBackgroundHighlightColor"
    | "styledBackgroundPressColor"
    | "styledBackgroundDisableColor"
  > & {
    styledFont?: StyledFontVariable;
    styledTextColor?: StyledColorVariable;
    styledTextMaterial?: StyledMaterialVariable;
    styledBackgroundColor?: StyledColorVariable;
    styledBackgroundSprite?: StyledSpriteVariable;
    styledBackgroundMaterial?: StyledMaterialVariable;
    styledBackgroundNormalColor?: StyledColorVariable;
    styledBackgroundHighlightColor?: StyledColorVariable;
    styledBackgroundPressColor?: StyledColorVariable;
    styledBackgroundDisableColor?: StyledColorVariable;
  }
) => {
  // InteractionEventの引数を加工する処理はdetailで定義したいが対応できていないので一旦ここに書く
  const fixedOnChange = useCallback(
    (env: FunctionEnv, text: string) =>
      props.onChange?.(env, decodeURIComponent(text)),
    [props.onChange]
  );

  // 最初のみしか変更しないPropsをdetailで定義したいが対応できていないので一旦ここに書く
  const fixedDefaultValue = useMemo(() => props.defaultValue, []);

  return Unit({
    ...props,
    styledFont: props.styledFont?.variableName,
    styledTextColor: props.styledTextColor?.variableName,
    styledTextMaterial: props.styledTextMaterial?.variableName,
    styledBackgroundColor: props.styledBackgroundColor?.variableName,
    styledBackgroundSprite: props.styledBackgroundSprite?.variableName,
    styledBackgroundMaterial: props.styledBackgroundMaterial?.variableName,
    styledBackgroundNormalColor:
      props.styledBackgroundNormalColor?.variableName,
    styledBackgroundHighlightColor:
      props.styledBackgroundHighlightColor?.variableName,
    styledBackgroundPressColor: props.styledBackgroundPressColor?.variableName,
    styledBackgroundDisableColor:
      props.styledBackgroundDisableColor?.variableName,
    onChange: fixedOnChange,
    defaultValue: fixedDefaultValue,
  });
};
