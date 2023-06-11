import { web as VerticalLayout } from "./VerticalLayout/web";
import { web as HorizontalLayout } from "./HorizontalLayout/web";
import { web as Text } from "./Text/web";
import { web as Button } from "./Button/web";
import { web as Image } from "./Image/web";
import { web as LayoutElement } from "./LayoutElement/web";
import { web as Canvas } from "./Canvas/web";

export const Units = {
  ...VerticalLayout,
  ...HorizontalLayout,
  ...Text,
  ...Button,
  ...Image,
  ...LayoutElement,
  ...Canvas,
};
