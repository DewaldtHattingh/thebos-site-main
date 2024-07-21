import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/utils';

/**
 * @param {CartMainProps}
 */
export function CartMain({layout, cart}) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

/**
 * @param {CartMainProps}
 */
function CartDetails({layout, cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   lines: CartApiQueryFragment['lines'] | undefined;
 * }}
 */
function CartLines({lines, layout}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines ">
      <ul className="flex flex-col gap-4 divide-y divide-[#79773a] -mt-4">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   line: CartLine;
 * }}
 */
function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="gap-4 pt-4 pb-0 cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          width={100}
          loading="lazy"
        />
      )}

      <div className="flex flex-col items-start justify-start w-full gap-3">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <div className=" text-white text-xl h-5 mb-0.5 ">
            {product.title}
          </div>
        </Link>
        <CartLinePrice
          line={line}
          as="span"
          className="text-white "
        />
        {/* <ul className="flex flex-row gap-2 mb-0 -mt-1 -ml-2 ">
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <small>
                <span className="ml-2 text-sm text-white ">
                  {option.name}: {option.value}
                </span>
              </small>
            </li>
          ))}
        </ul> */}
        <div className="flex flex-row justify-between w-full">
          <CartLineQuantity line={line} as="span" />
          <div className="flex flex-row items-center justify-end w-20 gap-2">
            <div className="h-5 w-5 bg-[#79773a] rounded-full"></div>
            <div className="h-5 w-5 bg-[#79773a] rounded-full">
              <CartLineRemoveButton lineIds={[id]} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * @param {{checkoutUrl: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="w-full h-12 text-white uppercase text-center text-base border border-white leading-[44px]">
      <a href={checkoutUrl} target="_self">
        Checkout
      </a>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   children?: React.ReactNode;
 *   cost: CartApiQueryFragment['cost'];
 *   layout: CartMainProps['layout'];
 * }}
 */
export function CartSummary({cost, layout, children = null}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div
      aria-labelledby="cart-summary"
      className={className + ' flex flex-col justify-between gap-4 '}
    >
      <div className="flex flex-row justify-between w-full">
            <div className="h-8 text-2xl font-bold text-left text-white ">Subtotals</div>  
            <div className="flex flex-row justify-end gap-2 text-2xl text-right text-white cart-subtotal">
        <div>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </div>
      </div>
 
      </div>
       <div className="w-full text-base text-left text-white">
      Tax included and shipping calculated at checkout
      </div>

    
      {children}
    </div>
  );
}

/**
 * @param {{lineIds: string[]}}
 */
function CartLineRemoveButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit" className="w-5 h-5 rounded-full"></button>
    </CartForm>
  );
}

/**
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex flex-row items-start gap-2 leading-7 border border-white cart-line-quantity">
      {/* <small>Quantity: {quantity} &nbsp;&nbsp;</small> */}
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className="w-5 h-5 text-sm text-white rounded-full "
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      <div className="w-5 h-5 text-sm leading-7 text-center text-white">
        {quantity}
      </div>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="w-5 h-5 text-sm text-center text-white rounded-full "
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
  
      {/* <CartLineRemoveButton lineIds={[lineId]} /> */}
    </div>
  );
}

/**
 * @param {{
 *   line: CartLine;
 *   priceType?: 'regular' | 'compareAt';
 *   [key: string]: any;
 * }}
 */
function CartLinePrice({line, priceType = 'regular', ...passthroughProps}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
export function CartEmpty({hidden = false, layout = 'aside'}) {
  return (
    <div hidden={hidden}>
      <br />
      <div className="w-full">
        <span className="leading-7 text-white ">
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </span>
      </div>

      <br />
      <div className="flex justify-center w-full h-12 items center">
        <Link
          to="/collections"
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = '/collections';
            }
          }}
          className="w-full h-12 bg-[#79773a] text-[#79773a] rounded-full text-center mt-3"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="w-full">
      {/* Show an input to apply a discount */}
      <div className="flex flex-row w-full gap-4">
        {/* <div className="w-full h-12 "></div>
        <div className="bg-[#79773a] w-full h-12 text-white rounded-full"></div> */}
        {/* <UpdateDiscountForm discountCodes={codes}>
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
        
          />

          <button
            type="submit"
            className="w-1/3 h-full text-white rounded-full"
          >
            Apply
          </button>
        </UpdateDiscountForm> */}
      </div>
      {/* Have existing discount, display it with a remove option */}
      <div hidden={!codes.length} className='hidden'>
        <div>
          <div>Discount(s)</div>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button className="w-full h-12 bg-[#79773a] text-white rounded-full">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      className="hidden"
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      className="hidden w-full"
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/** @typedef {CartApiQueryFragment['lines']['nodes'][0]} CartLine */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: 'page' | 'aside';
 * }} CartMainProps
 */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
