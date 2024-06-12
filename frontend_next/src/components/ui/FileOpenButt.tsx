import React, { ReactNode, useRef, useState } from "react"
import { Button, ButtonProps } from "@nextui-org/button"
import { useRouter } from "next/router"

type UIButtonProps = {
  onClick?: () => void
  children?: ReactNode
  color?: string
  name?: string
} & ButtonProps

const UIButton: React.FC<UIButtonProps> = ({
  onClick,
  color,
  children, 
  name,
  ...props
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const router = useRouter();
  
    const handleButtonClick = () => {
        fileInputRef.current?.click();
      };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFileName(file.name);
      }
    };
  
    const handleSave = () => {
      // Implement the save functionality here
      console.log("File saved:", selectedFileName);
      router.push("/projectpage");
    };
  
  return (
      <>
        <Button size="lg" color="primary" onClick={handleButtonClick} {...props}>
         Save
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {selectedFileName && <UIButton onClick={handleSave}>Save</UIButton>}
      </>
    )
  }

export default UIButton

