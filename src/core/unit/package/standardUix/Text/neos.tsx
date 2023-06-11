import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { Text } from "neos-script/components/UIX/Graphics/Text";
import { Font } from "neos-script/assets/common/Font";
import { TextUnlitMaterial } from "neos-script/assets/common/materials/TextUnlitMaterial";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ root, content, size }) => {
    return (
      <Slot
        id={root}
        name="Text"
        components={[
          <Text
            Content={{ id: content }}
            Font={Font.id}
            Materials={[{ ID: uuidv4(), Data: TextUnlitMaterial.id }]}
            Size={{ id: size }}
          />,
        ]}
        assets={[...Font.assets, ...TextUnlitMaterial.assets]}
      ></Slot>
    );
  },
});
