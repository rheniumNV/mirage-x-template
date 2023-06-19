import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { RectTransform } from "neos-script/components/UIX/RectTransform";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ children, anchorMin, anchorMax, offsetMin, offsetMax }) => {
    return (
      <Slot
        id={children}
        name="RectTransform"
        components={[
          <RectTransform
            AnchorMin={{ id: anchorMin }}
            AnchorMax={{ id: anchorMax }}
            OffsetMin={{ id: offsetMin }}
            OffsetMax={{ id: offsetMax }}
          />,
        ]}
      ></Slot>
    );
  },
  option: { isRootChildrenParent: true },
});
