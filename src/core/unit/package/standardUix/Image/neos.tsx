import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { Image } from "neos-script/components/UIX/Graphics/Image";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ children, tint }) => {
    return (
      <Slot
        id={children}
        name="Image"
        components={[<Image Tint={{ id: tint }} />]}
      ></Slot>
    );
  },
  option: {},
});
