import { VirtualComponentProps } from "../virtualSlot";

export const dynamicReferenceVariable = (props: {
  type: "[FrooxEngine]FrooxEngine.Slot";
  variableName?: string;
  overrideOnLink?: boolean;
}): VirtualComponentProps => ({
  type: `[FrooxEngine]FrooxEngine.DynamicReferenceVariable<${props.type}>`,
  typeVersion: 1,
  data: {
    UpdateOrder: {
      type: "Primitive",
      data: 0,
    },
    Enabled: {
      type: "Primitive",
      data: true,
    },
    VariableName: {
      type: "Primitive",
      data: props.variableName ?? null,
    },
    Reference: {
      type: "UnknownRef",
      data: null,
    },
    OverrideOnLink: {
      type: "Primitive",
      data: props.overrideOnLink ?? false,
    },
  },
  legacyData: {},
});
