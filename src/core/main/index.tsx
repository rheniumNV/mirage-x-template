import { MainRootContext } from "../../base/main";
import { UnitChangeEvent } from "../../base/common/unitChangeEvent";
import { App } from "./app";

export const Main = ({
  eventEmitter,
}: {
  eventEmitter: (event: UnitChangeEvent) => void;
}) => {
  return (
    <MainRootContext.Provider value={{ eventEmitter }}>
      <App />
    </MainRootContext.Provider>
  );
};
