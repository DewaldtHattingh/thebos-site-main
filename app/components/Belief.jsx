
import {Image} from '@shopify/hydrogen';
import { useState, useEffect } from 'react';
export function Belief( {content}){

const [repeatedTitle, setRepeatedTitle] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => {
setIsModalOpen(true);
};

const closeModal = () => {
setIsModalOpen(false);
};
function findValueByKey(array, key) {
const foundItem = array.find((item) =>
          Object.prototype.hasOwnProperty.call(item, key),
);
return foundItem ? foundItem[key] : undefined;
}
let belief = [];
content.forEach((item, index) => {
if (item.type === 'file_reference') {
          belief.push({[item.key]: item.reference.image.url});
} else {
          belief.push({[item.key]: item.value});
}
});

const title = findValueByKey(belief, 'title');
const subtitle = findValueByKey(belief, 'intro');
const image_one = findValueByKey(belief, 'main_image');
const characters = subtitle.split('');

useEffect(() => {

const repeatCount = 100; // Adjust as needed for seamless looping
setRepeatedTitle(Array(repeatCount).fill(title).join(' '));
}, [title]);

return (
  <div className="w-full  bg-[#ECE9E4] flex flex-col items-center bg-center justify-center gap-20 md:gap-52 relative py-20">
<div className="absolute w-2/3 md:w-1/2 aspect-video top-[32vh] md:top-[38vh] z-10 ">
<Image
          className="cursor-pointer object-fit"
          src={image_one}
          sizes="(min-width: 45em) 100vw, 50vw"
          onClick={openModal}
/>
</div>
<div className="w-full h-40 p-4 text-center md:w-1/2">
{characters.map((char, index) => (
          <span
          key={index}
          className="text-2xl text-transparent md:text-4xl character2" // Tailwind class for white text
          style={{animationDelay: `${index * 0.02}s`}}
          >
          {char}
          </span>
))}
</div>
<div className="w-full ">
<div className="w-full overflow-hidden ">
          <h1 className="w-full text-center marquee">
          <span className="marquee-title text-[22vw] md:text-[15vw] text-[#636130] leading-[20vw] md:leading-[15vw] lg:leading-[15vw] font-normal uppercase">
          {repeatedTitle}
          </span>
          </h1>
</div>
</div>
<div className="grid w-full grid-cols-2 gap-4 p-4 md:flex md:flex-row md:h-40 md:w-10/12">
          {/* <div className="w-full bg-white md:w-1/4 aspect-video"></div>
          <div className="w-full bg-white md:w-1/4 aspect-video"></div>
          <div className="w-full bg-white md:w-1/4 aspect-video"></div>
          <div className="w-full bg-white md:w-1/4 aspect-video"></div> */}
</div>
{isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative">
          <div className="w-full overflow-hidden absolute top-[45vh] ">
                    <h1 className="w-full text-center marquee">
                    <span className="marquee-title text-[22vw] md:text-[15vw] text-white leading-[20vw] md:leading-[15vw] lg:leading-[15vw] font-normal uppercase">
                    {repeatedTitle}
                    </span>
          </h1>
</div>
            <img src={image_one} alt="Expanded" className="object-cover h-screen aspect-[16/9] md:aspect-video" />
            <button
              className="absolute w-10 text-black bg-white rounded-full top-5 right-5 md:top-10 md:right-10 aspect-square"
              onClick={closeModal}
            >
              X
            </button>
            
          </div>
        </div>
      )}
</div>
)
}