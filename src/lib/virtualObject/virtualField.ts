import { generateId } from "./util";
import { VirtualComponent } from "./virtualComponent";
import {
  InitialContext,
  ModifyContext,
  VirtualContext,
} from "./virtualContext";
import { VirtualSlot } from "./virtualSlot";

type Exportable = {
  id: string;
};

export type Ref<T extends Exportable> =
  | {
      type: "Id";
      id: string | null;
    }
  | {
      type: "Ref";
      target: T | null;
    };

const exportRef = <R extends Ref<Exportable>>(ref: R) => {
  switch (ref.type) {
    case "Id":
      return ref.id;
    case "Ref":
      return ref.target?.id ?? null;
  }
};

type Primitive =
  | string
  | number
  | boolean
  | null
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, string];

export type FieldDataPrimitive<D extends Primitive = Primitive> = {
  type: "Primitive";
  data: D;
};

type FiledDataUser = {
  type: "UserRef";
  user: VirtualField<FieldDataUnknownRef>;
  _machineId: VirtualField<FieldDataPrimitive<string>>;
  _userId: VirtualField<FieldDataPrimitive<string>>;
};

type FieldDataConditions = {
  type: "Conditions";
  field: VirtualField<FieldDataRefComponent>;
  invert: VirtualField<FieldDataPrimitive<boolean>>;
};

type FiledDataPoint = {
  type: "Point";
  position: VirtualField<FieldDataPrimitive<number>>;
  value: VirtualField<FieldDataPrimitive<[number, number]>>;
};

type FieldDataViewPort = {
  type: "ViewPort";
  anchorMin: VirtualField<FieldDataPrimitive<[number, number]>>;
  anchorMax: VirtualField<FieldDataPrimitive<[number, number]>>;
  active: VirtualField<FieldDataPrimitive<boolean>>;
};

type FieldDataDelegate = {
  type: "Delegate";
  data: {
    target: Ref<VirtualComponent>;
    method: string;
  };
};

type FiledDataDelegateButtonEventHandler = {
  type: "DelegateButtonEventHandler";
  tag: VirtualField<FieldDataPrimitive<string>>;
  value: VirtualField<FieldDataPrimitive<string>>;
};

type FieldDataColorDriver = {
  type: "ColorDriver";
  colorDrive: VirtualField<FieldDataRefField>;
  tintColorMode: VirtualField<FieldDataRefField>;
  normalColor: VirtualField<
    FieldDataPrimitive<[number, number, number, string]>
  >;
  highlightColor: VirtualField<
    FieldDataPrimitive<[number, number, number, string]>
  >;
  pressColor: VirtualField<
    FieldDataPrimitive<[number, number, number, string]>
  >;
  disabledColor: VirtualField<
    FieldDataPrimitive<[number, number, number, string]>
  >;
};

type FieldDataType = {
  type: "Type";
  data: string;
};

type FieldDataRefSlot = {
  type: "Slot";
  data: Ref<VirtualSlot>;
};

type FieldDataRefComponent = {
  type: "Component";
  data: Ref<VirtualComponent>;
};

type FieldDataRefField = {
  type: "Field";
  data: Ref<VirtualField<FieldData>>;
};

type FieldDataUnknownRef = {
  type: "UnknownRef";
  data: string | null;
};

type FieldDataRaw = {
  type: "Raw";
  raw: unknown;
};

type FiledList = {
  type: "FieldList";
  data: VirtualField<FieldData>[];
};

type FieldDataWithoutList =
  | FieldDataPrimitive
  | FiledDataUser
  | FieldDataConditions
  | FiledDataPoint
  | FieldDataViewPort
  | FieldDataDelegate
  | FiledDataDelegateButtonEventHandler
  | FieldDataColorDriver
  | FieldDataType
  | FieldDataRefField
  | FieldDataRefSlot
  | FieldDataRefComponent
  | FieldDataUnknownRef
  | FieldDataRaw;
