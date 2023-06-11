import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { VerticalLayout } from "neos-script/components/UIX/Layout/VerticalLayout";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({
    root,
    spacing,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  }) => {
    return (
      <Slot
        id={root}
        name="VerticalLayout"
        components={[
          <VerticalLayout
            PaddingTop={{ id: paddingTop }}
            PaddingBottom={{ id: paddingBottom }}
            PaddingLeft={{ id: paddingLeft }}
            PaddingRight={{ id: paddingRight }}
            Spacing={{ id: spacing }}
          />,
        ]}
      ></Slot>
    );
  },
  option: { isRootChildrenParent: true },
});
