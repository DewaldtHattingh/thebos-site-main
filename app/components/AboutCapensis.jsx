import React, { useRef, useEffect, useState } from 'react';
import {Image} from '@shopify/hydrogen';

export function AboutCapensis({content}) {
  const [repeatedTitle, setRepeatedTitle] = useState('');
  function findValueByKey(array, key) {
    const foundItem = array.find((item) =>
      Object.prototype.hasOwnProperty.call(item, key),
    );
    return foundItem ? foundItem[key] : undefined;
  }
  let capensis = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      capensis.push({[item.key]: item.reference.image.url});
    } else {
      capensis.push({[item.key]: item.value});
    }
  });

  const title = findValueByKey(capensis, 'title');
  const subtitle = findValueByKey(capensis, 'subtitle');
  const description = findValueByKey(capensis, 'description');
  const content_text = findValueByKey(capensis, 'content');
  const button = findValueByKey(capensis, 'button');

    
  useEffect(() => {
    // Repeat the title to create a continuous scrolling effect
    const repeatCount = 100; // Adjust as needed for seamless looping
    setRepeatedTitle(Array(repeatCount).fill(title).join(' '));
  }, [title]);

  return (
    <>
      <div className="w-full mt-10 overflow-hidden">
      <h1 className="w-full text-center marquee">
          <span className="marquee-title text-[22vw] md:text-[15vw] text-white leading-[20vw] md:leading-[20vw] lg:leading-[20vw] font-normal uppercase">
            {repeatedTitle}
          </span>
        </h1>
      </div>
      <div className="mt-10 text-center text-white uppercase font-base">
        {subtitle}
      </div>
      <div className="flex-row w-full gap-20 text-white md:flex-col md:w-10/12">
        <div className="grid w-full grid-cols-1 gap-10 p-4 md:grid-cols-2">
          <div className="flex flex-col justify-center w-full gap-10 text-xl md:text-3xl md:flex-row">
            <div className="w-full md:w-3/4">{description}</div>
          </div>
          <div className="flex justify-center w-full text-base">
            <div className="w-full md:w-3/4">{content_text}</div>
          </div>
        </div>

      </div>
    </>
  );
}
