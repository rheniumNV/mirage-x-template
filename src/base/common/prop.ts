export namespace MainProp {
  export type DvMode = "Field" | "Variable";

  type Common = {
    neosDVType: string;
    dvMode: DvMode;
    enumType?: string;
    enumKeys?: string[];
  };

  export type Boolean = Common & {
    type: "Boolean";
    main: boolean;
    mirror: boolean;
  };

  export type Float = Common & {
    type: "Float";
    main: number;
    mirror: number;
  };
  export type Float2 = Common & {
    type: "Float2";
    main: [number, number];
    mirror: [number, number];
  };
  export type Float3 = Common & {
    type: "Float3";
    main: [number, number, number];
    mirror: [number, number, number];
  };
  export type Float4 = Common & {
    type: "Float4";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
  };
  export type FloatQ = Common & {
    type: "FloatQ";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
  };
  export type Rect = Common & {
    type: "Rect";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
  };

  export type String = Common & {
    type: "String";
    main: string;
    mirror: string;
  };

  export type Uri = Common & {
    type: "Uri";
    main: string;
    mirror: string;
  };

  export type Enum<T extends string> = Common & {
    type: "Enum";
    main: T;
    mirror: number;
    enumType: string;
    enumKeys: T[];
  };

  export type Function = Common & {
    type: "Function";
    main: (...args: any[]) => any;
    mirror: string;
  };

  export type Color = Common & {
    type: "Color";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
  };

  export type Int = Common & {
    type: "Int";
    main: number;
    mirror: number;
  };

  export type Base =
    | Boolean
    | Float
    | Float2
    | Float3
    | Float4
    | FloatQ
    | Rect
    | String
    | Function
    | Color
    | Int
    | Uri
    | Enum<string>;
}
