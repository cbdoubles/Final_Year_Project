// src/utils/Button.tsx
const Button = ({
  title,
  color,
  size
}: {
  title: string
  color: string
  size: string
}) => {
  return (
    <button
      style={{
        backgroundColor: color,
        fontSize: size
      }}
      className="rounded-full px-5 py-2 text-white"
    >
      {title}
    </button>
  )
}

export default Button
