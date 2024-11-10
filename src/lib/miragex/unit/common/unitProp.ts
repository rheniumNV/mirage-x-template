import * as MainProp from "../../common/mainProp";

type Option = { dvMode: MainProp.DvMode };
export const Float = (
  defaultValue: number,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Float => ({
  type: "Float",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "float",
  dvMode,
});

export const Boolean = (
  defaultValue: boolean,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Boolean => ({
  type: "Boolean",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "bool",
  dvMode,
});

export const String = (
  defaultValue: string,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.String => ({
  type: "String",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "string",
  dvMode,
});

export const Uri = (
  defaultValue: string,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Uri => ({
  type: "Uri",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "Uri",
  dvMode,
});

const textHorizontalAlignmentKeys: ["Left", "Center", "Right", "Justify"] = [
  "Left",
  "Center",
  "Right",
  "Justify",
];

export const EnumTextHorizontalAlignment = (
  defaultValue: (typeof textHorizontalAlignmentKeys)[number] = "Left",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof textHorizontalAlignmentKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: textHorizontalAlignmentKeys.indexOf(defaultValue),
  resDVType: "[Elements.Assets]Elements.Assets.TextHorizontalAlignment",
  dvMode,
  enumKeys: textHorizontalAlignmentKeys,
  enumType: "CodeX.TextHorizontalAlignment",
});

const textVerticalAlignmentKeys: ["Top", "Middle", "Bottom"] = [
  "Top",
  "Middle",
  "Bottom",
];
export const EnumTextVerticalAlignment = (
  defaultValue: (typeof textVerticalAlignmentKeys)[number] = "Top",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof textVerticalAlignmentKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: textVerticalAlignmentKeys.indexOf(defaultValue),
  resDVType: "[Elements.Assets]Elements.Assets.TextVerticalAlignment",
  dvMode,
  enumKeys: textVerticalAlignmentKeys,
  enumType: "CodeX.TextVerticalAlignment",
});

const layoutElementHorizontalAlignmentKeys: [
  "Left",
  "Center",
  "Right",
  "Justify",
] = ["Left", "Center", "Right", "Justify"];
export const EnumLayoutHorizontalAlignment = (
  defaultValue: (typeof layoutElementHorizontalAlignmentKeys)[number] = "Left",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof layoutElementHorizontalAlignmentKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: layoutElementHorizontalAlignmentKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.UIX.LayoutHorizontalAlignment",
  dvMode,
  enumKeys: layoutElementHorizontalAlignmentKeys,
  enumType: "FrooxEngine.UIX.LayoutHorizontalAlignment",
});

const layoutElementVerticalAlignmentKeys: [
  "Top",
  "Middle",
  "Bottom",
  "Justify",
] = ["Top", "Middle", "Bottom", "Justify"];
export const EnumLayoutVerticalAlignment = (
  defaultValue: (typeof layoutElementVerticalAlignmentKeys)[number] = "Top",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof layoutElementVerticalAlignmentKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: layoutElementVerticalAlignmentKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.UIX.LayoutVerticalAlignment",
  dvMode,
  enumKeys: layoutElementVerticalAlignmentKeys,
  enumType: "FrooxEngine.UIX.LayoutVerticalAlignment",
});

const staticTextureFilterModeKeys: [
  "Point",
  "Bilinear",
  "Trilinear",
  "Anisotropic",
] = ["Point", "Bilinear", "Trilinear", "Anisotropic"];
export const EnumStaticTextureFilterMode = (
  defaultValue: (typeof staticTextureFilterModeKeys)[number] = "Bilinear",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof staticTextureFilterModeKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: staticTextureFilterModeKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.TextureFilterMode",
  dvMode,
  enumKeys: staticTextureFilterModeKeys,
  enumType: "FrooxEngine.TextureFilterMode",
});

const staticTextureWrapModeKeys: ["Repeat", "Clamp", "Mirror", "MirrorOnce"] = [
  "Repeat",
  "Clamp",
  "Mirror",
  "MirrorOnce",
];
export const EnumStaticTextureWrapMode = (
  defaultValue: (typeof staticTextureWrapModeKeys)[number] = "Repeat",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof staticTextureWrapModeKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: staticTextureWrapModeKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.TextureWrapMode",
  dvMode,
  enumKeys: staticTextureWrapModeKeys,
  enumType: "FrooxEngine.TextureWrapMode",
});

const zWriteKeys: ["Auto", "Off", "On"] = ["Auto", "Off", "On"];
export const EnumZWrite = (
  defaultValue: (typeof zWriteKeys)[number] = "Auto",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof zWriteKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: zWriteKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.ZWrite",
  dvMode,
  enumKeys: zWriteKeys,
  enumType: "FrooxEngine.ZWrite",
});

