import { VirtualComponent } from "./virtualComponent";
import { InitialContext, VirtualContext } from "./virtualContext";
import { FieldData, Ref, VirtualField } from "./virtualField";
import { VirtualSlot } from "./virtualSlot";

export class VirtualReference {
  ref: Ref<VirtualComponent | VirtualSlot | VirtualField<FieldData>>;

  constructor(
    ref: Ref<VirtualComponent | VirtualSlot | VirtualField<FieldData>>,
  ) {
    this.ref = ref;
  }

  static generate(initialContext: InitialContext, id: string) {
    return new VirtualReference({ type: "Id", id });
  }

  static create(context: VirtualContext, id: string) {
    return new VirtualReference({ type: "Id", id });
  }

  setRef(option: {
    components: Map<string, VirtualComponent>;
    slots: Map<string, VirtualSlot>;
    fields: Map<string, VirtualField<FieldData>>;
  }): void {
    if (this.ref.type !== "Id" || !this.ref.id) {
      return;
    }
    const target =
      option.slots.get(this.ref.id) ??
      option.components.get(this.ref.id) ??
      option.fields.get(this.ref.id);
    if (target) {
      this.ref = { type: "Ref", target };
    }
  }

  contextMoved(context: VirtualContext) {
    if (this.ref.type === "Id") {
      return;
    }
    if (this.ref.target?.context !== context) {
      this.ref = { type: "Id", id: null };
    }
  }

  export() {
    if (this.ref.type === "Id") {
      return this.ref.id;
    }
    return this.ref.target?.id;
  }
}
