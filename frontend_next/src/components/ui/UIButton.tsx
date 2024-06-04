import React, { ReactNode } from "react"
import { Button, ButtonProps } from "@nextui-org/button"

type UIButtonProps = {
  onClick: () => void
  children?: ReactNode
  color?: string
} & ButtonProps

const UIButton: React.FC<UIButtonProps> = ({
  onClick,
  color,
  children,
  ...props
}) => {
  return (
    <Button size="lg" color="primary" onClick={onClick} {...props}>
      {children}
    </Button>
  )
}

export default UIButton
