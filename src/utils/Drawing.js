import React, { forwardRef, useEffect } from 'react'
import CanvasDraw from "react-canvas-draw";

import { useState } from 'react';

 const Drawing = forwardRef((props, ref) => {
    // const drawBox = useRef();
  const [divWidth, setDivWidth] = useState(0);
  const [strokeColor, 
    // setStrokeColor
  ] = useState("#000");
  const [strokeWidth, 
    // setStrokeWidth
  ] = useState(1);
  // const [test, setTest] = useState("");

  // function clearSignature(){
  //   // setFieldValue('signature_file', null);
  //   // drawBox.current.clear();
  // }
  // const drawChanged = (e)=>{
  //   setTest(e.getDataURL());
  // };
  // const selectFile = (e)=>{
  //   const allCanvas = document.querySelectorAll('#myCanvas div canvas');
  //   const canvas = allCanvas[1];
  //   let context = canvas.getContext('2d');
  //   let base_image = new Image();
  //   base_image.src = URL.createObjectURL(e.target.files[0]);
  //   base_image.onload = function(){
  //   const ratio = base_image.naturalWidth / base_image.naturalHeight;
  //   const width = canvas.width;
  //   const height = width / ratio;
  //     context.drawImage(base_image, 0, 0, width, height);
  //   };       
  // };
  // const selectColor = (e)=>{
  //   setStrokeColor(e.target.value);
  // };
  // const selectStrokeWidth = (e)=>{
  //   setStrokeWidth(e.target.value);
  // };

  useEffect(() => {
    if(props?.parentId){
      let parentDiv = document.getElementById(props?.parentId);
      if(parentDiv){
        setDivWidth(parentDiv.clientWidth);
      }
    }
  },[]);

  const defaultProps = {
    ...props,
    // onChange: drawChanged,
    lazyRadius: 0,
    brushRadius: strokeWidth,
    brushColor: strokeColor,
    catenaryColor: strokeColor,
    hideGrid: true,
    canvasWidth:divWidth ? Number(divWidth):  600,
    canvasHeight:props.canvasHeight ?Number(props.canvasHeight): 200,
    saveData: null
  };
  return (
    <div>
      {/* <ul>
        <li>
          <label className='lbl' htmlFor='background-image'>Background Image</label>
          <input type='file' id='background-image' onChange={selectFile} accept='image/*'/>
        </li>
        <li>
          <label className='lbl' htmlFor='stroke-color'>Select Color</label>
          <input type='color' id='stroke-color' onChange={selectColor} value={strokeColor}/>
        </li>
        <li>
          <label className='lbl' htmlFor='stroke-width'>Select Width</label>
          <select onChange={selectStrokeWidth} value={strokeWidth}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
        </li>
        <li>
          <button type='button' onClick={()=>{
            let ddd = drawBox.current.getDataURL('image/png', false, '#FFFFFF');
            const a = document.createElement('a');
            a.href=ddd;
            a.download=true;
            a.click();
          }}>Save</button>
        </li>
        <li>
          <button type='button' onClick={()=>{
            const allCanvas = document.querySelectorAll('#myCanvas div canvas');
            const canvas = allCanvas[1];
            let context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.height, canvas.width);
          }}>Clear</button>
        </li>
      </ul> */}
      <div className='draw-box' id="myCanvas">
        <CanvasDraw 
        // imgSrc={image} 
        ref={ref} {...defaultProps} style={{border:'1px solid #ccc'}} />
        {/* {test? <img src={test}/> :null} */}
        
      </div>
    </div>
  )
});
export default Drawing;