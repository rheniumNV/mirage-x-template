import { web as Canvas } from "./Canvas/web";
import { web as GridLayout } from "./GridLayout/web";
import { web as HorizontalLayout } from "./HorizontalLayout/web";
import { web as IgnoreLayout } from "./IgnoreLayout/web";
import { web as LayoutElement } from "./LayoutElement/web";
import { web as RectTransform } from "./RectTransform/web";
import { web as VerticalLayout } from "./VerticalLayout/web";

export const Units = {
  ...Canvas,
  ...GridLayout,
  ...HorizontalLayout,
  ...IgnoreLayout,
  ...LayoutElement,
  ...RectTransform,
  ...VerticalLayout,
};
