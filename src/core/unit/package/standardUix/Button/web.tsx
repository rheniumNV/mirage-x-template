import { useContext } from "react";
import { WebProps, unitConfig } from "./detail";
import { WebRootContext } from "../../../../../base/web";

export const o = (props: WebProps) => {
  const { emitEvent } = useContext(WebRootContext);

  return (
    <div
      onClick={() => {
        emitEvent(props.onClick, []);
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {props.children}
    </div>
  );
};

export const web = { [unitConfig.code]: o };
