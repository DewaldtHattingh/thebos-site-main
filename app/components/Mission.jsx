import React, { useEffect, useRef } from 'react';
import {Image} from '@shopify/hydrogen';

export function Mission({content}) {
  const imageRef = useRef(null);
  function findValueByKey(array, key) {
    const foundItem = array.find((item) =>
      Object.prototype.hasOwnProperty.call(item, key),
    );
    return foundItem ? foundItem[key] : undefined;
  }
  let mission = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      mission.push({[item.key]: item.reference.image.url});
    } else {
      mission.push({[item.key]: item.value});
    }
  });

  const subtitle = findValueByKey(mission, 'subtitle');
  const description_one = findValueByKey(mission, 'description_one');
  const image = findValueByKey(mission, 'image');
  const description_two = findValueByKey(mission, 'description_two');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      if (imageRef.current) {
        const speed = 0.1; // Adjust this value for speed
        const transformValue = scrollPosition * speed;
        imageRef.current.style.transform = `translateY(${transformValue}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between w-3/4 h-[70vh] md:h-[screen] gap-10 md:aspect-video ">
      <div className="absolute w-full text-2xl text-center text-white uppercase md:text-3xl md:w-full md:top-10">
        {subtitle}
      </div>
      <div className=" absolute w-full md:w-full  text-center text-[#636130] top-28 text-xl md:text-2xl">
        {description_one}
      </div>
      <div ref={imageRef} className="absolute top-0 z-0 w-2/3 md:w-1/4">
        <Image className=" object-fit" src={image} sizes="50vw" />
      </div>
      <div className="absolute bottom-0 w-full text-xl text-center text-white md:text-3xl md:w-full md:bottom-10">
        {description_two}
      </div>
    </div>
  );
}
