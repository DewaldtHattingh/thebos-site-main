import React from 'react';
import {Image} from '@shopify/hydrogen';
export function Profiles({content}) {
  let profiles = [];
  content.forEach((item, index) => {
    profiles.push(item.fields);
  });
  // console.log(profiles);
  return (
    <div className="flex justify-center w-full py -4 md:py-10 text-[#636130]">
      <div className="grid w-full grid-cols-1 gap-4 p-4 md:w-10/12 md:grid-cols-2">
        {profiles.map((item) => (
          <div key={item} className="w-full">
            <div className="w-full">
              <div className="relative flex items-center justify-center w-full overflow-clip">
                <div className="flex flex-col w-full gap-4">
                  <Image
                    className="object-fit"
                    src={
                      item.find((i) => i.key === 'image')?.reference.image.url
                    }
                    sizes="(min-width: 45em) 100vw, 50vw"
                  />
                  <div className="text-2xl font-semibold uppercase ">
                    {item.find((i) => i.key === 'name')?.value}
                  </div>
                  <div className="text-base text-left ">
                    {item.find((i) => i.key === 'description')?.value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
