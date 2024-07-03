import { Button, ButtonProps } from "@nextui-org/button";
import React, { ReactNode } from "react";

export type UIButtonProps = {
  onClick?: () => void;
  children?: ReactNode;
  color?: string;
  collapsed?: boolean;
  name?: string;
} & ButtonProps;

/**
 * UIButton Component
 *
 * @description
 * This component renders a customizable button with optional text. The text is only displayed when the button is not collapsed.
 * The button uses the props from the NextUI Button component and adds additional props for handling click events, children elements,
 * color, collapsed state, and name.
 *
 * @props
 * @param {() => void} [onClick] - Optional click event handler.
 * @param {ReactNode} [children] - Optional child elements to be rendered inside the button.
 * @param {string} [color] - Optional color of the button.
 * @param {boolean} [collapsed] - Optional boolean to control if the button is collapsed.
 * @param {string} [name] - Optional name to be displayed when the button is not collapsed.
 */
const UIButton: React.FC<UIButtonProps> = ({
  onClick,
  children,
  name,
  collapsed,
  ...props
}) => {
  /**
   * Render the component
   *
   * @description
   * Renders a button with optional child elements and name text. The name text is only displayed when the button is not collapsed.
   * The button uses the NextUI Button component with additional props for customization.
   *
   * @returns {JSX.Element} The rendered button component.
   */
  return (
    <Button color="primary" size="lg" onClick={onClick} {...props}>
      {children}
      {!collapsed && (
        <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
          {name}
        </p>
      )}
    </Button>
  );
};

export default UIButton;
