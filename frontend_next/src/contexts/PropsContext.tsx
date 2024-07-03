import React, { createContext, useContext, useMemo, useState } from "react";

type PropsContextType = {
  advancedMode: boolean;
  setAdvancedMode: (advancedMode: boolean) => void;
  queryRunClicked: boolean;
  setQueryRunTrue: () => void;
  setQueryRunFalse: () => void;
  resetProps: () => void;
};

/**
 * PropsContext
 *
 * @description
 * Context object to manage properties related to advanced mode and query run status.
 */
export const PropsContext = createContext<PropsContextType>({
  advancedMode: false,
  setAdvancedMode: () => {},
  queryRunClicked: false,
  setQueryRunTrue: () => {},
  setQueryRunFalse: () => {},
  resetProps: () => {},
});

/**
 * PropsProvider
 *
 * @description
 * Provider component that wraps the application with PropsContext, allowing components to
 * consume and update properties related to advanced mode and query run status using the useProps hook.
 *
 * @param {React.ReactNode} children - The child components wrapped by PropsProvider.
 */
export const PropsProvider = ({ children }: { children: React.ReactNode }) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [queryRunClicked, setQueryRun] = useState(false);

  /**
   * setQueryRunTrue
   *
   * @description
   * Function to set the queryRunClicked state to true.
   */
  const setQueryRunTrue = () => setQueryRun(true);

  /**
   * setQueryRunFalse
   *
   * @description
   * Function to set the queryRunClicked state to false.
   */
  const setQueryRunFalse = () => setQueryRun(false);

  /**
   * resetProps
   *
   * @description
   * Function to reset advancedMode and queryRunClicked to their default values.
   */
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

/**
 * useProps
 *
 * @description
 * Hook to consume the PropsContext values across components.
 *
 * @returns {PropsContextType} - Object containing advancedMode, setAdvancedMode, queryRunClicked,
 * setQueryRunTrue, setQueryRunFalse, and resetProps.
 */
export const useProps = () => useContext(PropsContext);
