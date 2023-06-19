import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { Button } from "neos-script/components/UIX/Interaction/Button";
import { Image } from "neos-script/components/UIX/Graphics/Image";
import { generateNeosUnit } from "./../../../base/neos";
import { unitConfig } from "./detail";
import { ButtonDynamicImpulseTriggerWithValue_T } from "neos-script/components/Common UI/Button Interactions/ButtonDynamicImpulseTriggerWithValue_T";
import { DynamicReferenceVariableDriver_T } from "neos-script/components/Data/Dynamic/DynamicReferenceVariableDriver_T";

export const neos = generateNeosUnit({
  config: unitConfig,
  main: ({ children, baseColor, onClick }) => {
    const image = Image({});
    const button = Button({
      BaseColor: {
        id: baseColor,
      },
      ColorDrivers: [
        {
          ID: uuidv4(),
          ColorDrive: {
            ID: uuidv4(),
            Data: image.Data.Tint.ID,
          },
          TintColorMode: {
            ID: uuidv4(),
            Data: "Explicit",
          },
          NormalColor: {
            ID: uuidv4(),
            Data: [1, 1, 1, 1],
          },
          HighlightColor: {
            ID: uuidv4(),
            Data: [0.75, 0.75, 0.75, 1],
          },
          PressColor: {
            ID: uuidv4(),
            Data: [0.5, 0.5, 0.5, 1],
          },
          DisabledColor: {
            ID: uuidv4(),
            Data: [0.65, 0.65, 0.65, 1],
          },
        },
      ],
    });

    const dynamicImpulseTriggerTargetId = uuidv4();
    const buttonDynamicImpulseTriggerWithValue = (
      <ButtonDynamicImpulseTriggerWithValue_T
        type={{ T: { name: "[System.String, mscorlib]" } }}
        Target={{ id: dynamicImpulseTriggerTargetId }}
        PressedData={{
          ID: uuidv4(),
          Tag: { ID: uuidv4(), Data: "Func.EmitInteractionEvent.Trigger" },
          Value: { ID: onClick },
          isRaw: true,
        }}
      />
    );
    const dynamicImpulseTriggerTargetDriver = (
      <DynamicReferenceVariableDriver_T
        type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
        VariableName={"MX/Static.System.Func.EmitInteractionEvent"}
        Target={dynamicImpulseTriggerTargetId}
      />
    );

    return (
      <Slot
        id={children}
        name="Button"
        components={[
          image,
          button,
          buttonDynamicImpulseTriggerWithValue,
          dynamicImpulseTriggerTargetDriver,
        ]}
      ></Slot>
    );
  },
});
