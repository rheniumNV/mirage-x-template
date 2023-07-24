import { MainRootContext } from "../../base/main";
import { UnitChangeEvent } from "../../base/common/unitChangeEvent";
import { App } from "./samples/mineSweeper";

export const Main = ({
  eventEmitter,
  functionMap,
}: {
  eventEmitter: (event: UnitChangeEvent) => void;
  functionMap: Map<string, (v: any) => any>;
}) => {
  return (
    <MainRootContext.Provider value={{ eventEmitter, functionMap }}>
      <App />
    </MainRootContext.Provider>
  );
};
