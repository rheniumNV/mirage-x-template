import { Slot } from "neos-script";
import { generateNeosUnit } from "../../../base/neos";
import { unitConfig } from "./detail";
import { Canvas } from "neos-script/components/UIX/Canvas";
import { BoxCollider } from "neos-script/components/Physics/Colliders/BoxCollider";
import { Image } from "neos-script/components/UIX/Graphics/Image";
import { UiUnlitMaterial } from "neos-script/assets/common/materials/UiUnlitMaterial";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ children, size, position, rotation, scale }) => {
    const boxCollider = BoxCollider({});
    const canvas = Canvas({
      Size: { id: size },
      Collider: { value: boxCollider.ID },
      _colliderOffset: { value: boxCollider.Data.Offset.ID },
      _colliderSize: { value: boxCollider.Data.Size.ID },
    });

    const background = Image({
      Material: UiUnlitMaterial.id,
    });

    return (
      <Slot
        name={"Canvas"}
        position={{ id: position }}
        rotation={{ id: rotation }}
        scale={{ id: scale }}
        assets={UiUnlitMaterial.assets}
      >
        <Slot
          id={children}
          name="Content"
          scale={[0.001, 0.001, 0.001]}
          components={[canvas, boxCollider]}
        >
          <Slot name="BG" orderOffset={-1000} components={[background]} />
        </Slot>
      </Slot>
    );
  },
});