export type FieldData = FieldDataWithoutList | FiledList;

/**
 * 型フィールドかどうかを判定する。
 * 型はTypesのインデックスが入っているだけであるため数値型と厳密に区別ができないため、Component名やフィールド名を見て頑張る。
 * @param source ソース
 * @param filedPath フィールドパス
 * @param data データ
 * @returns
 */
const isTypeField = (
  source: { type: "Component"; componentType: string },
  filedPath: (string | number)[],
  data: string,
): { isType: boolean; warning: string[] } => {
  const lastKey = filedPath[filedPath.length - 1];
  // フィールド名から型フィールドであることを判定する
  if (
    typeof lastKey === "string" &&
    ["SpawnNodeType", "InputType", "OutputType", "MatchingType"].includes(
      lastKey,
    )
  ) {
    return { isType: true, warning: [] };
  }
  // 型フィールドである可能性がある
  if (
    (typeof lastKey === "string" && lastKey.match(/Type$/)) ||
    data.match(/DataFeedEntity/) ||
    !data.match(/\[/)
  ) {
    return {
      isType: false,
      warning: [
        `Possible type field detected: ${source.componentType} / ${lastKey}: ${data}`,
      ],
    };
  }
  return {
    isType: false,
    warning: [],
  };
};

export class VirtualField<FD extends FieldData = FieldData> {
  context: VirtualContext;
  id: string;
  data: FD;

  constructor(init: { context: VirtualContext; id: string; data: FD }) {
    this.context = init.context;
    this.id = init.id;
    this.data = init.data;
  }

  static generate<D extends FieldData, I extends { ID: string }>(
    initialContext: InitialContext,
    input: I,
    option: {
      source: { type: "Slot" } | { type: "Component"; componentType: string };
      filedPath: (string | number)[];
    },
    debugObject?: {
      from?: VirtualComponent | VirtualSlot | VirtualField<FieldData>;
      key: string;
    },
  ): VirtualField<D> {
    const id = input.ID;
    const finalizeField = (field: VirtualField<D>) => {
      initialContext.setField(id, field);
      if (
        field.data.type === "Slot" ||
        field.data.type === "Component" ||
        field.data.type === "Field" ||
        field.data.type === "UnknownRef" ||
        field.data.type === "Delegate" ||
        field.data.type === "ColorDriver"
      ) {
        initialContext.addRefList(field);
      }
      return field;
    };
    if ("Data" in input) {
      const data = input.Data;

      // UnknownRef
      if (
        typeof data === "string" &&
        data.match(
          /([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/,
        )
      ) {
        return finalizeField(
          new VirtualField({
            context: initialContext.context,
            id: input.ID,
            data: {
              type: "UnknownRef",
              data: data,
            },
          }) as VirtualField<D>,
        );
      }

      // Type
      if (
        typeof data === "number" &&
        initialContext.types[data] &&
        option.source.type === "Component"
      ) {
        const type = initialContext.types[data];
        if (type) {
          const { isType, warning } = isTypeField(
            option.source,
            option.filedPath,
            type,
          );
          initialContext.addWarning(warning);
          if (isType) {
            return finalizeField(
              new VirtualField({
                context: initialContext.context,
                id: input.ID,
                data: {
                  type: "Type",
                  data: type,
                },
              }) as VirtualField<D>,
            );
          }
        }
      }

      // Primitive
      if (
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "boolean"
      ) {
        return finalizeField(
          new VirtualField({
            context: initialContext.context,
            id: input.ID,
            data: {
              type: "Primitive",
              data: data,
            },
          }) as VirtualField<D>,
        );
      }

      if (Array.isArray(data)) {
        // FieldList
        if (
          data.length > 0 &&
          data[0] !== null &&
          typeof data[0] === "object" &&
          "ID" in data[0] &&
          typeof data[0].ID === "string"
        ) {
          return finalizeField(
            new VirtualField({
              context: initialContext.context,
              id,
              data: {
                type: "FieldList",
                //TODO: dがanyなので、型をつける
                data: data.map((d, index) =>
                  VirtualField.generate(
                    initialContext,
                    d,
                    {
                      source: option.source,
                      filedPath: [...option.filedPath, index],
                    },
                    debugObject,
                  ),
                ),
              },
            }) as VirtualField<D>,
          );
        }

        // Primitive
        return finalizeField(
          new VirtualField({
            context: initialContext.context,
            id,
            data: {
              type: "Primitive",
              data: data as FieldDataPrimitive["data"],
            },
          }) as VirtualField<D>,
        );
      }
      if (data !== null && typeof data === "object") {
        //Delegate
        if (
          "Target" in data &&
          "Method" in data &&
          typeof data.Target === "string" &&
          typeof data.Method === "string"
        ) {
          return finalizeField(
            new VirtualField({
              context: initialContext.context,
              id,
              data: {
                type: "Delegate",
                data: {
                  target: { type: "Id", id: data.Target },
                  method: data.Method,
                },
              },
            }) as VirtualField<D>,
          );
        }
      }
    }

    // if (
    //   "User" in input &&
    //   input.User &&
    //   typeof input.User === "object" &&
    //   "ID" in input.User &&
    //   typeof input.User.ID === "string" &&
    //   "_machineId" in input &&
    //   input._machineId &&
    //   typeof input._machineId === "object" &&
    //   "ID" in input._machineId &&
    //   typeof input._machineId.ID === "string" &&
    //   "_userId" in input &&
    //   input._userId &&
    //   typeof input._userId === "object" &&
    //   "ID" in input._userId &&
    //   typeof input._userId.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "UserRef",
    //         user: VirtualField.generate(
    //           initialContext,
    //           input.User as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         _machineId: VirtualField.generate(
    //           initialContext,
    //           input._machineId as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         _userId: VirtualField.generate(
    //           initialContext,
    //           input._userId as { ID: string; Data: string },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // if (
    //   "Field" in input &&
    //   input.Field &&
    //   typeof input.Field === "object" &&
    //   "ID" in input.Field &&
    //   typeof input.Field.ID === "string" &&
    //   "Invert" in input &&
    //   input.Invert &&
    //   typeof input.Invert === "object" &&
    //   "ID" in input.Invert &&
    //   typeof input.Invert.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "Conditions",
    //         field: VirtualField.generate(
    //           initialContext,
    //           input.Field as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         invert: VirtualField.generate(
    //           initialContext,
    //           input.Invert as { ID: string; Data: boolean },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // if (
    //   "Position" in input &&
    //   input.Position &&
    //   typeof input.Position === "object" &&
    //   "ID" in input.Position &&
    //   typeof input.Position.ID === "string" &&
    //   "Value" in input &&
    //   input.Value &&
    //   typeof input.Value === "object" &&
    //   "ID" in input.Value &&
    //   typeof input.Value.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "Point",
    //         position: VirtualField.generate(
    //           initialContext,
    //           input.Position as { ID: string; Data: number },
    //           debugObject
    //         ),
    //         value: VirtualField.generate(
    //           initialContext,
    //           input.Value as { ID: string; Data: unknown },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // if (
    //   "AnchorMin" in input &&
    //   input.AnchorMin &&
    //   typeof input.AnchorMin === "object" &&
    //   "ID" in input.AnchorMin &&
    //   typeof input.AnchorMin.ID === "string" &&
    //   "AnchorMax" in input &&
    //   input.AnchorMax &&
    //   typeof input.AnchorMax === "object" &&
    //   "ID" in input.AnchorMax &&
    //   typeof input.AnchorMax.ID === "string" &&
    //   "Active" in input &&
    //   input.Active &&
    //   typeof input.Active === "object" &&
    //   "ID" in input.Active &&
    //   typeof input.Active.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "ViewPort",
    //         anchorMin: VirtualField.generate(
    //           initialContext,
    //           input.AnchorMin as { ID: string; Data: [number, number] },
    //           debugObject
    //         ),
    //         anchorMax: VirtualField.generate(
    //           initialContext,
    //           input.AnchorMax as { ID: string; Data: [number, number] },
    //           debugObject
    //         ),
    //         active: VirtualField.generate(
    //           initialContext,
    //           input.Active as { ID: string; Data: boolean },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // if (
    //   "Tag" in input &&
    //   input.Tag &&
    //   typeof input.Tag === "object" &&
    //   "ID" in input.Tag &&
    //   typeof input.Tag.ID === "string" &&
    //   "Value" in input &&
    //   input.Value &&
    //   typeof input.Value === "object" &&
    //   "ID" in input.Value &&
    //   typeof input.Value.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "DelegateButtonEventHandler",
    //         tag: VirtualField.generate(
    //           initialContext,
    //           input.Tag as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         value: VirtualField.generate(
    //           initialContext,
    //           input.Value as { ID: string; Data: string },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // if (
    //   "ColorDrive" in input &&
    //   input.ColorDrive &&
    //   typeof input.ColorDrive === "object" &&
    //   "ID" in input.ColorDrive &&
    //   typeof input.ColorDrive.ID === "string" &&
    //   "TintColorMode" in input &&
    //   input.TintColorMode &&
    //   typeof input.TintColorMode === "object" &&
    //   "ID" in input.TintColorMode &&
    //   typeof input.TintColorMode.ID === "string" &&
    //   "NormalColor" in input &&
    //   input.NormalColor &&
    //   typeof input.NormalColor === "object" &&
    //   "ID" in input.NormalColor &&
    //   typeof input.NormalColor.ID === "string" &&
    //   "HighlightColor" in input &&
    //   input.HighlightColor &&
    //   typeof input.HighlightColor === "object" &&
    //   "ID" in input.HighlightColor &&
    //   typeof input.HighlightColor.ID === "string" &&
    //   "PressColor" in input &&
    //   input.PressColor &&
    //   typeof input.PressColor === "object" &&
    //   "ID" in input.PressColor &&
    //   typeof input.PressColor.ID === "string" &&
    //   "DisabledColor" in input &&
    //   input.DisabledColor &&
    //   typeof input.DisabledColor === "object" &&
    //   "ID" in input.DisabledColor &&
    //   typeof input.DisabledColor.ID === "string"
    // ) {
    //   return finalizeField(
    //     new VirtualField({
    //       context: initialContext.context,
    //       id,
    //       data: {
    //         type: "ColorDriver",
    //         colorDrive: VirtualField.generate(
    //           initialContext,
    //           input.ColorDrive as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         tintColorMode: VirtualField.generate(
    //           initialContext,
    //           input.TintColorMode as { ID: string; Data: string },
    //           debugObject
    //         ),
    //         normalColor: VirtualField.generate(
    //           initialContext,
    //           input.NormalColor as {
    //             ID: string;
    //             Data: [number, number, number, string];
    //           },
    //           debugObject
    //         ),
    //         highlightColor: VirtualField.generate(
    //           initialContext,
    //           input.HighlightColor as {
    //             ID: string;
    //             Data: [number, number, number, string];
    //           },
    //           debugObject
    //         ),
    //         pressColor: VirtualField.generate(
    //           initialContext,
    //           input.PressColor as {
    //             ID: string;
    //             Data: [number, number, number, string];
    //           },
    //           debugObject
    //         ),
    //         disabledColor: VirtualField.generate(
    //           initialContext,
    //           input.DisabledColor as {
    //             ID: string;
    //             Data: [number, number, number, string];
    //           },
    //           debugObject
    //         ),
    //       },
    //     }) as VirtualField<D>
    //   );
    // }

    // Raw
    const rawResolver = (
      value: unknown,
      filedPath: (string | number)[],
    ): unknown => {
      if (value !== null && typeof value === "object") {
        if (
          "ID" in value &&
          typeof value.ID === "string" &&
          value.ID.match(
            /([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/,
          )
        ) {
          return VirtualField.generate(
            initialContext,
            value as { ID: string },
            {
              source: option.source,
              filedPath,
            },
            debugObject,
          );
        }
        if (Array.isArray(value)) {
          return value.map((d: unknown, index: number) =>
            rawResolver(d, [...filedPath, index]),
          );
        }
        return Object.entries(value)
          .map(([key, value]) => ({
            [key]: rawResolver(value, [...filedPath, key]),
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});
      }
      return value;
    };
    const { ID: _id, ...raw } = input;
    return finalizeField(
      new VirtualField({
        context: initialContext.context,
        id,
        data: {
          type: "Raw",
          raw: Object.entries(raw)
            .map(([key, value]) => ({
              [key]: rawResolver(value, [...option.filedPath, key]),
            }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
        },
      }) as VirtualField<D>,
    );
  }

  static create<FD extends Readonly<FieldData>>(
    context: VirtualContext,
    data: FD,
  ): VirtualField<FD> {
    return new VirtualField<FD>({
      context,
      id: generateId(),
      data,
    });
  }

  asPrimitive(): Primitive | null {
    if (this.data.type === "Primitive") {
      return this.data.data;
    }
    return null;
  }

  asSlot(): VirtualSlot | null {
    if (this.data.type === "Slot" && this.data.data.type === "Ref") {
      return this.data.data.target;
    }
    return null;
  }

  asComponent(): VirtualComponent | null {
    if (this.data.type === "Component" && this.data.data.type === "Ref") {
      return this.data.data.target;
    }
    return null;
  }

  asField(): VirtualField | null {
    if (this.data.type === "Field" && this.data.data.type === "Ref") {
      return this.data.data.target;
    }
    return null;
  }

  setRef(option: {
    components: Map<string, VirtualComponent>;
    slots: Map<string, VirtualSlot>;
    fields: Map<string, VirtualField<FieldData>>;
  }): void {
    switch (this.data.type) {
      case "Slot": {
        if (this.data.data.type === "Id" && this.data.data.id) {
          const target = option.slots.get(this.data.data.id);
          if (target) {
            this.data.data = {
              type: "Ref",
              target,
            };
          }
        }
        break;
      }
      case "Component": {
        if (this.data.data.type === "Id" && this.data.data.id) {
          const target = option.components.get(this.data.data.id);
          if (target) {
            this.data.data = {
              type: "Ref",
              target,
            };
          }
        }
        break;
      }
      case "Field": {
        if (this.data.data.type === "Id" && this.data.data.id) {
          const target = option.fields.get(this.data.data.id);
          if (target) {
            this.data.data = {
              type: "Ref",
              target,
            };
          }
        }
        break;
      }
      case "UnknownRef": {
        if (this.data.data) {
          const target =
            option.slots.get(this.data.data) ??
            option.components.get(this.data.data) ??
            option.fields.get(this.data.data);
          if (target instanceof VirtualSlot) {
            this.data = {
              type: "Slot",
              data: { type: "Ref", target },
            } as FD;
          }
          if (target instanceof VirtualComponent) {
            this.data = {
              type: "Component",
              data: { type: "Ref", target },
            } as FD;
          }
          if (target instanceof VirtualField) {
            this.data = {
              type: "Field",
              data: { type: "Ref", target },
            } as FD;
          }
        }
        break;
      }
      case "Delegate": {
        if (this.data.data.target.type === "Id" && this.data.data.target.id) {
          const target = option.components.get(this.data.data.target.id);
          if (target) {
            this.data.data.target = { type: "Ref", target };
          }
        }
        break;
      }
    }
  }

  contextMoved(context: VirtualContext) {
    switch (this.data.type) {
      case "Slot":
      case "Component":
      case "Field": {
        if (
          this.data.data.type === "Ref" &&
          this.data.data.target?.context !== context
        ) {
          this.data.data = { type: "Id", id: null };
        }
        break;
      }
      case "Delegate": {
        if (
          this.data.data.target.type === "Ref" &&
          this.data.data.target.target?.context !== context
        ) {
          this.data.data.target = { type: "Id", id: null };
        }
        break;
      }
    }
  }

  export(typeGetter: (type: string, version: number) => number): unknown {
    switch (this.data.type) {
      case "Primitive": {
        return { ID: this.id, Data: this.data.data };
      }
      case "FieldList": {
        return {
          ID: this.id,
          Data: this.data.data.map((d) => d.export(typeGetter)),
        };
      }
      case "UnknownRef": {
        return { ID: this.id, Data: this.data.data };
      }
      case "UserRef": {
        return {
          ID: this.id,
          User: this.data.user.export(typeGetter),
          _machineId: this.data._machineId.export(typeGetter),
          _userId: this.data._userId.export(typeGetter),
        };
      }
      case "Conditions": {
        return {
          ID: this.id,
          Field: this.data.field.export(typeGetter),
          Invert: this.data.invert.export(typeGetter),
        };
      }
      case "Point": {
        return {
          ID: this.id,
          Position: this.data.position.export(typeGetter),
          Value: this.data.value.export(typeGetter),
        };
      }
      case "ViewPort": {
        return {
          ID: this.id,
          AnchorMin: this.data.anchorMin.export(typeGetter),
          AnchorMax: this.data.anchorMax.export(typeGetter),
          Active: this.data.active.export(typeGetter),
        };
      }
      case "Delegate": {
        return {
          ID: this.id,
          Data: {
            Target: exportRef(this.data.data.target),
            Method: this.data.data.method,
          },
        };
      }
      case "DelegateButtonEventHandler": {
        return {
          ID: this.id,
          Tag: this.data.tag.export(typeGetter),
          Value: this.data.value.export(typeGetter),
        };
      }
      case "ColorDriver": {
        return {
          ID: this.id,
          ColorDrive: this.data.colorDrive.export(typeGetter),
          TintColorMode: this.data.tintColorMode.export(typeGetter),
          NormalColor: this.data.normalColor.export(typeGetter),
          HighlightColor: this.data.highlightColor.export(typeGetter),
          PressColor: this.data.pressColor.export(typeGetter),
          DisabledColor: this.data.disabledColor.export(typeGetter),
        };
      }
      case "Type": {
        return { ID: this.id, Data: typeGetter(this.data.data, 0) };
      }
      case "Slot": {
        return { ID: this.id, Data: exportRef(this.data.data) };
      }
      case "Component": {
        return { ID: this.id, Data: exportRef(this.data.data) };
      }
      case "Field": {
        return { ID: this.id, Data: exportRef(this.data.data) };
      }
      case "Raw": {
        {
          const raw = this.data.raw;
          const rawResolver = (value: unknown): unknown => {
            if (value !== null && typeof value === "object") {
              if (value instanceof VirtualField) {
                return value.export(typeGetter);
              }
              if (Array.isArray(value)) {
                return value.map(rawResolver);
              }
              return Object.entries(value)
                .map(([key, value]) => ({ [key]: rawResolver(value) }))
                .reduce((acc, cur) => ({ ...acc, ...cur }), {});
            }
            return value;
          };
          return {
            ID: this.id,
            ...(raw && typeof raw === "object"
              ? Object.entries(raw)
                  .map(([key, value]) => ({ [key]: rawResolver(value) }))
                  .reduce((acc, cur) => ({ ...acc, ...cur }), {})
              : {}),
          };
        }
      }
    }
  }

  entryContext(modifyContext: ModifyContext) {
    if (this.context === modifyContext.context) {
      return;
    }
    this.context = modifyContext.context;
    modifyContext.setField(this.id, this);
    if (this.data.type === "FieldList") {
      this.data.data.forEach((field) => {
        field.entryContext(modifyContext);
      });
    }
  }
}
