import { EmptyContext } from "./emptyContext";
import { ObjectContext } from "./type";
import { generateId } from "./util";
import { VirtualComponent } from "./virtualComponent";
import { FieldData, VirtualField } from "./virtualField";
import { VirtualSlot } from "./virtualSlot";

type VirtualRef = {
  setRef: (option: {
    components: Map<string, VirtualComponent>;
    slots: Map<string, VirtualSlot>;
    fields: Map<string, VirtualField<FieldData>>;
  }) => void;
  contextMoved: (context: VirtualContext) => void;
};

export type InitialContext = {
  readonly context: VirtualContext;
  readonly types: readonly string[];
  readonly typeVersions: { readonly [type: string]: number };
  readonly setSlot: (id: string, slot: VirtualSlot) => void;
  readonly setSlotComponents: (id: string, slot: VirtualSlot) => void;
  readonly setComponent: (id: string, component: VirtualComponent) => void;
  readonly setField: (id: string, field: VirtualField) => void;
  readonly addRefList: (ref: VirtualRef) => void;
  readonly addWarning: (warnings: string[]) => void;
};

export type ModifyContext = {
  readonly context: VirtualContext;
  readonly setSlot: (id: string, slot: VirtualSlot) => void;
  readonly setSlotComponents: (id: string, slot: VirtualSlot) => void;
  readonly setComponent: (id: string, component: VirtualComponent) => void;
  readonly setField: (id: string, field: VirtualField) => void;
  readonly setComponentType: (type: string, version: number) => void;
  readonly addRefList: (ref: VirtualRef) => void;
  readonly addWarning: (warnings: string[]) => void;
};

export class VirtualContext {
  private versionNumber: string;
  private featureFlags: { [flag: string]: number };
  object: VirtualSlot;
  private _assets: VirtualComponent[] = [];

  private _active: boolean = true;

  get active(): boolean {
    return this._active;
  }

  get assets(): readonly VirtualComponent[] {
    return this._assets;
  }

  constructor(init: {
    versionNumber: string;
    featureFlags: { [flag: string]: number };
    typeVersions: { [type: string]: number };
  }) {
    this.versionNumber = init.versionNumber;
    this.featureFlags = init.featureFlags;
    this.object = new VirtualSlot({ context: this });
  }

  static generate(root: ObjectContext): {
    context: VirtualContext;
    warnings: string[];
  } {
    const matchedVersion = root.VersionNumber.match(
      /^([0-9]{4})\.([0-9]{1,2})\.([0-9]{1,2})/,
    );
    if (!matchedVersion || matchedVersion?.length < 3) {
      throw new Error(`Invalid version: ${root.VersionNumber}`);
    }

    if (
      Number(matchedVersion[1]) < 2024 ||
      (matchedVersion[1] === "2024" &&
        (Number(matchedVersion[2]) < 7 ||
          (matchedVersion[2] === "7" && Number(matchedVersion[3]) < 12)))
    ) {
      throw new Error(`Unsupported version: ${root.VersionNumber}`);
    }

    const slots = new Map<string, VirtualSlot>();
    const slotComponents = new Map<string, VirtualSlot>();
    const components = new Map<string, VirtualComponent>();
    const fields = new Map<string, VirtualField<FieldData>>();
    const refList: VirtualRef[] = [];
    const warnings: string[] = [];

    const context = new VirtualContext({
      versionNumber: root.VersionNumber,
      featureFlags: root.FeatureFlags,
      typeVersions: root.TypeVersions,
    });

    const initialContext: InitialContext = {
      context,
      types: root.Types,
      typeVersions: root.TypeVersions,
      setSlot: (id, slot) => slots.set(id, slot),
      setSlotComponents: (id, slot) => slotComponents.set(id, slot),
      setComponent: (id, component) => components.set(id, component),
      setField: (id, field) => fields.set(id, field),
      addRefList: (ref) => refList.push(ref),
      addWarning: (warnings) => warnings.push(...warnings),
    };

    context.object = VirtualSlot.generate(initialContext, root.Object);

    context._assets =
      root.Assets?.map((asset) =>
        VirtualComponent.generate(initialContext, asset),
      ) ?? [];

    slots.forEach((slot) => {
      slot.id = generateId();
      slot.componentsId = generateId();
    });
    components.forEach((component) => {
      component.id = generateId();
    });
    fields.forEach((field) => {
      field.id = generateId();
    });
    context._assets.forEach((asset) => {
      asset.id = generateId();
      Object.values(asset.data).forEach((field) => {
        field.id = generateId();
      });
    });

    refList.forEach((ref) => {
      ref.setRef({
        slots,
        components,
        fields,
      });
    });

    return { context, warnings };
  }

  static createEmpty() {
    return VirtualContext.generate(EmptyContext);
  }

  export(): { context: ObjectContext; warnings: string[] } {
    const types: string[] = [];
    const typeVersions: { [type: string]: number } = {};
    const typeGetter = (type: string, version: number) => {
      const index = types.findIndex((t) => t === type);
      if (index === -1) {
        types.push(type);
        if (typeVersions[type] === undefined && version >= 0) {
          typeVersions[type] = version;
        }
        return types.length - 1;
      }
      return index;
    };
    const object = this.object.export(typeGetter);
    const assets = this._assets.map((asset) => asset.export(typeGetter));

    return {
      context: {
        VersionNumber: this.versionNumber,
        FeatureFlags: this.featureFlags,
        Types: types,
        TypeVersions: typeVersions,
        Object: object,
        Assets: assets,
      },
      warnings: [],
    };
  }

  entryContext(slot: VirtualSlot) {
    if (slot.context !== this) {
      const slots = new Map<string, VirtualSlot>();
      const slotComponents = new Map<string, VirtualSlot>();
      const components = new Map<string, VirtualComponent>();
      const fields = new Map<string, VirtualField<FieldData>>();
      const componentTypes = new Map<string, number>();
      const refList: VirtualRef[] = [];
      const _warnings: string[] = [];

      const assetIds = this._assets.map((asset) => asset.id);
      this._assets = [
        ...this._assets,
        ...slot.context._assets.filter((asset) => !assetIds.includes(asset.id)),
      ];

      const modifyContext: ModifyContext = {
        context: this,
        setSlot: (id, slot) => slots.set(id, slot),
        setSlotComponents: (id, slot) => slotComponents.set(id, slot),
        setComponent: (id, component) => components.set(id, component),
        setField: (id, field) => fields.set(id, field),
        setComponentType: (type) => {
          const current = componentTypes.get(type) ?? 0;
          componentTypes.set(type, current + 1);
        },
        addRefList: (ref) => refList.push(ref),
        addWarning: (warnings) => warnings.push(...warnings),
      };

      slot.entryContext(modifyContext);
      this._assets.forEach((asset) => {
        asset.entryContext(modifyContext);
        Object.values(asset.data).forEach((field) => {
          field.entryContext(modifyContext);
        });
      });

      Object.entries(slots).forEach(([, slot]) => {
        slot.id = generateId();
        slot.componentsId = generateId();
      });
      Object.entries(components).forEach(([, component]) => {
        component.id = generateId();
      });

      refList.forEach((_ref) => {});

      slot.context._active = false;
    }
  }

  setRootObject(root: VirtualSlot) {
    if (root.context !== this) {
      this.entryContext(root);
    }
    this.object = root;
  }
}
