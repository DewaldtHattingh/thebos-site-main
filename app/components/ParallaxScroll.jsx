import React, {useEffect, useState, useRef} from 'react';
import {TypeTitle} from './TypeTitle';
import {Link} from '@remix-run/react';

export function ParallaxScroll({content}) {
  // console.log(content.title);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffsetY(rect.top);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-transparent"
      ref={containerRef}
    >
      <div
        className={
          'w-full h-screen bg-transparent flex flex-col p-0 absolute  z-10 justify-end  gap-2 pb-20 md:pb-20 items-' +
          content.align
        }
      >
        <TypeWriterWhite
          text={content.title}
          typingSpeed={150}
          align={content.align}
          button={content.button}
          subtitle={content.subtitle}
          textalign={content.textalign}
        />
      </div>
      {content.parallax === true && (
        <div className="relative flex items-end justify-center h-full md:h-full ">
          <div
            className="bg-[#79773a]  z-0 w-full md:w-10/12 aspect-square md:aspect-[3/1] absolute  md:bottom-20"
            style={{transform: `translateY(-${offsetY * -0.3}px)`}}
          ></div>
        </div>
      )}
    </div>
  );
}
export function ParallaxScrollFromTop({content}) {
  // console.log(content.title);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementMiddleY = rect.top + rect.height / 2;

      // Calculate the offset based on the element's middle position relative to the viewport
      if (elementMiddleY < windowHeight) {
        setOffsetY((windowHeight - elementMiddleY) * 0.5);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="w-full aspect-[1/2]  bg-[#79773a]  relative overflow-hidden"
      ref={containerRef}
    >
      <div
        className={
          'w-full aspect-[1/2] bg-transparent flex flex-col p-4 absolute  z-10 justify-end  gap-2 pb-20 md:pb-20 items-' +
          content.align
        }
      >
        <TypeTitle
          text={content.title}
          typingSpeed={150}
          align={content.align}
          button={content.button}
          subtitle={content.subtitle}
          textalign={content.textalign}
        />
      </div>
      {content.parallax === true && (
        <div className="relative flex items-start justify-center h-full md:h-full ">
          <div
            className="absolute z-0 w-full bg-slate-100 md:w-2/3 aspect-square md:aspect-square top-4"
            style={{transform: `translateY(${offsetY}px)`}} // offsetY controls the parallax effect
          ></div>
        </div>
      )}
    </div>
  );
}
export function ParallaxScaleFromCenter({content}) {
  // console.log(content.title);
  const [offsetY, setOffsetY] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(0);
  const containerRef = useRef(null);
  const handleScroll = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTopY = rect.top;

      // Determine how much of the element is visible
      let visibleRatio = Math.max(
        0,
        Math.min(1, (windowHeight - elementTopY) / windowHeight),
      );

      // Update offsetY for parallax effect and set scaling factor
      setOffsetY((windowHeight - rect.top) * 0.5);
      setScaleFactor(visibleRatio); // scaleFactor state will be used to scale the width
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="w-full aspect-[1/2]  bg-[#79773a]  relative overflow-hidden"
      ref={containerRef}
    >
      <div
        className={
          'w-full aspect-[1/2] bg-transparent flex flex-col p-4 absolute  z-10 justify-end  gap-2 pb-20 md:pb-20 items-' +
          content.align
        }
      >
        <TypeWriterWhite
          text={content.title}
          typingSpeed={150}
          align={content.align}
          button={content.button}
          subtitle={content.subtitle}
          textalign={content.textalign}
        />
      </div>
      {content.parallax === true && (
        <div className="relative flex items-start justify-center h-full md:h-full ">
          <div
            className="absolute top-0 z-0 w-1/2 rounded-full bg-slate-100 md:w-2/3 aspect-square md:aspect-square"
            style={{
              transform: `translateY(${offsetY}px)`,
              width: `${scaleFactor * 130}%`, // Scale the width from 0 to 100%
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
export function ParallaxLeftRight({content}) {
  // console.log(content.title);
  const [leftPos, setLeftPos] = useState(-0); // Start off-screen to the left
  const [rightPos, setRightPos] = useState(0); // Start off-screen to the right
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTopY = rect.top;

      let visibleRatio = Math.max(
        0,
        Math.min(1, (windowHeight - elementTopY) / windowHeight),
      );

      setLeftPos(-100 + 100 * visibleRatio); // From -100% to 0%
      setRightPos(100 - 100 * visibleRatio); // From 100% to 0%
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // <div
    //   className="w-full aspect-[1/2]  bg-[#79773a]  relative overflow-hidden"
    //   ref={containerRef}
    // >
    //   <div
    //     className={
    //       'w-full aspect-[1/2] bg-transparent flex flex-col p-4 absolute  z-10 justify-end  gap-2 pb-20 md:pb-20 items-' +
    //       content.align
    //     }
    //   >
    //     <TypeWriterWhite
    //       text={content.title}
    //       typingSpeed={150}
    //       align={content.align}
    //       button={content.button}
    //       subtitle={content.subtitle}
    //       textalign={content.textalign}
    //     />
    //   </div>
    //   {content.parallax === true && (
    //     <div className="relative flex items-start justify-center h-full md:h-full ">
    //       <div
    //         className="absolute top-0 z-0 w-1/2 rounded-full bg-slate-100 md:w-2/3 aspect-square md:aspect-square"
    //         style={{
    //           transform: `translateY(${offsetY}px)`,
    //           width: `${scaleFactor * 130}%`, // Scale the width from 0 to 100%
    //         }}
    //       ></div>
    //     </div>
    //   )}
    // </div>
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      <div
        className="absolute bg-[#79773a] z-10 w-full h-[31%]"
        style={{left: `${leftPos}%`, top: '33%'}}
      >
        {/* Content for the left div */}
      </div>
 
      <div
        className="absolute bg-slate-100 z-20 w-full h-[31%]"
        style={{right: `${leftPos}%`, top: '0%'}}
      >
        {/* Content for the right div */}
      </div>
      <div
        className="absolute bg-slate-300 z-0 w-full h-[31%]"
        style={{right: `${leftPos}%`, top: '66%'}}
      >
        {/* Content for the right div */}
      </div>
    </div>

  );
}
