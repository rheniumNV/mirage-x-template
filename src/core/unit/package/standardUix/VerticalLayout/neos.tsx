import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { VerticalLayout } from "neos-script/components/UIX/Layout/VerticalLayout";

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
    verticalAlign,
    horizontalAlign,
  }) => {
    return (
      <Slot
        id={children}
        name="VerticalLayout"
        components={[
          <VerticalLayout
            PaddingTop={{ id: paddingTop }}
            PaddingBottom={{ id: paddingBottom }}
            PaddingLeft={{ id: paddingLeft }}
            PaddingRight={{ id: paddingRight }}
            Spacing={{ id: spacing }}
            ForceExpandHeight={{ id: forceExpandChildHeight }}
            ForceExpandWidth={{ id: forceExpandChildWidth }}
            VerticalAlign={{ id: verticalAlign }}
            HorizontalAlign={{ id: horizontalAlign }}
          />,
        ]}
      ></Slot>
    );
  },
});
