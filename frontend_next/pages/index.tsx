// pages/index.tsx
import React from 'react';
import Button from '../src/utils/Button';
import '../public/styles/style.css'; 

export default function home() {
  return (
    <div className= "centered-column">
      <Button title="Button 1" color="blue" size="70px" />
      <Button title="Button 2" color="red" size="70px" />
    </div>
  );
}