import { WebProps, unitConfig } from "./detail";

export const o = (props: WebProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        gap: props.spacing,
        paddingTop: props.paddingTop,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        paddingBottom: props.paddingBottom,
      }}
    >
      {props.children}
    </div>
  );
};

export const web = { [unitConfig.code]: o };
