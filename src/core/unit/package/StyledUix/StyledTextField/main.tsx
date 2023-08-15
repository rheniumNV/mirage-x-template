import { useCallback, useMemo } from "react";
import { Unit } from "../../../../../base/common/unitChangeEvent";
import { generateMain } from "../../../base/main";
import { unitConfig } from "./detail";
import {
  StyledColorVariable,
  StyledSpriteVariable,
} from "../../../../lib/styledUnit";
import { FunctionEnv } from "../../../../../base/common/interactionEvent";

const Unit = generateMain(unitConfig);

export const o = (
  props: Omit<
    Parameters<typeof Unit>[0],
    "styledTextColor" | "styledBackgroundColor" | "styledSprite"
  > & {
    styledTextColor?: StyledColorVariable;
    styledBackgroundColor?: StyledColorVariable;
    styledSprite?: StyledSpriteVariable;
  }
) => {
  // InteractionEventの引数を加工する処理はdetailで定義したいが対応できていないので一旦ここに書く
  const fixedOnChange = useCallback(
    (env: FunctionEnv, text: string) =>
      props.onChange?.(env, decodeURIComponent(text)),
    [props.onChange]
  );

  // ↓既に使われていて影響出てしまったので一旦コメントアウト
  // 最初のみしか変更しないPropsをdetailで定義したいが対応できていないので一旦ここに書く
  // const fixedDefaultValue = useMemo(() => props.defaultValue, []);

  return Unit({
    ...props,
    styledTextColor: props.styledTextColor?.variableName,
    styledBackgroundColor: props.styledBackgroundColor?.variableName,
    styledSprite: props.styledSprite?.variableName,
    onChange: fixedOnChange,
    // defaultValue: fixedDefaultValue,
  });
};
