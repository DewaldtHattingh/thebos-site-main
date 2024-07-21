import React, { useRef, useEffect, useState } from 'react';
import {Image} from '@shopify/hydrogen';


export function AboutFynbos({content}) {
  const [repeatedTitle, setRepeatedTitle] = useState('');

  function findValueByKey(array, key) {
    const foundItem = array.find((item) =>
      Object.prototype.hasOwnProperty.call(item, key),
    );
    return foundItem ? foundItem[key] : undefined;
  }
  let fynbos = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      fynbos.push({[item.key]: item.reference.image.url});
    } else {
      fynbos.push({[item.key]: item.value});
    }
  });

  const title = findValueByKey(fynbos, 'title');
  const subtitle = findValueByKey(fynbos, 'subtitle');
  const description = findValueByKey(fynbos, 'description');
  const image_one = findValueByKey(fynbos, 'image_one');
  const image_two = findValueByKey(fynbos, 'image_two');

  const imageOneRef = useRef(null);
  const imageTwoRef = useRef(null);
  const requestID = useRef(null);

  const parallaxScroll = () => {
    const scrollPosition = window.pageYOffset;
    
    // Reduced speed factors for a subtler effect
    const imageOneSpeed = 0.1;
    const imageTwoSpeed = 0.05;

    if (imageOneRef.current && imageTwoRef.current) {
      const imageOneTransform = scrollPosition * imageOneSpeed;
      const imageTwoTransform = scrollPosition * imageTwoSpeed;

      imageOneRef.current.style.transform = `translateY(${imageOneTransform}px)`;
      imageTwoRef.current.style.transform = `translateY(${imageTwoTransform}px)`;
    }

    requestID.current = requestAnimationFrame(parallaxScroll);
  };
  
  useEffect(() => {
    // Repeat the title to create a continuous scrolling effect
    const repeatCount = 100; // Adjust as needed for seamless looping
    setRepeatedTitle(Array(repeatCount).fill(title).join(' '));

    requestID.current = requestAnimationFrame(parallaxScroll);

    return () => {
      if (requestID.current) {
        cancelAnimationFrame(requestID.current);
      }
    };

  }, [title]);
  return (
    <>
  <div className="w-full overflow-hidden ">
        <h1 className="w-full mt-10 text-center marquee">
          <span className="marquee-title text-[22vw] md:text-[15vw] text-white leading-[20vw] md:leading-[20vw] lg:leading-[20vw] font-normal uppercase">
            {repeatedTitle}
          </span>
        </h1>
      </div>
      <div className="flex-row w-full text-white md:flex-col md:w-10/12">
        <div className="grid w-full grid-cols-1 gap-10 p-4 md:grid-cols-2">
          <div className="flex justify-center w-full text-xl md:text-3xl">
            <div className="w-full md:w-3/4">{subtitle}</div>
          </div>
          <div className="flex justify-center w-full text-base">
            <div className="w-full md:w-3/4">{description}</div>
          </div>
        </div>
        <div className="relative flex flex-row w-full gap-4 p-4 mt-4 md:p-8 md:h-[50vh] h-[40vh]">
        <div ref={imageOneRef} className="absolute -top-[30vh] w-1/2 md:w-1/3 left-4 md:flex">
            <Image
              className="object-fit"
              src={image_one}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
          </div>
          <div ref={imageTwoRef} className="absolute -top-[10vh] w-2/3 md:flex right-4">
            <Image
              className="object-fit"
              src={image_two}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}
