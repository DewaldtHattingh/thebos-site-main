import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="w-full flex justify-center">
      <div className="collections flex flex-col gap-4 w-full md:w-10/12">
        <div className="w-full h-12 text-2xl font-bold bg-slate-200 text-center text-slate-200 ">
          <h1 className="leading-[55px]">Collections</h1>
        </div>

        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <div className="">
              <div className="w-full h-12 bg-slate-200 text-slate-200 rounded-full justify-center items-center mb-4 hidden ">
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>Load previous</span>}
                </PreviousLink>
              </div>
              <CollectionsGrid collections={nodes} />

              <div className="w-full h-12 bg-slate-200 text-slate-200 rounded-full flex justify-center items-center ">
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more</span>}
                </NextLink>
              </div>
            </div>
          )}
        </Pagination>
      </div>
    </div>
  );
}

/**
 * @param {{collections: CollectionFragment[]}}
 */
function CollectionsGrid({collections}) {
  return (
    <div className="collections-grid flex flex-col gap-4 md:grid md:grid-cols-3">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  return (
    <Link
      className="collection-item flex flex-col gap-4"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="w-full aspect-square bg-slate-200"></div>
      {/* {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )} */}
      <div className="w-full ">
        <span className=" h-12 text-2xl font-bold bg-slate-200 text-left text-slate-200 ">
          {collection.title}
        </span>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
