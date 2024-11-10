import { ObjectComponent } from "./type";
import {
  InitialContext,
  ModifyContext,
  VirtualContext,
} from "./virtualContext";
import { FieldDataPrimitive, VirtualField } from "./virtualField";
import { VirtualReference } from "./virtualReference";

export class VirtualComponent {
  context: VirtualContext;
  type: string;
  id: string;
  version: number = -1;
  persistent: VirtualField<FieldDataPrimitive<true>>;
  data: { [key: string]: VirtualField };
  legacyData: { [key: string]: VirtualReference };

  constructor(
    context: VirtualContext,
    data: {
      type: string;
      version: number;
      id: string;
      persistent: VirtualField<FieldDataPrimitive<true>>;
      data: { [key: string]: VirtualField };
      legacyData: { [key: string]: VirtualReference };
    },
  ) {
    this.context = context;
    this.type = data.type;
    this.id = data.id;
    this.version = data.version;
    this.persistent =
      data.persistent ??
      VirtualField.create(context, { type: "Primitive", data: true });
    this.data = data.data;
    this.legacyData = data.legacyData;
  }

  static generate(
    initialContext: InitialContext,
    data: ObjectComponent,
  ): VirtualComponent {
    //TODO: ワーニングを出すようにする
    const type = initialContext.types[data.Type] ?? "";
    const component = new VirtualComponent(initialContext.context, {
      type: type,
      version: initialContext.typeVersions[type] ?? -1,
      id: data.Data.ID as string,
      persistent: VirtualField.generate(
        initialContext,
        {
          ID: data.Data["persistent-ID"],
          Data: true,
        },
        {
          source: {
            type: "Component",
            componentType: type,
          },
          filedPath: ["persistent"],
        },
      ),
      data: Object.entries(data.Data).reduce(
        (acc, [key, value]) => {
          if (key === "ID" || key === "persistent-ID") {
            return acc;
          }
          if (value && typeof value === "object") {
            acc[key] = VirtualField.generate(
              initialContext,
              value,
              {
                source: {
                  type: "Component",
                  componentType: type,
                },
                filedPath: [key],
              },
              {
                key: key,
              },
            );
          }
          return acc;
        },
        {} as { [key: string]: VirtualField },
      ),
      legacyData: Object.entries(data.Data).reduce(
        (acc, [key, value]) => {
          if (key === "ID" || key === "persistent-ID") {
            return acc;
          }
          if (value && typeof value === "object") {
            return acc;
          }
          if (typeof value === "string") {
            acc[key] = VirtualReference.generate(initialContext, value);
            return acc;
          } else {
            throw new Error("Invalid legacy data");
          }
          return acc;
        },
        {} as { [key: string]: VirtualReference },
      ),
    });
    initialContext.setComponent(data.Data.ID as string, component);
    return component;
  }

  export(
    typeGetter: (type: string, version: number) => number,
  ): ObjectComponent {
    return {
      Type: typeGetter(this.type, this.version),
      Data: {
        ID: this.id,
        "persistent-ID": this.persistent.id,
        ...Object.entries(this.data).reduce(
          (acc, [key, field]) => ({ ...acc, [key]: field.export(typeGetter) }),
          {} as { [key: string]: unknown },
        ),
        ...Object.entries(this.legacyData).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value.export() }),
          {} as { [key: string]: unknown },
        ),
      },
    };
  }

  entryContext(modifyContext: ModifyContext) {
    if (this.context === modifyContext.context) {
      return;
    }
    modifyContext.setComponent(this.id, this);
    modifyContext.setComponentType(this.type, this.version);
    this.persistent.entryContext(modifyContext);
    Object.values(this.data).forEach((field) => {
      field.entryContext(modifyContext);
    });
  }
}
