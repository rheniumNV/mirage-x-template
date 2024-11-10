import { VirtualComponentProps } from "../virtualSlot";

export const dynamicVariableSpace = (props: {
  spaceName?: string;
  onlyDirectBinding?: boolean;
}): VirtualComponentProps => ({
  type: "[FrooxEngine]FrooxEngine.DynamicVariableSpace",
  typeVersion: -1,
  data: {
    UpdateOrder: {
      type: "Primitive",
      data: 0,
    },
    Enabled: {
      type: "Primitive",
      data: true,
    },
    SpaceName: {
      type: "Primitive",
      data: props.spaceName ?? null,
    },
    OnlyDirectBinding: {
      type: "Primitive",
      data: props.onlyDirectBinding ?? false,
    },
  },
  legacyData: {},
});
