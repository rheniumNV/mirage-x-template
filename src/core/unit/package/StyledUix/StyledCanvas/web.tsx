import { WebProps, unitConfig } from "./detail";

export const o = (props: WebProps) => {
  return <div>{props.children}</div>;
};

export const web = { [unitConfig.code]: o };
