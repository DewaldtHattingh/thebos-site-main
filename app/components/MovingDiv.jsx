import React, { useEffect, useRef } from 'react';

export function MovingDiv ({ className }) {
  const divRef = useRef(null);

  useEffect(() => {
    const animateDiv = () => {
      const newq = makeNewPosition();
      const { top, left } = divRef.current.getBoundingClientRect();

      const animateOptions = {
        top: newq[0] - top,
        left: newq[1] - left,
        duration: 5000,
        easing: 'linear',
        complete: () => animateDiv()
      };

      divRef.current.animate(animateOptions);
    };

    const makeNewPosition = () => {
      const h = window.innerHeight - 50;
      const w = window.innerWidth - 50;
      const nh = Math.floor(Math.random() * h);
      const nw = Math.floor(Math.random() * w);
      return [nh, nw];
    };

    animateDiv();

    return () => {
      divRef.current.getAnimations().forEach(animation => animation.cancel());
    };
  }, []);

  return <div ref={divRef} className={className} style={{ position: 'absolute' }} />;
};


