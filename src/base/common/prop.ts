export namespace MainProp {
  export type DvMode = "Field" | "Variable";
  export type Boolean = {
    type: "Boolean";
    main: boolean;
    mirror: boolean;
    neosDVType: string;
    dvMode: DvMode;
  };

  export type Float = {
    type: "Float";
    main: number;
    mirror: number;
    neosDVType: string;
    dvMode: DvMode;
  };
  export type Float2 = {
    type: "Float2";
    main: [number, number];
    mirror: [number, number];
    neosDVType: string;
    dvMode: DvMode;
  };
  export type Float3 = {
    type: "Float3";
    main: [number, number, number];
    mirror: [number, number, number];
    neosDVType: string;
    dvMode: DvMode;
  };
  export type FloatQ = {
    type: "FloatQ";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
    neosDVType: string;
    dvMode: DvMode;
  };

  export type String = {
    type: "String";
    main: string;
    mirror: string;
    neosDVType: string;
    dvMode: DvMode;
  };

  export type Function = {
    type: "Function";
    main: (...args: unknown[]) => unknown;
    mirror: string;
    neosDVType: string;
    dvMode: DvMode;
  };

  export type Color = {
    type: "Color";
    main: [number, number, number, number];
    mirror: [number, number, number, number];
    neosDVType: string;
    dvMode: DvMode;
  };

  export type Int = {
    type: "Int";
    main: number;
    mirror: number;
    neosDVType: string;
    dvMode: DvMode;
  };

  export type Base =
    | Boolean
    | Float
    | Float2
    | Float3
    | FloatQ
    | String
    | Function
    | Color
    | Int;
}
