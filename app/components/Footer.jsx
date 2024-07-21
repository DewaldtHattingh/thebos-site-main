import {NavLink} from '@remix-run/react';
import {useRootLoaderData} from '~/root';
import {NewsLetter} from '~/components/NewsLetter';
import { useState } from 'react';

/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */
export function Footer({menu, shop, menus}) {
  
  const [newsLetter, setNewsLetter] = useState('translate-y-[100vh]');

  function ClickHandler() {
  setNewsLetter('translate-y-0 ');
  }
  return (
    <footer className="flex items-center justify-center w-full py-10 footer">
      <div className="flex flex-row w-full p-4 md:w-full md:flex-row md:gap-20 md:justify-between">
      <div className="flex flex-col gap-4 md:w-1/5">
        <div className="text-base text-white uppercase">Sign up for our newsletter & get 15% off</div>
        <div className="w-full ">
          <div className="w-full h-10 ">
                    <button
          onClick={ClickHandler}
          className="flex items-center justify-center w-full text-base bg-[#79773a] font-semibold border-b border-white uppercase text-white h-12"
        >
          <span>Subscribe</span>
        </button>
        </div>
      

        <NewsLetter newsLetter={newsLetter} setNewsLetter={setNewsLetter} />
        </div>
      </div>
      <FooterMenu menu={menu} menus={menus} primaryDomainUrl={shop.primaryDomain.url} />
      </div>
   
    </footer>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 * }}
 */
function FooterMenu({menu, menus, primaryDomainUrl}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <nav className="flex flex-col items-start w-full gap-3 md:w-1/2 md:flex-col footer-menu" role="navigation">
      <div className="flex flex-row justify-end w-full gap-5 ">
         {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
            className="hover:no-underline"
          >
                 <div className="relative">
               <div className="leading-10 menu-links ">
               {item.title}
            </div> 
            </div>
          </NavLink>
        );
      })}
      </div>
      <div className="flex flex-row justify-end w-full gap-5 ">
         {(menus || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
            className="hover:no-underline"
          >
            <div className="relative">
               <div className="leading-10 menu-links">
               {item.title}
            </div> 
            </div>
          
           
          </NavLink>
        );
      })}
      </div>
     
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