export const Function = <A extends unknown[]>(
  defaultValue: MainProp.Function<A>["main"],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Function<A> => ({
  type: "Function",
  main: defaultValue,
  mirror: "",
  resDVType: "string",
  dvMode,
});

export const Color = (
  defaultValue:
    | [number, number, number, number]
    | [number, number, number, number, "sRGB" | "sRGBAlpha" | "Linear"] = [
    1, 1, 1, 1,
  ],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Color => ({
  type: "Color",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "colorX",
  dvMode,
});

export const Float2 = (
  defaultValue: [number, number] = [0, 0],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Float2 => ({
  type: "Float2",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "float2",
  dvMode,
});
export const Float3 = (
  defaultValue: [number, number, number] = [0, 0, 0],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Float3 => ({
  type: "Float3",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "float3",
  dvMode,
});
export const Float4 = (
  defaultValue: [number, number, number, number] = [0, 0, 0, 0],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Float4 => ({
  type: "Float4",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "float4",
  dvMode,
});
export const FloatQ = (
  defaultValue: [number, number, number, number] = [0, 0, 0, 0],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.FloatQ => ({
  type: "FloatQ",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "floatQ",
  dvMode,
});
export const Rect = (
  defaultValue: [number, number, number, number] = [0, 0, 0, 0],
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Rect => ({
  type: "Rect",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "Rect",
  dvMode,
});
export const Int = (
  defaultValue: number = 0,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Int => ({
  type: "Int",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "int",
  dvMode,
});
export const Long = (
  defaultValue: number = 0,
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Long => ({
  type: "Long",
  main: defaultValue,
  mirror: defaultValue,
  resDVType: "long",
  dvMode,
});

const sizeFitKeys: ["Disabled", "MinSize", "PreferredSize"] = [
  "Disabled",
  "MinSize",
  "PreferredSize",
];
export const EnumSizeFit = (
  defaultValue: (typeof sizeFitKeys)[number] = "Disabled",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof sizeFitKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: sizeFitKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.UIX.SizeFit",
  dvMode,
  enumKeys: sizeFitKeys,
  enumType: "FrooxEngine.UIX.SizeFit",
});

const interactionElementColorModeKeys: [
  "Explicit",
  "Multiply",
  "Additive",
  "Direct",
] = ["Explicit", "Multiply", "Additive", "Direct"];
export const EnumInteractionElementColorMode = (
  defaultValue: (typeof interactionElementColorModeKeys)[number] = "Explicit",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof interactionElementColorModeKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: interactionElementColorModeKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.UIX.InteractionElement+ColorMode",
  dvMode,
  enumKeys: interactionElementColorModeKeys,
  enumType: "FrooxEngine.UIX.InteractionElement+ColorMode",
});

const nineSliceSizingKeys: [
  "FixedSize",
  "TextureSize",
  "RectWidth",
  "RectHeight",
] = ["FixedSize", "TextureSize", "RectWidth", "RectHeight"];
export const EnumNineSliceSizing = (
  defaultValue: (typeof nineSliceSizingKeys)[number] = "TextureSize",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof nineSliceSizingKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: nineSliceSizingKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.UIX.NineSliceSizing",
  dvMode,
  enumKeys: nineSliceSizingKeys,
  enumType: "FrooxEngine.UIX.NineSliceSizing",
});

const alignmentModeKeys: ["Geometric", "LineBased"] = [
  "Geometric",
  "LineBased",
];
export const EnumAlignmentMode = (
  defaultValue: (typeof alignmentModeKeys)[number] = "Geometric",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof alignmentModeKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: alignmentModeKeys.indexOf(defaultValue),
  resDVType: "[Elements.Assets]Elements.Assets.AlignmentMode",
  dvMode,
  enumKeys: alignmentModeKeys,
  enumType: "Elements.Assets.AlignmentMode",
});

const blendModeKeys: [
  "Opaque",
  "Cutout",
  "Alpha",
  "Transparent",
  "Additive",
  "Multiply",
] = ["Opaque", "Cutout", "Alpha", "Transparent", "Additive", "Multiply"];
export const EnumBlendMode = (
  defaultValue: (typeof blendModeKeys)[number] = "Opaque",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof blendModeKeys)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: blendModeKeys.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.BlendMode",
  dvMode,
  enumKeys: blendModeKeys,
  enumType: "FrooxEngine.BlendMode",
});

const sidednessKey: ["Auto", "Front", "Back", "Double"] = [
  "Auto",
  "Front",
  "Back",
  "Double",
];
export const EnumSidedness = (
  defaultValue: (typeof sidednessKey)[number] = "Auto",
  { dvMode }: Option = { dvMode: "Field" },
): MainProp.Enum<(typeof sidednessKey)[number]> => ({
  type: "Enum",
  main: defaultValue,
  mirror: sidednessKey.indexOf(defaultValue),
  resDVType: "[FrooxEngine]FrooxEngine.Sidedness",
  dvMode,
  enumKeys: sidednessKey,
  enumType: "FrooxEngine.Sidedness",
});
