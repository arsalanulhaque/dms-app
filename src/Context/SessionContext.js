import { createContext } from "react";
const SessionContext = createContext({ session: { data: [] } })
export default SessionContext// = createContext({ session: { } })
// export const SessionContext = React.createContext({ session: {} });