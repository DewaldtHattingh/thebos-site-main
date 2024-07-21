import {Await} from '@remix-run/react';
import {Suspense, useEffect, useState, useRef} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';

import {Header, HeaderMenu} from '~/components/Header';
import {SoundToggle} from '~/components/SoundToggle';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';


/**
 * @param {LayoutProps}
 */
export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  const scrollref = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState('translate-y-[0vh]');
  const [headerBg, setHeaderBg] = useState('bg-transparent');
  const [loader,setLoader] = useState(false);
  const [thebos,setThebos] = useState(false);


  useEffect(() => {

    const handleScroll = () => {
        // console.log(window.innerHeight);
        if (scrollref) {
          const scrolled = scrollref.current.getBoundingClientRect();
          if ((scrolled.top * -1)  >= window.innerHeight / 3 ) {
              setHeaderBg('bg-black/50 backdrop-blur-sm');
          } else {
            setHeaderBg('bg-transparent');
          }
        }
  
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTransitioning('translate-y-[100vh]');
    }, 3000); // 3 seconds

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoader(true);
      setThebos(true);
    }, 2000); // 3 seconds

    return () => clearTimeout(timeout);
  }, []); // Run effect only once on component mount
  return (
 <div className='relative' ref={scrollref}>
      <div className={"fixed top-0 left-0 z-50 w-full h-screen bg-[#636130] transition-transform duration-1000 ease-in-out flex flex-col justify-center items-center " + isTransitioning }>
        <div className="w-1/3 h-[9rem] overflow-hidden relative">
                  <h1 className={'text-white text-[8.5rem] absolute top-0 left-0 transition-transform duration-500' + ' ' + (thebos ? ' translate-y-0' : ' translate-y-[9rem] ' )}>THEBOS</h1>
        </div>

        <div className="w-1/3 h-[1px] bg-white/20">
        <div className={ ' h-full transition-all duration-1000 bg-white ease-in-out' +  ' ' + (loader ? 'w-full' : 'w-0')}></div>
        </div>
        
      </div>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} headerBg={headerBg} />

      <main>{children}</main>
      {/* <Suspense>
        <Await resolve={footer}>
          {(footer) => (
            <Footer menu={footer.menu1} menus={footer.menu2} shop={header.shop} />
          )}
        </Await>
      </Suspense> */}
    </div>
  );
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="flex flex-col w-full gap-4 predictive-search">
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div className="flex flex-col w-full gap-4">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                className="ring-1 border border-slate-300 ring-[#79773a] focus:ring-1 focus:ring-slate-300 focus:border focus:border-[#79773a]  "
              />

              {/* <button
                type="submit"
                className="w-full h-12 bg-[#79773a] rounded-full flex justify-center items-center text-[#79773a] "
              >
                Search
              </button> */}
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 * }}
 */
function MobileMenuAside({menu, shop}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: boolean;
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
