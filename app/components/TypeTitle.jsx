import React, { useState, useEffect } from 'react';

export function TypeTitle({ text, typingSpeed = 400, align, subtitle }) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [gridCols, setGridCols] = useState(text.length + 1);
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [subtitles, setSubtitles] = useState(false);

  useEffect(() => {
    const windowWidth = window.innerWidth; // Get the current window width
    const length = text.length;

    // Calculate font size based on window width and text length
    const calculatedFontSize = Math.round(windowWidth / length) * 1.66;
    setFontSize(calculatedFontSize); // Update font size state

    const delayTimeout = setTimeout(() => {
          setSubtitles(true)
      const interval = setInterval(() => {
        setVisibleCharacters(prevCount =>
          prevCount < text.length ? prevCount + 1 : prevCount
        );
      }, typingSpeed);
  
      return () => clearInterval(interval);
    }, 3500); // Delay before starting typing

    return () => clearTimeout(delayTimeout);
  }, [text, typingSpeed]);

  return (
    <div className={'flex h-screen w-full items-end justify-center relative'}>
      <div className="absolute flex flex-col w-full bottom-0  px-[42px] overflow-hidden ">
        <div className="relative w-full h-10 overflow-hidden text-xl ">
        <div className={"absolute top-0 transition-transform duration-300 uppercase text-white " + (subtitles ? ' translate-y-0' : '-translate-y-20') }>{subtitle}</div>
        </div>
        <div className="flex flex-row w-full h-full uppercase leading-0" style={{ fontSize: `${fontSize}px` }}>
        {text.split("").map((char, index) => (
          <div className="w-full text-white transition-transform ease-in-out " key={index} style={{ transition: `transform 1s ${index * 100}ms`, transform: visibleCharacters > index ? 'translateY(2vh)' : 'translateY(200vh)' }}>
            <h1 className="bg-clip-text">{char}</h1>
          </div>
        ))}
        </div>
      </div>


      {/* <div className={"absolute top-20 px-2 md:px-[42px] w-full bg-black  overflow-hidden  leading-0 uppercase gap-0 text-center  pt-0"} style={{ fontSize: `${fontSize}px` }}>
      <div className="relative top-0 w-11/12 h-10 bg-red-600">
      <div className={"absolute top-0 transition-transform duration-300 " + (subtitles ? ' translate-y-0' : 'translate-y-20') }>{subtitle}</div>
      </div>
      
      </div> */}
    </div>
  );
}
