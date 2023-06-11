import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { Image } from "neos-script/components/UIX/Graphics/Image";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ root, tint }) => {
    return (
      <Slot
        id={root}
        name="Image"
        components={[<Image Tint={{ id: tint }} />]}
      ></Slot>
    );
  },
  option: { isRootChildrenParent: true },
});
