import { VirtualComponentProps } from "../virtualSlot";

export const dynamicField = (props: {
  type: "string" | "int" | "float" | "bool" | "int3" | "float3";
  variableName?: string;
  overrideOnLink?: boolean;
}): VirtualComponentProps => ({
  type: `[FrooxEngine]FrooxEngine.DynamicField<${props.type}>`,
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
    VariableName: {
      type: "Primitive",
      data: props.variableName ?? null,
    },
    TargetField: {
      type: "Primitive",
      data: null,
    },
    OverrideOnLink: {
      type: "Primitive",
      data: props.overrideOnLink ?? false,
    },
  },
  legacyData: {},
});
