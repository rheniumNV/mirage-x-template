import { MirrorProps, unitConfig } from "./detail";

export const o = (props: MirrorProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></div>
  );
};

export const web = { [unitConfig.code]: o };
