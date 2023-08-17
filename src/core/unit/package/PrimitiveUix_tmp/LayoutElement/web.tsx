import { WebProps, unitConfig } from "./detail";

export const o = (props: WebProps) => {
  return (
    <div
      style={{
        width: props.minHeight > 0 ? props.minHeight : undefined,
        height: props.minHeight > 0 ? props.minHeight : undefined,
      }}
    >
      {props.children}
    </div>
  );
};

export const web = { [unitConfig.code]: o };
