import React, { createContext, useContext, useMemo, useState } from "react";

type PropsContextType = {
  advancedMode: boolean;
  setAdvancedMode: (advancedMode: boolean) => void;
  queryRunClicked: boolean;
  setQueryRunTrue: () => void;
  setQueryRunFalse: () => void;
};

export const PropsContext = createContext<PropsContextType>({
  advancedMode: false,
  setAdvancedMode: () => {},
  queryRunClicked: false,
  setQueryRunTrue: () => {},
  setQueryRunFalse: () => {},
});

export const PropsProvider = ({ children }: { children: React.ReactNode }) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [queryRunClicked, setQueryRun] = useState(false);

  const setQueryRunTrue = () => setQueryRun(true);
  const setQueryRunFalse = () => setQueryRun(false);

  const value = useMemo(
    () => ({
      advancedMode,
      setAdvancedMode,
      queryRunClicked,
      setQueryRunTrue,
      setQueryRunFalse,
    }),
    [advancedMode, queryRunClicked]
  );

  return (
    <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
  );
};

export const useProps = () => useContext(PropsContext);
