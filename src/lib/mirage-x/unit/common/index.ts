import { MainProp } from "../../common/prop";

export namespace UnitProp {
  type Option = { dvMode: MainProp.DvMode };
  export const Float = (
    defaultValue: number,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Float => ({
    type: "Float",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.Single, mscorlib]",
    dvMode,
  });

  export const Boolean = (
    defaultValue: boolean,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Boolean => ({
    type: "Boolean",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.Boolean, mscorlib]",
    dvMode,
  });

  export const String = (
    defaultValue: string,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.String => ({
    type: "String",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.String, mscorlib]",
    dvMode,
  });

  export const Uri = (
    defaultValue: string,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Uri => ({
    type: "Uri",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.Uri, System]",
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
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof textHorizontalAlignmentKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: textHorizontalAlignmentKeys.indexOf(defaultValue),
    resDVType: "[CodeX.TextHorizontalAlignment, CodeX]",
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
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof textVerticalAlignmentKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: textVerticalAlignmentKeys.indexOf(defaultValue),
    resDVType: "[CodeX.TextVerticalAlignment, CodeX]",
    dvMode,
    enumKeys: textVerticalAlignmentKeys,
    enumType: "CodeX.TextVerticalAlignment",
  });

  const layoutElementHorizontalAlignmentKeys: [
    "Left",
    "Center",
    "Right",
    "Justify"
  ] = ["Left", "Center", "Right", "Justify"];
  export const EnumLayoutHorizontalAlignment = (
    defaultValue: (typeof layoutElementHorizontalAlignmentKeys)[number] = "Left",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof layoutElementHorizontalAlignmentKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: layoutElementHorizontalAlignmentKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.UIX.LayoutHorizontalAlignment, FrooxEngine]",
    dvMode,
    enumKeys: layoutElementHorizontalAlignmentKeys,
    enumType: "FrooxEngine.UIX.LayoutHorizontalAlignment",
  });

  const layoutElementVerticalAlignmentKeys: [
    "Top",
    "Middle",
    "Bottom",
    "Justify"
  ] = ["Top", "Middle", "Bottom", "Justify"];
  export const EnumLayoutVerticalAlignment = (
    defaultValue: (typeof layoutElementVerticalAlignmentKeys)[number] = "Top",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof layoutElementVerticalAlignmentKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: layoutElementVerticalAlignmentKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.UIX.LayoutVerticalAlignment, FrooxEngine]",
    dvMode,
    enumKeys: layoutElementVerticalAlignmentKeys,
    enumType: "FrooxEngine.UIX.LayoutVerticalAlignment",
  });

  const staticTextureFilterModeKeys: [
    "Point",
    "Bilinear",
    "Trilinear",
    "Anisotropic"
  ] = ["Point", "Bilinear", "Trilinear", "Anisotropic"];
  export const EnumStaticTextureFilterMode = (
    defaultValue: (typeof staticTextureFilterModeKeys)[number] = "Bilinear",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof staticTextureFilterModeKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: staticTextureFilterModeKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.TextureFilterMode, FrooxEngine]",
    dvMode,
    enumKeys: staticTextureFilterModeKeys,
    enumType: "FrooxEngine.TextureFilterMode",
  });

  const staticTextureWrapModeKeys: ["Repeat", "Clamp", "Mirror", "MirrorOnce"] =
    ["Repeat", "Clamp", "Mirror", "MirrorOnce"];
  export const EnumStaticTextureWrapMode = (
    defaultValue: (typeof staticTextureWrapModeKeys)[number] = "Repeat",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof staticTextureWrapModeKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: staticTextureWrapModeKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.TextureWrapMode, FrooxEngine]",
    dvMode,
    enumKeys: staticTextureWrapModeKeys,
    enumType: "FrooxEngine.TextureWrapMode",
  });

  const zWriteKeys: ["Auto", "Off", "On"] = ["Auto", "Off", "On"];
  export const EnumZWrite = (
    defaultValue: (typeof zWriteKeys)[number] = "Auto",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof zWriteKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: zWriteKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.ZWrite, FrooxEngine]",
    dvMode,
    enumKeys: zWriteKeys,
    enumType: "FrooxEngine.ZWrite",
  });

  export const Function = <A extends any[]>(
    defaultValue: MainProp.Function<A>["main"],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Function<A> => ({
    type: "Function",
    main: defaultValue,
    mirror: "",
    resDVType: "[System.String, mscorlib]",
    dvMode,
  });

  export const Color = (
    defaultValue: [number, number, number, number] = [1, 1, 1, 1],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Color => ({
    type: "Color",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.color, BaseX]",
    dvMode,
  });

  export const Float2 = (
    defaultValue: [number, number] = [0, 0],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Float2 => ({
    type: "Float2",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.float2, BaseX]",
    dvMode,
  });
  export const Float3 = (
    defaultValue: [number, number, number] = [0, 0, 0],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Float3 => ({
    type: "Float3",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.float3, BaseX]",
    dvMode,
  });
  export const Float4 = (
    defaultValue: [number, number, number, number] = [0, 0, 0, 0],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Float4 => ({
    type: "Float4",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.float4, BaseX]",
    dvMode,
  });
  export const FloatQ = (
    defaultValue: [number, number, number, number] = [0, 0, 0, 0],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.FloatQ => ({
    type: "FloatQ",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.floatQ, BaseX]",
    dvMode,
  });
  export const Rect = (
    defaultValue: [number, number, number, number] = [0, 0, 0, 0],
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Rect => ({
    type: "Rect",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[BaseX.Rect, BaseX]",
    dvMode,
  });
  export const Int = (
    defaultValue: number = 0,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Int => ({
    type: "Int",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.Int32, mscorlib]",
    dvMode,
  });
  export const Long = (
    defaultValue: number = 0,
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Long => ({
    type: "Long",
    main: defaultValue,
    mirror: defaultValue,
    resDVType: "[System.Int64, mscorlib]",
    dvMode,
  });

  const sizeFitKeys: ["Disabled", "MinSize", "PreferredSize"] = [
    "Disabled",
    "MinSize",
    "PreferredSize",
  ];
  export const EnumSizeFit = (
    defaultValue: (typeof sizeFitKeys)[number] = "Disabled",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof sizeFitKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: sizeFitKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.UIX.SizeFit, FrooxEngine]",
    dvMode,
    enumKeys: sizeFitKeys,
    enumType: "FrooxEngine.UIX.SizeFit",
  });

  const interactionElementColorModeKeys: [
    "Explicit",
    "Multiply",
    "Additive",
    "Direct"
  ] = ["Explicit", "Multiply", "Additive", "Direct"];
  export const EnumInteractionElementColorMode = (
    defaultValue: (typeof interactionElementColorModeKeys)[number] = "Explicit",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof interactionElementColorModeKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: interactionElementColorModeKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.UIX.InteractionElement+ColorMode, FrooxEngine]",
    dvMode,
    enumKeys: interactionElementColorModeKeys,
    enumType: "FrooxEngine.UIX.InteractionElement+ColorMode",
  });

  const nineSliceSizingKeys: [
    "FixedSize",
    "TextureSize",
    "RectWidth",
    "RectHeight"
  ] = ["FixedSize", "TextureSize", "RectWidth", "RectHeight"];
  export const EnumNineSliceSizing = (
    defaultValue: (typeof nineSliceSizingKeys)[number] = "TextureSize",
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof nineSliceSizingKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: nineSliceSizingKeys.indexOf(defaultValue),
    resDVType: "[FrooxEngine.UIX.NineSliceSizing, FrooxEngine]",
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
    { dvMode }: Option = { dvMode: "Field" }
  ): MainProp.Enum<(typeof alignmentModeKeys)[number]> => ({
    type: "Enum",
    main: defaultValue,
    mirror: alignmentModeKeys.indexOf(defaultValue),
    resDVType: "[Elements.Assets.AlignmentMode, Elements.Assets]",
    dvMode,
    enumKeys: alignmentModeKeys,
    enumType: "Elements.Assets.AlignmentMode",
  });
}

