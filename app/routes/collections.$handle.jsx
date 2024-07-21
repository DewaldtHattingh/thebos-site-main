import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/utils';
import {CollectionHero} from '~/components/CollectionHero';
import {KeyFrameText} from '../components/KeyFrameText';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });
  const collection_hero = await storefront.query(COLLECTION_HERO);
  const collection_intro = await storefront.query(COLLECTION_INTRO);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection, collection_hero, collection_intro});
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, collection_hero, collection_intro} = useLoaderData();

  return (
    <div className="flex flex-col justify-center w-full gap-10">  
    <div className="relative h-[83vh]">
        <CollectionHero content={collection_hero.metaobject.fields} />
      </div>
      <div className="flex flex-col items-center justify-center w-full py-10 bg-[#84824D]">
      <div className="w-full md:w-10/12">
          <KeyFrameText content={collection_intro.metaobject.fields} />
        </div>
        <div className="w-full collection md:w-10/12">
        <p className="collection-description ">
          <span className="w-auto leading-8 bg-slate-200 text-slate-200">
            {collection.description}
          </span>
        </p>
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <ProductsGrid products={nodes} />
              <br />

              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more </span>}
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
      </div>
      
    </div>
  );
}

/**
 * @param {{products: ProductItemFragment[]}}
 */
function ProductsGrid({products}) {
  return (
    <div className="grid grid-cols-1 p-4 md:grid-cols-2 products-grid ">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="w-full mb-2 bg-slate-200 aspect-square">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
      </div>
      <h4 className="py-1 text-2xl font-bold leading-10">
        <span className="text-white">{product.title}</span>
      </h4>
      <span>
        <Money
          data={product.priceRange.minVariantPrice}
          className="text-white w-2/5 text-xl first-letter:text-sm first-letter:pr-[2px] first-letter:leading-1 "
        />
      </span>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
   ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;
export const COLLECTION_HERO = `#graphql
query CollectionContent ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "collection-hero", type: "hero"}) {
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
          }
        }
      }
    }
  }
}
`;
export const COLLECTION_INTRO = `#graphql
query intro ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "collection-intro", type: "intro"}) {
    fields {
      key
      type
      value
    }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
