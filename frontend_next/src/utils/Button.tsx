// src/utils/Button.tsx
const Button = ({ title, color, size }: { title: string; color: string; size: string }) => {
  return (
    <button style={{
      backgroundColor: color,
      fontSize: size,
      borderRadius: '50px', // This makes the button oval
      padding: '10px 20px', // Adjust as needed
      margin: '10px', // This adds space around the button
      border: 'none', // Removes the default button border
      color: 'white' // Changes the button text color to white
    }}>
      {title}
    </button>
  );
}

export default Button;