import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { HorizontalLayout } from "neos-script/components/UIX/Layout/HorizontalLayout";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({
    children,
    spacing,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    forceExpandChildWidth,
    forceExpandChildHeight,
    horizontalAlign,
    verticalAlign,
  }) => {
    return (
      <Slot
        id={children}
        name="HorizontalLayout"
        components={[
          <HorizontalLayout
            PaddingTop={{ id: paddingTop }}
            PaddingBottom={{ id: paddingBottom }}
            PaddingLeft={{ id: paddingLeft }}
            PaddingRight={{ id: paddingRight }}
            Spacing={{ id: spacing }}
            ForceExpandHeight={{ id: forceExpandChildWidth }}
            ForceExpandWidth={{ id: forceExpandChildHeight }}
            HorizontalAlign={{ id: horizontalAlign }}
            VerticalAlign={{ id: verticalAlign }}
          />,
        ]}
      ></Slot>
    );
  },
});
