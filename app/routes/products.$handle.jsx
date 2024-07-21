import {Suspense, useState, useEffect} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import config from '~/components/config';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/utils';
import {Reviews} from '../components/Reviews';
// import {
//   ParallaxScrollFromTop,
//   ParallaxScaleFromCenter,
//   ParallaxLeftRight,
// } from '../components/ParallaxScroll';
// import {Faqs} from '~/components/Faqs';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Thebos | ${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const isAuthenticated = Boolean(customerAccessToken);
  // // const loginPath = locale ? `/${locale}/account/login` : '/account/login';
  // // const isAccountPage = /^\/account\/?$/.test(pathname);
  // let customer = {};
  // if (isAuthenticated) {
  //   customer = await getCustomer(context, customerAccessToken);
  // }
  // console.log(customer.data);
  console.log(isAuthenticated);

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search qu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ery params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants, isAuthenticated});
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {

  /** @type {LoaderReturnData} */
  const {product, variants, isAuthenticated} = useLoaderData();
  const {selectedVariant} = product;
  console.log(product.Subtitle.value);

  const [repeatedTitle, setRepeatedTitle] = useState('');
  const reviewtitle = "Reviews we love";
  useEffect(() => {
    // Repeat the title to create a continuous scrolling effect
    const repeatCount = 100; // Adjust as needed for seamless looping
    setRepeatedTitle(Array(repeatCount).fill(reviewtitle).join(' '));


  }, [reviewtitle]);
  return (
    <div className="flex items-center flex-col justify-center w-full md:mt-[15vh]">
      <div className="flex flex-col gap-4 product md:flex-row md:w-10/12">
        <div className="w-full p-4 md:w-3/5">
          <ProductImage image={selectedVariant?.image} />
        </div>
        <div className="w-full p-4 md:w-2/5 ">
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={variants}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      <div className="w-full overflow-hidden ">
        <h1 className="w-full mt-10 text-center marquee">
          <span className="marquee-title text-[22vw] md:text-[15vw] text-white leading-[20vw] md:leading-[20vw] lg:leading-[20vw] font-normal uppercase">
            {repeatedTitle}
          </span>
        </h1>
      </div>
      <div className="w-full p-4 md:w-10/12 mb-[20vh]">
            <Reviews isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}

/**
 * @param {{image: ProductVariantFragment['image']}}
 */
function ProductImage({image}) {
  if (!image) {
    return <div className="w-full product-image" />;
  }
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="w-full product-image aspect-square">
        <Image
          alt={image.altText || 'Product Image'}
          aspectRatio="1/1"
          data={image}
          key={image.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({selectedVariant, product, variants, isAuthenticated}) {
   // State for accordion sections
   const [isDescriptionOpen, setDescriptionOpen] = useState(false);
   const [isIngredientsOpen, setIngredientsOpen] = useState(false);
   const [isDirectionsOpen, setDirectionsOpen] = useState(false);
   const [isOriginsOpen, setOriginsOpen] = useState(false);
 
   // Toggle functions for accordions
   const toggleDescription = () => setDescriptionOpen(!isDescriptionOpen);
   const toggleIngredients = () => setIngredientsOpen(!isIngredientsOpen);
   const toggleDirections = () => setDirectionsOpen(!isDirectionsOpen);
   const toggleOrigins = () => setOriginsOpen(!isOriginsOpen);
   
  const {title, descriptionHtml} = product;
  return (
    <div className="flex flex-col w-full gap-2 product-main ">
      <h1>
        <span className="text-2xl font-bold text-white md:text-4xl">
          {title}
        </span>
      </h1>
      <div className="text-base font-light text-white uppercase">{product.Subtitle.value}</div>
      <ProductPrice selectedVariant={selectedVariant} />

      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
        {/* <div className="flex flex-col w-full gap-4 pt-6 divide-y divide-white">
          <div className="flex flex-col gap-4 pt-4 text-white ">
            <div className="text-xl font-semibold ">Description</div>
            <div className="text-base">{product.description}</div>
          </div>
          <div className="flex flex-col gap-4 pt-4 text-white ">
            <div className="text-xl font-semibold ">Ingredients</div>
            <div className="text-base">{product.description}</div>
          </div>
          <div className="flex flex-col gap-4 pt-4 text-white ">
            <div className="text-xl font-semibold ">Directions</div>
            <div className="text-base">{product.Directions.value}</div>
          </div>
          <div className="flex flex-col gap-4 pt-4 text-white ">
            <div className="text-xl font-semibold ">Origins</div>
            <div className="text-base">{product.Origin.value}</div>
          </div>
        </div> */}
        <div className="flex flex-col w-full gap-4 pt-6 divide-y divide-white">
        {/* Description Section */}
        <div className="flex flex-col gap-4 pt-4 text-white">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={toggleDescription}
          >
            Description
          </div>
          {isDescriptionOpen && (
            <div className="text-base">{product.description}</div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-4 text-white">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={toggleIngredients}
          >
            Ingredients
          </div>
          {isIngredientsOpen && (
            <div className="text-base">{product.description}</div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-4 text-white">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={toggleDirections}
          >
            Directions
          </div>
          {isDirectionsOpen && (
            <div className="text-base">{product.Directions.value}</div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-4 text-white">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={toggleOrigins}
          >
            Origins
          </div>
          {isOriginsOpen && (
            <div className="text-base">{product.Origin.value}</div>
          )}
        </div>
        </div>
      </Suspense>
  
    </div> 
   
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({selectedVariant}) {
  return (
    <div className="mt-2 product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? (
              <span>
                <Money data={selectedVariant.price} />
              </span>
            ) : null}
            <s>
              <span>
                <Money
                  data={selectedVariant.compareAtPrice}
                  className="text-white min-w-fit"
                />
              </span>
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && (
          <Money
            data={selectedVariant?.price}
            className="text-white"
          />
        )
      )}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({product, selectedVariant, variants}) {
  const [quantitySelector, setQuantitySelector] = useState(1)
  const decreaseQuantity = () => {
    if (quantitySelector > 1) {
      setQuantitySelector(quantitySelector - 1);
    }
  };
  const increaseQuantity = () => {
    setQuantitySelector(quantitySelector + 1);
  };
  return (
    <div className="pt-4 product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <div className="flex flex-row w-full h-12 gap-4">
        <div className="grid w-1/4 grid-cols-3 text-base font-semibold text-white border border-white">
          <div
            className="h-full col-span-1 leading-[3em] text-center cursor-pointer"
            onClick={decreaseQuantity}
          >
            -
          </div>
          <div className="h-full col-span-1 leading-[3em] text-center">
            {quantitySelector}
          </div>
          <div
            className="h-full col-span-1 leading-[3em] text-center cursor-pointer"
            onClick={increaseQuantity}
          >
            +
          </div>
        </div>
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          className='w-full'
          onClick={() => {
            window.location.href = window.location.href + '#cart-aside';
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: quantitySelector,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="flex flex-col gap-4 product-options" key={option.name}>
      <h5>
        <span className="pr-16 bg-slate-200 text-slate-200 min-w-fit">
          {option.name}
        </span>
      </h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item w-1/6 h-10 text-slate-200 bg-slate-200 text-[0px]"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive
                  ? '1px solid #94a3b8'
                  : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <div className="w-full border border-white ">
         <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="w-full h-12 leading-10 text-center text-white uppercase"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
    </div>
 
  );
}
const sectionContent = [
  {
    title: 'The Science Behind Thebos',
    parallax: true,
    // subtitle: 'lorem ipsum dolor sit amet, consectetur',
    align: 'center',
    textalign: 'center',
    button: 'View More',
  },
];

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;
const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      id
      defaultAddress {
        city
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;
export async function getCustomer(context, customerAccessToken) {
  const {storefront} = context;
  const data = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });
}

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    Subtitle: metafield(namespace: "custom", key: "subtitle") {
        value
      }
     Benefit: metafield(namespace: "custom", key: "benefit") {
        value
      }  
     Origin: metafield(namespace: "custom", key: "origin") {
        value
      }
      Ingredients: metafield(namespace: "custom", key: "ingredients") {
        value
      }  
     Directions: metafield(namespace: "custom", key: "directions") {
        value
      }

    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
