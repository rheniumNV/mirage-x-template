export type Value = string | number | boolean | null;

export type Obj =
  | {
      [key: string]: Value | Obj;
    }
  | (Value | Obj)[];

export type ObjectList<D extends Value | Obj> = ObjectField<D>[];

export type ObjectField<D extends ObjectList<Value | Obj> | Value | Obj> = {
  ID: string;
  Data: D;
};

export type ObjectSlot = {
  ID: string;
  "Persistent-ID": string;
  Name: ObjectField<string | null>;
  Tag: ObjectField<string | null>;
  Active: ObjectField<boolean>;
  Position: ObjectField<[number, number, number]>;
  Rotation: ObjectField<[number, number, number, number]>;
  Scale: ObjectField<[number, number, number]>;
  OrderOffset: ObjectField<number>;
  ParentReference: string;
  Components: {
    ID: string;
    Data: ObjectComponent[];
  };
  Children: ObjectSlot[];
};

export type ObjectComponent = {
  Type: number;
  Data: {
    ID: string;
    "persistent-ID": string;
  } & {
    [K in `${string | never}${
      | "a"
      | "b"
      | "c"
      | "d"
      | "e"
      | "f"
      | "g"
      | "h"
      | "i"
      | "j"
      | "k"
      | "l"
      | "m"
      | "n"
      | "o"
      | "p"
      | "q"
      | "r"
      | "s"
      | "t"
      | "u"
      | "v"
      | "w"
      | "x"
      | "y"
      | "z"
      | "A"
      | "B"}`]: ObjectField<Value | Obj>;
  };
};

export type ObjectContext = {
  VersionNumber: string;
  FeatureFlags: { [key: string]: number };
  Types: string[];
  TypeVersions: { [key: string]: number };
  Object: ObjectSlot;
  Assets?: ObjectComponent[];
};
