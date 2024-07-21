import React, { useState, useEffect, useRef } from 'react';

export function KeyFrameText({ content }) {
  function findValueByKey(array, key) {
    const foundItem = array.find(
      (item) => Object.prototype.hasOwnProperty.call(item, key)
    );
    return foundItem ? foundItem[key] : undefined;
  }

  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { current: container } = containerRef;
      if (!container) return;

      const { top, bottom } = container.getBoundingClientRect();
      const height = window.innerHeight;

      setIsInViewport(top < height / 1.5);
      setPrevScrollY(window.scrollY);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isInViewport) {
      setIsReadyToAnimate(true);
    }
  }, [isInViewport]);

  let hero_intro = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      hero_intro.push({ [item.key]: item.reference.image.url });
    } else {
      hero_intro.push({ [item.key]: item.value });
    }
  });

  const description = findValueByKey(hero_intro, 'description');
  const title = findValueByKey(hero_intro, 'title');
  const words = description.split(' ');

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > prevScrollY ? 'down' : 'up';
      if (isInViewport && isReadyToAnimate) adjustIndex(direction);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY, isInViewport, isReadyToAnimate]);

  const adjustIndex = (direction) => {
    if (direction === 'down') {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, words.length));
    } else if (direction === 'up') {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  return (
    <div className="w-full px-[42px] py-20 md:w-3/4 " ref={containerRef}>
      {/* <div className="pb-4 text-base font-thin text-white uppercase">
        {title}
      </div> */}
      <div className="flex flex-wrap gap-x-2">
        {words.map((word, index) => (
          <div
            key={index}
            className="text-5xl text-white"
            style={{
              opacity: (index < currentIndex ) ? 1 : 0.15,
              transition: 'opacity 0.5s', // Adjusted transition duration
            }}
          >
            {word} 
          </div>
        ))}
      </div>
    </div>
  );
}



export function KeyFrameText2({content}) {
  function findValueByKey(array, key) {
    const foundItem = array.find((item) =>
      Object.prototype.hasOwnProperty.call(item, key),
    );
    return foundItem ? foundItem[key] : undefined;
  }
  let hero_intro = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      hero_intro.push({[item.key]: item.reference.image.url});
    } else {
      hero_intro.push({[item.key]: item.value});
    }
  });

  const description = findValueByKey(hero_intro, 'description');
  const title = findValueByKey(hero_intro, 'title');
  const characters = description.split('');

  return (
    <div className="w-full h-1/2 px-[42px] ">
      {/* <div className="text-base font-thin uppercase text-[#636130] pb-4">
        {title}
      </div> */}
      {characters.map((char, index) => (
        <div
          key={index}
          className="text-3xl text-transparent character2" // Tailwind class for white text
          style={{animationDelay: `${index * 0.02}s`}}
        >
          {char}
        </div>
      ))}
    </div>
  );
}
