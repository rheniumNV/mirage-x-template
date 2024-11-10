import { ObjectSlot } from "./type";
import { generateId } from "./util";
import { VirtualComponent } from "./virtualComponent";
import {
  InitialContext,
  ModifyContext,
  VirtualContext,
} from "./virtualContext";
import { FieldData, FieldDataPrimitive, VirtualField } from "./virtualField";
import { VirtualReference } from "./virtualReference";

export type VirtualComponentProps = {
  type: string;
  typeVersion?: number;
  data?: { [key: string]: FieldData };
  legacyData?: { [key: string]: string };
};
export class VirtualSlot {
  context: VirtualContext;
  id: string;
  componentsId: string;
  persistent: VirtualField<FieldDataPrimitive<true>>;
  name: VirtualField<FieldDataPrimitive<string | null>>;
  tag: VirtualField<FieldDataPrimitive<string | null>>;
  active: VirtualField<FieldDataPrimitive<boolean>>;
  position: VirtualField<FieldDataPrimitive<[number, number, number]>>;
  rotation: VirtualField<FieldDataPrimitive<[number, number, number, number]>>;
  scale: VirtualField<FieldDataPrimitive<[number, number, number]>>;
  orderOffset: VirtualField<FieldDataPrimitive<number>>;
  components: VirtualComponent[];
  parent?: VirtualSlot;
  children: VirtualSlot[];

