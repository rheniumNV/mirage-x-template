import { WebProps, unitConfig } from "./detail";

export const o = (props: WebProps) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: `rgba(${props.tint
          .map((c, i) => (c * (i < 4 ? 255 : 1)).toString())
          .join(",")})`,
      }}
    >
      {props.children}
    </div>
  );
};

export const web = { [unitConfig.code]: o };
