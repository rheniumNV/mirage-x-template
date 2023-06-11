import { createContext } from "react";
import { UnitChangeEvent } from "../common/unitChangeEvent";

export const MainRootContext = createContext<{
  eventEmitter: (unitChangeEvent: UnitChangeEvent) => void;
} | null>(null);
