import React, { useState } from "react";
import { VirtualUnit } from "../../common/types";
import { useWebsocket } from "./hooks/useWebsocket";
import * as Units from "./units";

const View = (props: { unit: VirtualUnit }) => {
  //@ts-ignore
  const Comp = Units[props.unit.code];
  if (Comp) {
    return (
      <Comp
        {...Object.keys(props.unit.props)
          .map((k) => [k, props.unit.props[k].value])
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})}
      >
        {props.unit.children.map((u) => View({ unit: u }))}
      </Comp>
    );
  } else {
    return <></>;
  }
};

export const App = () => {
  const [root, setRoot] = useState<VirtualUnit>();

  useWebsocket(
    `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/`,
    (rawEvent) => {
      console.log(rawEvent);
      try {
        const event = JSON.parse(rawEvent.data);
        console.log(event);
        switch (event.type) {
          case "update":
            setRoot(event.data);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }
  );

  return (
    <>
      <p>Hello World!</p>
      {root && <View unit={root} />}
    </>
  );
};
