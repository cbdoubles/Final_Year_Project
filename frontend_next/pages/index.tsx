// pages/index.tsx
import React from 'react';
import Button from '../src/utils/Button';
import '../public/styles/style.css';
import Image from 'next/image';
import CapGemini from '../public/images/capgemini.png'; 

export default function home() {
  return (
    <div className= "centered-column">
      <Image src={CapGemini} alt="kur"/> /* move it outside of the divs, possibly define a style for the image itself, you can adjust the height and width as */
      <div className= "transparent-box">
      <Button title="Button 1" color="blue" size="70px" />
      <Button title="Button 2" color="red" size="70px" />
      </div>
    </div>
  );
}