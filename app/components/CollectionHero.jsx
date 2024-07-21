import React, {useEffect, useState, useRef} from 'react';
import {TypeTitle} from './TypeTitle';
// import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function CollectionHero({content}) {
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
      <div className=" fixed w-full h-[110vh] -top-10  -z-10">
        {image && (
          <>
            <Image
              className="absolute hidden object-cover h-[110vh] md:block"
              src={image}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
            <Image
              className="absolute block object-cover h-[110vh] md:hidden"
              src={image}
              sizes="(min-width: 45em) 100vw, 50vw"
            />
          </>
        )}

        <div
          className={
            'w-full  h-full bg-transparent flex flex-col p-4 absolute z-10 items-center justify-center mt-[20vh] gap-2 pb-10'
          }
        >
          <div className="flex justify-center w-full px-4 text-base font-semibold text-center text-white uppercase">
            <div className="w-full md:w-[85%] lg:w-[84%]">{subtitle}</div>
            
          </div>
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
