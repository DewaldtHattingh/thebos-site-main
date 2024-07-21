import React, { useRef, useEffect, useState } from 'react';
import {Image} from '@shopify/hydrogen';

export function TestComponent({content}) {
  let why = [];
  content.forEach((item, index) => {
    why.push(item.fields);
  });

  const colourOne = useRef(null);
  const colourTwo = useRef(null);
  const colourThree = useRef(null);
  const colourFour = useRef(null);

  const [slideOne, setSlideOne] = useState('opacity-0');
  const [slideTwo, setSlideTwo] = useState('opacity-0');
  const [slideThree, setSlideThree] = useState('opacity-0');
  const [rock, setRock] = useState('opacity-0');
  const [rockmoved, setRockMoved] = useState(100); // Initialize rockmoved state with 0

  const [bgColour, setBgColour] = useState('bg-[#84824D]');

  useEffect(() => {
    const handleScroll = () => {
      if (
        colourOne.current &&
        colourTwo.current &&
        colourThree.current &&
        colourFour.current
      ) {
        const colourOneTrigger = colourOne.current.getBoundingClientRect();
        const colourTwoTrigger = colourTwo.current.getBoundingClientRect();
        const colourThreeTrigger = colourThree.current.getBoundingClientRect();
        const colourFourTrigger = colourFour.current.getBoundingClientRect();

        const rockmovement = colourOneTrigger.top;
        if (colourOneTrigger.top <= window.innerHeight / 2){
          setRock('opacity-100 -translate-y-10');
           setRockMoved(rockmovement + 5);
        }

        if (colourOneTrigger.top <= window.innerHeight) {
          setBgColour('bg-[#84824D]');
          setSlideOne('opacity-100 -translate-y-10');
          setSlideTwo('opacity-0 ');
          setSlideThree('opacity-0');
          
         
        }
        if (colourTwoTrigger.top <= 0) {
          setBgColour('bg-[#A78EB2]');
          setSlideTwo('opacity-100 -translate-y-10');
          setSlideThree('opacity-0');
          setSlideOne('opacity-0');
        }
        if (colourThreeTrigger.top <= 0) {
          setBgColour('bg-[#84824D]');
          setSlideThree('opacity-100 -translate-y-10');
          setSlideTwo('opacity-0');
          setSlideOne('opacity-0');
        }
        if (colourOneTrigger.top >= 0) {
          setBgColour('bg-[#84824D]');
          setSlideOne('opacity-0');
          setSlideTwo('opacity-0');
          setSlideThree('opacity-0');
          setRock('hidden');
        }
        if (colourFourTrigger.top <= 0) {
          setSlideThree('opacity-0 -translate-y-10');
          setRock('opacity-0 -translate-y-10');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToNext = () => {
    if (colourOne.current && colourTwo.current && colourThree.current) {
      const colourOneTrigger = colourOne.current.getBoundingClientRect();
      const colourTwoTrigger = colourTwo.current.getBoundingClientRect();
      const colourThreeTrigger = colourThree.current.getBoundingClientRect();

      if (colourOneTrigger.top <= 0) {
        colourTwo.current.scrollIntoView({ behavior: 'smooth' }) + 10;
      } 
    }
  };


const slideContentOne = why[0];
const slideContentTwo = why[1];
const slideContentThree = why[2];


// console.log(slideContentOne[1].value, slideContentOne[2].value);

  return (
    <div className={'flex flex-col relative transition-all duration-1000' + ' ' + bgColour}>
      <div class="glinda x">
  <div className="glinda y"> 
  <img className="grow" src="https://cdn.shopify.com/s/files/1/0719/4089/9080/files/rock.png" /> </div>
</div>
      {/* <div
        className={'fixed w-60  aspect-square transition-all duration-200 ease-linear ' + rock}
        style={{ left: `${rockmoved / 30 * -1}em`, bottom: `${rockmoved / 60 * -1}em` }}
      >

            <Image
              className=" object-fit"
              src={'https://cdn.shopify.com/s/files/1/0719/4089/9080/files/rock.png'}
              sizes="(min-width: 5em) 10vw, 50vw"
            />
      </div> */}
      <div className="flex items-center justify-center h-screen">
        <div ref={colourOne} className={'w-full h-full flex justify-center items-center'}>
          <div
            className={
              'fixed w-10/12 md:w-1/2 h-1/2  top-1/3 flex text-white justify-center flex-col text-center gap-2 items-center duration-500 transition-all' +
              ' ' +
              slideOne
            }
          >
            <div className="uppercase">Why Us</div>
            <h1 className='text-[20vh] leading-[20vh] uppercase'>{slideContentOne[2].value}</h1>
            <h3 className='text-xl'>{slideContentOne[1].value}</h3>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div ref={colourTwo} className={'w-full h-full flex justify-center items-center'}>
        <div
            className={
              'fixed w-10/12 md:w-1/2 h-1/2  top-1/3 flex text-white justify-center flex-col text-center gap-2 items-center duration-500 transition-all' +
              ' ' +
              slideTwo
            }
          >
            <div className="uppercase">Why Us</div>
            <h1 className='text-[20vh] leading-[20vh] uppercase'>{slideContentTwo[2].value}</h1>
            <h3 className='text-xl'>{slideContentTwo[1].value}</h3>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div ref={colourThree} className={'w-full h-full flex justify-center items-center'}>
        <div
            className={
              'fixed w-10/12 md:w-1/2 h-1/2  top-1/3 flex text-white justify-center flex-col text-center gap-2 items-center duration-500 transition-all' +
              ' ' +
              slideThree
            }
          >
            <div className="uppercase">Why Us</div>
            <h1 className='text-[20vh] leading-[20vh] uppercase'>{slideContentThree[2].value}</h1>
            <h3 className='text-xl'>{slideContentThree[1].value}</h3>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-[90vh]">
        <div ref={colourFour} className={'w-full h-full flex justify-center items-center'}></div>
      </div>
    </div>
  );
}
