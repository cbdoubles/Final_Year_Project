import React, { ReactNode } from "react"
import { Button, ButtonProps } from "@nextui-org/button"

type UIButtonProps = {
  onClick?: () => void
  children?: ReactNode
  color?: string
  collapsed?:boolean
  name?: string
} & ButtonProps

const UIButton: React.FC<UIButtonProps> = ({
  onClick,
  color,
  children,
  name,
  collapsed,
  ...props
}) => {
  return (
    <Button size="lg" color="primary" onClick={onClick} {...props}>
      {children}
      {!collapsed && (
      <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
        {name}
      </p>
    )}
    </Button>
    
  )
}

export default UIButton
