import { Image } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { useRef, useState, useEffect } from 'react';

export function HomeProducts({ products }) {
  const [transitionImage, setTransitionImage] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [hoveredImageIndexLine, setHoveredImageIndexLine] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const containerRef = useRef(null);

  const extractData = (products) => {
    return products.edges.map((item) => {
      const node = item.node || {};
      return {
        title: node.title || '',
        handle: node.handle || '',
        image: node.images?.nodes[0]?.url || '',
        subtitle: node.metafield?.value || '',
        price: node.priceRange?.maxVariantPrice?.amount || '',
        currency: node.priceRange?.maxVariantPrice?.currencyCode || '',
      };
    });
  };

  const product = extractData(products);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Trigger when the container is halfway into or out of the viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Container is halfway into the viewport');
          setTransitionImage(true); // Set the state to trigger the transition
        } else {
          setTransitionImage(false); // Reset the state when leaving the viewport
        }
      });
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [product]);

  const handleMouseEnter = (index) => {
    setHoveredImageIndex(index);
    setHoveredImageIndexLine(index);
  };

  const handleMouseLeave = () => {
    setHoveredImageIndex(null);
    setHoveredImageIndexLine(null);
  };

  const handleButtonHover = () => {
    setButtonHovered(true);
  };

  const handleButtonLeave = () => {
    setButtonHovered(false);
  };

  return (
    <div className="relative flex flex-col w-full gap-10 mb-40">
      <div className="relative flex flex-col gap-[42px] px-[42px] md:flex-row md:justify-end " ref={containerRef}>
        {product.map((product, index) => (
          <div
            key={index}
            className="flex flex-col w-full gap-4 md:w-1/2 "
          >
            <Link
              className="product-item "
              key={product.handle}
              prefetch="intent"
              to={'products/' + product.handle}
            >
              <div className="relative w-full overflow-hidden" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                <Image
                  className={`object-fit`}
                  src={product.image}
                  sizes="(min-width: 45em) 100vw, 50vw"
                />
                <div className={"absolute top-0 w-full bg-[#84824D] transition-all ease-in-out delay-300 duration-1000 aspect-square transform " + (transitionImage ? 'translate-y-[70vh]' : 'translate-y-[0]')}></div>
              </div>
            </Link>
            <div className="relative flex flex-col w-full gap-3 pb-4 text-white">
              <div className="text-2xl font-light capitalize">
                <Link
                  className="text-3xl product-item"
                  key={product.handle}
                  prefetch="intent"
                  to={'products/' + product.handle}
                >
                  {product.title}
                </Link>
              </div>
              <div className="overflow-hidden text-base font-normal uppercase">
                <div className={`w-full transition-transform duration-500 ease-in-out transform ${index === hoveredImageIndex ? 'translate-y-0' : 'translate-y-10'}`}>{product.subtitle}</div>
              </div>
              <div className="absolute top-0 right-0 text-3xl font-thin uppercase">
                {product.price}
              </div>
              <div className="overflow-hidden text-base font-normal uppercase mt-[22px]">
                <div className={`w-full transition-transform duration-500 bg-white h-[1px] ease-in-out transform ${index === hoveredImageIndex ? 'translate-x-0' : '-translate-x-[100%]'}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute flex justify-end w-full -bottom-20 ">
            <button
        className="relative h-12 overflow-clip w-1/6  mx-[42px]  border border-white  text-right"
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}

      >
        <div className={"absolute top-0 left-0 w-full h-full text-white uppercase  transition-all duration-500 ease-in-out " + ( buttonHovered ? 'translate-y-16' : 'translate-y-0') }>
          <div className="flex items-center justify-start h-full px-4">SEE FULL RANGE</div>
         {/*  <div className="h-full col-span-1 "></div> */}
        </div>
        <div className={"absolute top-0 left-0 w-full h-full text-white uppercase  transition-all duration-500 ease-in-out " + ( buttonHovered ? 'translate-y-0' : '-translate-y-16') }>
         <div className="flex items-center justify-start h-full px-4">SEE FULL RANGE</div>
          {/*  <div className="h-full col-span-1 "></div> */}
        </div>
      </button>
      </div>
  
    </div>
)}
