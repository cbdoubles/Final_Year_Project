import React, { createContext, useContext, useMemo, useState } from "react"

type PropsContextType = {
  advancedMode: boolean
  setAdvancedMode: (advancedMode: boolean) => void
}

export const PropsContext = createContext<PropsContextType>({
  advancedMode: false,
  setAdvancedMode: () => {}
})

export const PropsProvider = ({ children }: { children: React.ReactNode }) => {
  const [advancedMode, setAdvancedMode] = useState(false)

  const obj = useMemo(
    () => ({
      advancedMode,
      setAdvancedMode
    }),
    [advancedMode]
  )

  return <PropsContext.Provider value={obj}>{children}</PropsContext.Provider>
}

export const useProps = () => useContext(PropsContext)
