import { VirtualComponentProps } from "../virtualSlot";

type TypeValue =
  | {
      type: "string";
      value: string;
    }
  | {
      type: "int" | "float";
      value: number;
    }
  | {
      type: "bool";
      value: boolean;
    }
  | {
      type: "int3" | "float3";
      value: [number, number, number];
    };

export const dynamicValueVariable = (props: {
  typeValue: TypeValue;
  variableName?: string;
  overrideOnLink?: boolean;
}): VirtualComponentProps => ({
  type: `[FrooxEngine]FrooxEngine.DynamicValueVariable<${props.typeValue.type}>`,
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
    Value: {
      type: "Primitive",
      data: props.typeValue.value ?? null,
    },
    OverrideOnLink: {
      type: "Primitive",
      data: props.overrideOnLink ?? false,
    },
  },
  legacyData: {},
});