  constructor(init: {
    context: VirtualContext;
    id?: string;
    componentsId?: string;
    persistent?: VirtualField<FieldDataPrimitive<true>>;
    name?: VirtualField<FieldDataPrimitive<string | null>>;
    tag?: VirtualField<FieldDataPrimitive<string | null>>;
    active?: VirtualField<FieldDataPrimitive<boolean>>;
    position?: VirtualField<FieldDataPrimitive<[number, number, number]>>;
    rotation?: VirtualField<
      FieldDataPrimitive<[number, number, number, number]>
    >;
    scale?: VirtualField<FieldDataPrimitive<[number, number, number]>>;
    orderOffset?: VirtualField<FieldDataPrimitive<number>>;
    components?: VirtualComponent[];
    parent?: VirtualSlot;
  }) {
    this.context = init.context;
    this.id = init.id ?? generateId();
    this.componentsId = init.componentsId ?? generateId();
    this.persistent =
      init.persistent ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: true },
      });
    this.name =
      init.name ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: "EmptyObject" },
      });

    this.tag =
      init.tag ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: null },
      });
    this.active =
      init.active ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: true },
      });
    this.position =
      init.position ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: [0, 0, 0] },
      });
    this.rotation =
      init.rotation ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: [0, 0, 0, 1] },
      });
    this.scale =
      init.scale ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: [1, 1, 1] },
      });
    this.orderOffset =
      init.orderOffset ??
      new VirtualField({
        context: this.context,
        id: generateId(),
        data: { type: "Primitive", data: 0 },
      });
    this.components = init.components ?? [];
    this.children = [];
    this.parent = init.parent;
    this.parent?.children.push(this);
  }

  static generate(
    initialContext: InitialContext,
    objectSlot: ObjectSlot,
    parent?: VirtualSlot,
  ): VirtualSlot {
    const slot = new VirtualSlot({
      context: initialContext.context,
      id: objectSlot.ID,
      componentsId: objectSlot.Components.ID,
      persistent: VirtualField.generate(
        initialContext,
        {
          ID: objectSlot["Persistent-ID"],
          Data: true,
        },
        {
          source: {
            type: "Slot",
          },
          filedPath: ["Persistent-ID"],
        },
        {
          key: "Persistent-ID",
        },
      ),
      parent,
      name: VirtualField.generate(initialContext, objectSlot.Name, {
        source: {
          type: "Slot",
        },
        filedPath: ["Name"],
      }),
      tag: VirtualField.generate(initialContext, objectSlot.Tag, {
        source: {
          type: "Slot",
        },
        filedPath: ["tag"],
      }),
      active: VirtualField.generate(initialContext, objectSlot.Active, {
        source: {
          type: "Slot",
        },
        filedPath: ["Active"],
      }),
      position: VirtualField.generate(initialContext, objectSlot.Position, {
        source: {
          type: "Slot",
        },
        filedPath: ["Position"],
      }),
      rotation: VirtualField.generate(initialContext, objectSlot.Rotation, {
        source: {
          type: "Slot",
        },
        filedPath: ["Rotation"],
      }),
      scale: VirtualField.generate(initialContext, objectSlot.Scale, {
        source: {
          type: "Slot",
        },
        filedPath: ["Scale"],
      }),
      orderOffset: VirtualField.generate(
        initialContext,
        objectSlot.OrderOffset,
        {
          source: {
            type: "Slot",
          },
          filedPath: ["OrderOffset"],
        },
      ),
      components: objectSlot.Components.Data.map((c) =>
        VirtualComponent.generate(initialContext, c),
      ),
    });
    objectSlot.Children.forEach((child) =>
      VirtualSlot.generate(initialContext, child, slot),
    );
    initialContext.setSlot(objectSlot.ID, slot);
    initialContext.setSlotComponents(objectSlot.Components.ID, slot);
    return slot;
  }

  export(typeGetter: (type: string, version: number) => number): ObjectSlot {
    return {
      ID: this.id,
      "Persistent-ID": this.persistent.id,
      Name: this.name.export(typeGetter) as { ID: string; Data: string | null },
      Tag: this.tag.export(typeGetter) as { ID: string; Data: string | null },
      Active: this.active.export(typeGetter) as {
        ID: string;
        Data: boolean;
      },
      Position: this.position.export(typeGetter) as {
        ID: string;
        Data: [number, number, number];
      },
      Rotation: this.rotation.export(typeGetter) as {
        ID: string;
        Data: [number, number, number, number];
      },
      Scale: this.scale.export(typeGetter) as {
        ID: string;
        Data: [number, number, number];
      },
      OrderOffset: this.orderOffset.export(typeGetter) as {
        ID: string;
        Data: number;
      },
      ParentReference: this.parent?.id ?? generateId(),
      Components: {
        ID: this.componentsId,
        Data: this.components.map((component) => component.export(typeGetter)),
      },
      Children: this.children.map((child) => child.export(typeGetter)),
    };
  }

  entryContext(modifyContext: ModifyContext) {
    if (this.context === modifyContext.context) {
      return;
    }
    this.context = modifyContext.context;
    modifyContext.setSlot(this.id, this);
    modifyContext.setSlotComponents(this.componentsId, this);
    this.name.entryContext(modifyContext);
    this.tag.entryContext(modifyContext);
    this.active.entryContext(modifyContext);
    this.position.entryContext(modifyContext);
    this.rotation.entryContext(modifyContext);
    this.scale.entryContext(modifyContext);
    this.orderOffset.entryContext(modifyContext);
    this.components.forEach((component) => {
      component.entryContext(modifyContext);
    });
    this.children.forEach((child) => {
      child.entryContext(modifyContext);
    });
  }

  setParent(parent: VirtualSlot) {
    if (this.context !== parent.context) {
      parent.context.entryContext(this);
    }
    const parentList: (VirtualSlot | undefined)[] = [parent];
    while (parentList[parentList.length - 1]) {
      const nextParent = parentList[parentList.length - 1]?.parent;
      if (
        this === nextParent ||
        parentList.every((slot) => nextParent === slot)
      ) {
        console.error("setParent. slot circular reference", this, parent);
        throw new Error("setParent. slot circular reference");
      }
      parentList.push(nextParent);
    }

    if (this.parent) {
      this.parent.children = this.parent.children.filter((c) => c !== this);
    }
    this.parent = parent;
    parent.children.push(this);
  }

  removeComponent(component: VirtualComponent) {
    this.components = this.components.filter((c) => c !== component);
  }

  removeChild(child?: VirtualSlot) {
    if (child) {
      this.children = this.children.filter((c) => c !== child);
    }
  }

  createComponent(init: VirtualComponentProps) {
    const component = new VirtualComponent(this.context, {
      type: init.type,
      version: init.typeVersion ?? -1,
      id: generateId(),
      persistent: VirtualField.create(this.context, {
        type: "Primitive",
        data: true,
      }),
      data: Object.entries(init.data ?? {}).reduce(
        (acc, [key, value]) => {
          acc[key] = VirtualField.create(this.context, value);
          return acc;
        },
        {} as { [key: string]: VirtualField },
      ),
      legacyData: Object.entries(init.legacyData ?? {}).reduce(
        (acc, [key, value]) => {
          acc[key] = VirtualReference.create(this.context, value);
          return acc;
        },
        {} as { [key: string]: VirtualReference },
      ),
    });
    this.components.push(component);
    return component;
  }

  createChild(init: {
    name?: string;
    tag?: string;
    active?: boolean;
    position?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    orderOffset?: number;
  }) {
    return new VirtualSlot({
      context: this.context,
      id: generateId(),
      componentsId: generateId(),
      name: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.name ?? "EmptyObject",
      }),
      tag: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.tag ?? null,
      }),
      active: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.active ?? true,
      }),
      position: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.position ?? [0, 0, 0],
      }),
      rotation: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.rotation ?? [0, 0, 0, 1],
      }),
      scale: VirtualField.create(this.context, {
        type: "Primitive",
        data: init.scale ?? [1, 1, 1],
      }),
      parent: this,
    });
  }

  destroy() {
    this.parent?.removeChild(this);
  }
}
