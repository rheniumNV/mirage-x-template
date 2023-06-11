import { useEffect, useRef, useState } from "react";
import { useWebsocket } from "./hooks/useWebsocket";
import { Units } from "../../core/unit/web";
import { WebRootContext } from "../../base/web";

type RendedUnit = {
  id: string;
  code?: string;
  props: {
    [key: string]: { type: string; value: unknown };
  };
  children: RendedUnit[];
};

const View = (props: { unit: RendedUnit }) => {
  //@ts-ignore
  const Comp = Units[props.unit.code];
  if (Comp) {
    return (
      <Comp
        {...Object.keys(props.unit.props)
          .map((k): [string, unknown] => [k, props.unit.props[k].value])
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
  const [root, setRoot] = useState<RendedUnit[]>();

  const ws = useWebsocket(
    `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/`,
    (rawEvent) => {
      try {
        const event = JSON.parse(rawEvent.data);
        switch (event.type) {
          case "update":
            setRoot(event.data);
            break;
          case "sync":
            console.log(event.data);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    }
  );

  const emitEvent = (id: string, args: unknown[]) => {
    ws.current?.send(
      JSON.stringify({ type: "interaction", data: { id, args } })
    );
  };

  return (
    <WebRootContext.Provider value={{ emitEvent }}>
      <p>Hello World!</p>
      {root && root.map((child) => <View unit={child} />)}
    </WebRootContext.Provider>
  );
};
