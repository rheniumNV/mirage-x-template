import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { UnitChangeServerEvent } from "../common/unitChangeEvent";

export type Authentication = {
  token: string;
  clearAuth: () => Promise<void>;
};

type MainRootContextValue = {
  connectionId: string;
  ownerUser?: { id: string; username: string };
  ownerId: string;
  lang: string;
  eventEmitter: (unitChangeEvent: UnitChangeServerEvent) => void;
  functionMap: Map<string, (...args: any) => any>;
  authentication?: Authentication;
};

const MainRootContext = createContext<MainRootContextValue | null>(null);

export const MainRootContextProvider = (props: {
  value: MainRootContextValue;
  children: ReactNode;
}) => (
  <MainRootContext.Provider value={props.value}>
    {props.children}
  </MainRootContext.Provider>
);

export const useMainRootContext = () => {
  const context = useContext(MainRootContext);
  if (context === null) {
    throw new Error("MainRootContext is not provided");
  }
  return context;
};

type Response<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "loading";
    }
  | {
      status: "error";
      reason: "NotFound" | "Unknown";
    };

type ResoniteUser = {
  id: string;
  username: string;
  normalizedUsername: string;
  registrationDate: string;
  isVerified: boolean;
  isLocked: boolean;
  supressBanEvasion: boolean;
  "2fa_login": boolean;
  tags: string[];
  profile?: {
    iconUrl?: string;
  };
};

export const useResoniteUser = (userId: string) => {
  const [userResponse, setUserResponse] = useState<Response<ResoniteUser>>({
    status: "loading",
  });

  useEffect(() => {
    axios
      .get(`https://api.resonite.com/users/${userId}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            setUserResponse({
              status: "success",
              data: res.data,
            });
            break;
          case 404:
            setUserResponse({
              status: "error",
              reason: "NotFound",
            });
            break;
          default:
            setUserResponse({
              status: "error",
              reason: "Unknown",
            });
            break;
        }
      })
      .catch(() => setUserResponse({ status: "error", reason: "Unknown" }));
  }, [userId]);

  return userResponse;
};
