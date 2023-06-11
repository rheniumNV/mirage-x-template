import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { LayoutElement } from "neos-script/components/UIX/Layout/LayoutElement";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({
    root,
    minHeight,
    minWidth,
    preferredHeight,
    preferredWidth,
    flexibleHeight,
    flexibleWidth,
  }) => {
    return (
      <Slot
        id={root}
        name="LayoutElement"
        components={[
          <LayoutElement
            MinHeight={{ id: minHeight }}
            MinWidth={{ id: minWidth }}
            PreferredHeight={{ id: preferredHeight }}
            PreferredWidth={{ id: preferredWidth }}
            FlexibleHeight={{ id: flexibleHeight }}
            FlexibleWidth={{ id: flexibleWidth }}
          />,
        ]}
      ></Slot>
    );
  },
  option: { isRootChildrenParent: true },
});
