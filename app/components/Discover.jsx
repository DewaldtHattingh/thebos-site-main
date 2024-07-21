import React from 'react';
import {Image} from '@shopify/hydrogen';
export function Discover({content}) {
  let discover = [];
  content.forEach((item, index) => {
    discover.push(item.fields);
  });
  return (
    <div className="flex justify-center w-full">
      <div className="w-full">
        {discover.map((item, index) => (
          <div key={index}>
            <div
              style={{
                backgroundColor: item.find((i) => i.key === 'background_color')
                  ?.value,
              }}
              className="grid w-full grid-cols-1 md:grid-cols-2"
            >
              <div
                className={
                  'flex flex-col items-center justify-center order-first w-full gap-10 aspect-square order-' +
                  item.find((i) => i.key === 'image-position')?.value
                }
              >
                <div
                  className="w-2/3 text-2xl text-center"
                  style={{
                    color: item.find((i) => i.key === 'text_color')?.value,
                  }}
                >
                  {item.find((i) => i.key === 'description')?.value}
                </div>
                <div
                  className="w-2/3 text-lg text-center underline uppercase"
                  style={{
                    color: item.find((i) => i.key === 'text_color')?.value,
                  }}
                >
                  {item.find((i) => i.key === 'button_text')?.value}
                </div>
              </div>
              <div className="relative flex items-center justify-center w-full aspect-square overflow-clip">
                <div className="font-thin text-white uppercase absolute top-[50%] z-10">
                  {item.find((i) => i.key === 'title')?.value}
                </div>
                <div className="absolute top-0 left-0 w-full aspect-square">
                  <Image
                    className="object-fit"
                    src={
                      item.find((i) => i.key === 'image')?.reference.image.url
                    }
                    sizes="(min-width: 45em) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
