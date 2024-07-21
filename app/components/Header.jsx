import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import {useRootLoaderData} from '~/root';
import {SoundToggle} from './SoundToggle';
import TheBos from '../../public/brand/TheBos.svg';

const soundUrl = '/audio/SoundWave.mp3';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, headerBg}) {
  const {shop, menu} = header;
  return (
  <header className={"sticky z-20 flex items-start justify-center w-full h-28 p-[42px] -top-0 " + ' ' + headerBg }>
      <div className="flex flex-row justify-between w-full">

        <div className="flex-row hidden md:flex md:w-1/3">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
          />
        </div>
        <div className="w-full md:w-1/3 ">
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            {/* <strong>{shop.name}</strong> */}
            <div className="flex justify-center h-20 -mt-8">
              <img
                src={TheBos}
                alt="Thebos Skin-care products"
                className="h-full"
              />
            </div>
          </NavLink>
        </div>
        <div className="flex justify-end md:w-1/3">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} viewport="mobile" />
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  isLoggedIn,
  cart,
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport} flex gap-4 md:gap-10 divide-y divide-white md:divide-transparent `;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between md:hidden">
        <HeaderCtasMobile
          isLoggedIn={isLoggedIn}
          cart={cart}
          viewport="mobile"
        />
      </div>
      <nav
        className={className + (viewport === 'desktop' ? ' mt-0' : 'mt-0')}
        role="navigation"
      >
        {/* {viewport === 'mobile' && (
          <NavLink
            end
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to="/"
          >
            Home
          </NavLink>
        )} */}
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className={
                ' overflow-hidden text-sm font-thin text-white uppercase relative hover:no-underline '
              }
              end
              key={item.id}
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              <div className="menu-links"> {item.title}</div>
             
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>;
 *  viewport: Viewport;}
 */
function HeaderCtas({isLoggedIn, cart, viewport}) {
  // console.log(viewport);
  return (
    <nav
    className="flex flex-row justify-end w-full"
    role="navigation"
  >
    {/* <div className="hidden h-10 aspect-video md:aspect-square md:flex ">
      <NavLink
        end
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}

        role="navigation"
      >
        <div className="h-10 sprite-sm sprite-1-1"></div>
      </NavLink>
    </div> */}
    {/* <div className="hidden h-10 aspect-video md:aspect-square tex-sm md:flex sprite-sm sprite-1-1">
      <SearchToggle />
    </div> */}
    {/* <div className="h-10 text-sm text-white ">
      
    </div> */}
    <HeaderMenuMobileToggle />
    <div className="flex flex-row items-start justify-center h-10 gap-4 md:flex">
  
      <div className="pl-4 text-sm text-white uppercase ">

        <div className="relative menu-links">Sound</div>
        
        </div>
      <SoundToggle soundUrl={soundUrl} />
       <CartToggle cart={cart} />
    </div>
    
  </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtasMobile({isLoggedIn, cart, viewport}) {
  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  return (
    <nav className="flex flex-row w-full gap-4 md:hidden" role="navigation">
      <div className="w-1/4 h-10 bg-[#79773a] text-white text-sm flex justify-center items-center md:hidden">
        <NavLink prefetch="intent" to="/account" onClick={closeAside}>
          {isLoggedIn ? 'Account' : 'Sign in'}
        </NavLink>
      </div>
      <div className="w-1/4 h-10 bg-[#79773a] text-white text-sm flex justify-center items-center  md:hidden">
        <SearchToggle />
      </div>
      <div className="w-1/4 bg-[#79773a] text-white text-sm flex justify-center items-start  md:hidden">
        <CartToggle cart={cart} />
      </div>
      <div className="w-1/4 h-10 bg-[#79773a] text-[#79773a] text-sm   md:hidden  flex justify-center items-center">
        <SoundToggle soundUrl={soundUrl} />
      </div>
      {/* <HeaderMenuMobileToggle /> */}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a
      className="h-10 rounded-full header-menu-mobile-toggle aspect-square"
      href="#mobile-menu-aside"
    >
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">
     <div className="h-10 sprite-sm sprite-1-1"></div>
  </a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return <a href="#cart-aside" className='relative text-white uppercase hover:no-underline'>
    <div className="menu-links">
         Cart {"( " + count + " )"}
    </div>
 
    </a>;
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 *   viewport: string;
 * }}
 */
function activeLinkStyle({isActive, isPending, viewport}) {
  return {
    fontWeight: isActive ? 'bold' : 'bold',
    color: isPending ? '#fff' : '#fff',
    // fontSize: isActive ? '1.2em' : '1.2em',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
