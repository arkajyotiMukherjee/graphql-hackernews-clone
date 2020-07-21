import React from "react";

/* for typescript 
type Action = {type: 'SET_NAME'} | {type: 'MAKE_PREMIUM'}
type Dispatch = (action: Action) => void
type State = {user: string}
type UserProvider = {children: React.ReactNode}

const UserStateContext = React.createContext<State | undefined>();
const UserDispatchContext = React.createContext<Dispatch | undefined>();
*/
const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

const initialState = {
  user: "Bob",
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_NAME": {
      return { user: action.payload };
    }
    case "MAKE_PREMIUM": {
      return { user: `${state.user} ❤️` };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined)
    throw new Error("useUserState must be within UserProvider");
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined)
    throw new Error("useUserDispatch must be within UserProvider");
  return context;
}

function useUser() {
  return [useUserState(), useUserDispatch()];
}

export { UserProvider, useUser };
