import React, {useEffect, useState, useRef} from 'react';
import {TypeTitle} from './TypeTitle';
// import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function HomeHero({content}) {
  // Find content values

 

  function findValueByKey(array, key) {
    const foundItem = array.find((item) =>
      Object.prototype.hasOwnProperty.call(item, key),
    );
    return foundItem ? foundItem[key] : undefined;
  }
  let hero = [];
  content.forEach((item, index) => {
    if (item.type === 'file_reference') {
      hero.push({[item.key]: item.reference.image.url});
    } else {
      hero.push({[item.key]: item.value});
    }
  });

  const title = findValueByKey(hero, 'title');
  const subtitle = findValueByKey(hero, 'subtitle');
  const image = findValueByKey(hero, 'image');
  const align = findValueByKey(hero, 'align');

  return (
    <>
      <div className="w-full h-screen overflow-hidden" >
       
        {image && (
          <>
            <Image
              className="absolute hidden object-cover h-screen md:block"
              src={image}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
            <Image
              className="absolute block object-cover h-screen md:hidden"
              src={image}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
          </>
        )}

        <div
          className={
            'w-full bg-transparent flex flex-row z-10 justify-end h-screen'
          }
        >
          
          {/* <div className="flex justify-center w-full text-base font-semibold text-left text-white uppercase">
            <div className="w-full">{subtitle}</div>
            
          </div> */}
          <TypeTitle
            text={title}
            typingSpeed={0}
            align={align.toLowerCase()}
            subtitle={subtitle}
          />
        </div>
      </div>
    </>
  );
}
