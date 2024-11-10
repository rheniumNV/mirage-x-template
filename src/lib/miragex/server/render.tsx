import { useState, useEffect } from "react";
import { UnitChangeServerEvent } from "../common/unitChangeEvent";
import {
  Authentication,
  MainRootContextProvider,
  useResoniteUser,
} from "../main";
import { MainRootProps } from "../main/mainRootProps";

const Main = ({
  connectionId,
  ownerId,
  lang,
  eventEmitter,
  functionMap,
  propsSetterRegister,
  children,
  platformApiUrl,
  authentication,
}: {
  connectionId: string;
  ownerId: string;
  lang: string;
  eventEmitter: (event: UnitChangeServerEvent) => void;
  functionMap: Map<string, (v: unknown) => unknown>;
  propsSetterRegister: (setter: (props: MainRootProps) => void) => void;
  children: React.ReactNode;
  platformApiUrl: string;
  authentication?: Authentication;
}) => {
  const [mainRootProps, setMainRootProps] = useState<MainRootProps>({
    authentication,
    closed: false,
  });

  const userResponse = useResoniteUser(platformApiUrl, ownerId);

  useEffect(() => {
    propsSetterRegister(setMainRootProps);
  }, [propsSetterRegister]);

  return !mainRootProps.closed ? (
    <MainRootContextProvider
      value={{
        connectionId,
        ownerUser:
          userResponse.status === "success" ? userResponse.data : undefined,
        ownerId: ownerId,
        lang,
        eventEmitter,
        functionMap,
        authentication: mainRootProps.authentication,
      }}
    >
      {children}
    </MainRootContextProvider>
  ) : (
    <></>
  );
};

export const render = (App: () => JSX.Element) => {
  const DummyReactRenderer = (args: {
    connectionId: string;
    ownerId: string;
    lang: string;
    eventEmitter: (event: UnitChangeServerEvent) => void;
    functionMap: Map<string, (...args: unknown[]) => unknown>;
    propsSetterRegister: (setter: (props: MainRootProps) => void) => void;
    platformApiUrl: string;
    defaultAuthentication?: Authentication;
  }) => (
    <Main
      authentication={args.defaultAuthentication}
      connectionId={args.connectionId}
      eventEmitter={args.eventEmitter}
      functionMap={args.functionMap}
      lang={args.lang}
      ownerId={args.ownerId}
      platformApiUrl={args.platformApiUrl}
      propsSetterRegister={args.propsSetterRegister}
    >
      <App />
    </Main>
  );
  return DummyReactRenderer;
};
