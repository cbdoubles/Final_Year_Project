import React, { createContext, useContext, useMemo, useState } from "react";

type PropsContextType = {
  advancedMode: boolean;
  setAdvancedMode: (advancedMode: boolean) => void;
  queryRunClicked: boolean;
  setQueryRunTrue: () => void;
  setQueryRunFalse: () => void;
  resetProps: () => void;
};

export const PropsContext = createContext<PropsContextType>({
  advancedMode: false,
  setAdvancedMode: () => {},
  queryRunClicked: false,
  setQueryRunTrue: () => {},
  setQueryRunFalse: () => {},
  resetProps: () => {},
});

export const PropsProvider = ({ children }: { children: React.ReactNode }) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [queryRunClicked, setQueryRun] = useState(false);

  const setQueryRunTrue = () => setQueryRun(true);
  const setQueryRunFalse = () => setQueryRun(false);

  const resetProps = () => {
    setAdvancedMode(false);
    setQueryRun(false);
  };

  const value = useMemo(
    () => ({
      advancedMode,
      setAdvancedMode,
      queryRunClicked,
      setQueryRunTrue,
      setQueryRunFalse,
      resetProps,
    }),
    [advancedMode, queryRunClicked]
  );

  return (
    <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
  );
};

export const useProps = () => useContext(PropsContext);
