// src/utils/Button.tsx
const Button = ({
  title,
  color,
  size,
  onClick
}: {
  title: string
  color: string
  size: string
  onClick?: () => void
}) => {
  return (
    <button
      style={{
        backgroundColor: color,
        fontSize: size
      }}
      className="rounded-full px-5 py-2 text-white"
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default Button
