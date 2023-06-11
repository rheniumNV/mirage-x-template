import { MirrorProps, unitConfig } from "./detail";

export const o = (props: MirrorProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>{props.content}</p>
    </div>
  );
};

export const web = { [unitConfig.code]: o };