export type DetailBase = {
  code: string;
  propsConfig: {
    [key: string]: MainProp.Base;
  };
  children?: "multi";
};

export type getDefaultProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["main"];
};

export type getMainProps<C extends DetailBase> = Partial<
  getDefaultProps<C> &
    (C["children"] extends "multi" ? { children?: React.ReactNode } : {})
>;

export type getMirrorProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["mirror"];
};

export type getWebProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: C["propsConfig"][K]["mirror"];
} & (C["children"] extends "multi" ? { children?: React.ReactNode } : {});

type SyncPropConfig = {
  name: string;
  type: MainProp.Base["type"];
  resDVType: string;
  dvMode: MainProp.DvMode;
  enumType?: string;
  enumKeys?: string[];
};

export type UnitConfig<C extends DetailBase> = {
  code: string;
  defaultProps: getDefaultProps<C>;
  syncPropConfigList: SyncPropConfig[];
};

export const generateUnitConfig = <C extends DetailBase>(
  config: C
): UnitConfig<C> => {
  return {
    code: config.code,
    defaultProps: Object.keys(config.propsConfig).reduce(
      (acc, key: keyof getDefaultProps<C>) => {
        acc[key] = config.propsConfig[key].main;
        return acc;
      },
      {} as getDefaultProps<C>
    ),
    syncPropConfigList: Object.keys(config.propsConfig).map((key) => ({
      name: key,
      type: config.propsConfig[key].type,
      resDVType: config.propsConfig[key].resDVType,
      dvMode: config.propsConfig[key].dvMode,
      enumType: config.propsConfig[key].enumType,
      enumKeys: config.propsConfig[key].enumKeys,
    })),
  };
};
