import { createContext } from "react";

export const WebRootContext = createContext<{
  emitEvent: (id: string, args: unknown[]) => unknown;
}>({ emitEvent: (id: string, args: unknown[]) => {} });
