import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ name, children }) => {
    return <Slot id={children} name={{ id: name }}></Slot>;
  },
  option: {},
});
