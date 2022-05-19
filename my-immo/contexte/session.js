import { createContext, useContext } from "react";

const SessionContext = createContext(null);

export default SessionContext;

export function useSession() {
  return useContext(SessionContext);
}
