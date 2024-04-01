import { useState, useEffect } from "react";
import { UnitChangeServerEvent } from "../common/unitChangeEvent";
import { MainRootContextProvider, useResoniteUser } from "../main";
import { MainRootProps } from "../main/mainRootProps";

const Main = ({
  connectionId,
  ownerId,
  lang,
  eventEmitter,
  functionMap,
  propsSetterRegister,
  children,
}: {
  connectionId: string;
  ownerId: string;
  lang: string;
  eventEmitter: (event: UnitChangeServerEvent) => void;
  functionMap: Map<string, (v: any) => any>;
  propsSetterRegister: (setter: (props: MainRootProps) => void) => void;
  children: React.ReactNode;
}) => {
  const [props, setProps] = useState<MainRootProps>({ closed: false });

  const userResponse = useResoniteUser(ownerId);

  useEffect(() => {
    propsSetterRegister(setProps);
  }, []);

  return !props.closed ? (
    <MainRootContextProvider
      value={{
        connectionId,
        ownerUser:
          userResponse.status === "success" ? userResponse.data : undefined,
        ownerId: ownerId,
        lang,
        eventEmitter,
        functionMap,
        authentication: props.authentication,
      }}
    >
      {children}
    </MainRootContextProvider>
  ) : (
    <></>
  );
};

export const render =
  (App: () => JSX.Element) =>
  (args: {
    connectionId: string;
    ownerId: string;
    lang: string;
    eventEmitter: (event: any) => void;
    functionMap: Map<string, (...args: any) => any>;
    propsSetterRegister: (setter: (props: any) => void) => void;
  }) =>
    (
      <Main
        connectionId={args.connectionId}
        ownerId={args.ownerId}
        lang={args.lang}
        eventEmitter={args.eventEmitter}
        functionMap={args.functionMap}
        propsSetterRegister={args.propsSetterRegister}
      >
        <App />
      </Main>
    );
