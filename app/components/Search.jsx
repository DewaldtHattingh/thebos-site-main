import {Link, Form, useParams, useFetcher, useFetchers} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';

export const NO_PREDICTIVE_SEARCH_RESULTS = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
  {type: 'collections', items: []},
  {type: 'pages', items: []},
  {type: 'articles', items: []},
];

/**
 * @param {{searchTerm: string}}
 */
export function SearchForm({searchTerm}) {
  const inputRef = useRef(null);

  // focus the input when cmd+k is pressed
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Form method="get" className="w-full flex flex-row gap-2">
      <input
        defaultValue={searchTerm}
        name="q"
        placeholder="Search…"
        ref={inputRef}
        type="search"
        className="w-3/4 border ring-1  border-slate-300 ring-[#79773a] focus:ring-1 -z-0 focus:ring-slate-300 focus:border focus:border-[#79773a]"
      />
      <button
        type="submit"
        className="w-1/4 h-10 bg-[#79773a] rounded-full flex justify-center items-center  right-0 top-[px]"
      ></button>
    </Form>
  );
}

/**
 * @param {Pick<FetchSearchResultsReturn['searchResults'], 'results'>}
 */
export function SearchResults({results}) {
  if (!results) {
    return null;
  }
  const keys = Object.keys(results);
  return (
    <div className=" flex flex-col gap-4 divide-y divide-[#79773a] mb-4 ">
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];

          if (resourceResults.nodes[0]?.__typename === 'Page') {
            const pageResults = resourceResults;
            return resourceResults.nodes.length ? (
              <SearchResultPageGrid key="pages" pages={pageResults} />
            ) : null;
          }

          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults;
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
              />
            ) : null;
          }

          if (resourceResults.nodes[0]?.__typename === 'Article') {
            const articleResults = resourceResults;
            return resourceResults.nodes.length ? (
              <SearchResultArticleGrid
                key="articles"
                articles={articleResults}
              />
            ) : null;
          }

          return null;
        })}
    </div>
  );
}

/**
 * @param {Pick<SearchQuery, 'products'>}
 */
function SearchResultsProductsGrid({products}) {
  return (
    <div className="search-result flex flex-col gap-4 pt-4">
      <div className="bg-[#79773a] h-10 text-[#79773a] text-lg font-semibold">
        <h2>Products</h2>
      </div>

      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const itemsMarkup = nodes.map((product) => (
            <div className="search-results-item" key={product.id}>
              <span className="bg-[#79773a] text-[#79773a]">
                <Link prefetch="intent" to={`/products/${product.handle}`}>
                  <span>{product.title}</span>
                </Link>
              </span>
            </div>
          ));
          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                {itemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>

    </div>
  );
}

/**
 * @param {Pick<SearchQuery, 'pages'>}
 */
function SearchResultPageGrid({pages}) {
  return (
    <div className="search-result flex flex-col gap-4 pt-4">
      <div className="bg-[#79773a] h-10 text-[#79773a] text-lg font-semibold">
        <h2>Pages</h2>
      </div>
      <div>
        {pages?.nodes?.map((page) => (
          <div className="search-results-item" key={page.id}>
            <span className="bg-[#79773a] text-[#79773a]">
              <Link prefetch="intent" to={`/pages/${page.handle}`}>
                {page.title}
              </Link>
            </span>
          </div>
        ))}
      </div>
   
    </div>
  );
}

/**
 * @param {Pick<SearchQuery, 'articles'>}
 */
function SearchResultArticleGrid({articles}) {
  return (
    <div className="search-result flex flex-col gap-4 pt-4 ">
      <div className="bg-[#79773a] h-10 text-[#79773a] text-lg font-semibold">
        <h2>Articles</h2>
      </div>
      <div>
        {articles?.nodes?.map((article) => (
          <div className="search-results-item" key={article.id}>
            <span className="bg-[#79773a] text-[#79773a]">
              <Link prefetch="intent" to={`/blog/${article.handle}`}>
                {article.title}
              </Link>
            </span>
          </div>
        ))}
      </div>
     
    </div>
  );
}

export function NoSearchResults() {
  return (
    <span className="bg-[#79773a] text-[#79773a]">
      No results, try a different search.
    </span>
  );
}

/**
 *  Search form component that posts search requests to the `/search` route
 * @param {SearchFromProps}
 */
export function PredictiveSearchForm({
  action,
  children,
  className = 'predictive-search-form',
  method = 'POST',
  ...props
}) {
  const params = useParams();
  const fetcher = useFetcher();
  const inputRef = useRef(null);

  function fetchResults(event) {
    const searchAction = action ?? '/api/predictive-search';
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    const newSearchTerm = event.target.value || '';
    fetcher.submit(
      {q: newSearchTerm, limit: '6'},
      {method, action: localizedAction},
    );
  }

  // ensure the passed input has a type of search, because SearchResults
  // will select the element based on the input
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  return (
    <fetcher.Form
      {...props}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!inputRef?.current || inputRef.current.value === '') {
          return;
        }
        inputRef.current.blur();
      }}
    >
      {children({fetchResults, inputRef, fetcher})}
    </fetcher.Form>
  );
}

export function PredictiveSearchResults() {
  const {results, totalResults, searchInputRef, searchTerm} =
    usePredictiveSearch();

  function goToSearchResult(event) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur();
    searchInputRef.current.value = '';
    // close the aside
    window.location.href = event.currentTarget.href;
  }

  if (!totalResults) {
    return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  }
  return (
    <div className="predictive-search-results">
      <div>
        {results.map(({type, items}) => (
          <PredictiveSearchResult
            goToSearchResult={goToSearchResult}
            items={items}
            key={type}
            searchTerm={searchTerm}
            type={type}
          />
        ))}
      </div>
      {/* view all results /search?q=term */}
      <div className="w-full h-12 flex justify-center ">
        {searchTerm.current && (
          <Link
            onClick={goToSearchResult}
            to={`/search?q=${searchTerm.current}`}
            className="w-full h-12 bg-[#79773a] text-[#79773a] rounded-full"
          >
            All Results for {searchTerm.current}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   searchTerm: React.MutableRefObject<string>;
 * }}
 */
function NoPredictiveSearchResults({searchTerm}) {
  if (!searchTerm.current) {
    return null;
  }
  return (
    <span className="bg-[#79773a] text-[#79773a] text-center text-base">
      No results found for <q>{searchTerm.current}</q>
    </span>
  );
}

/**
 * @param {SearchResultTypeProps}
 */
function PredictiveSearchResult({goToSearchResult, items, searchTerm, type}) {
  const isSuggestions = type === 'queries';
  const categoryUrl = `/search?q=${
    searchTerm.current
  }&type=${pluralToSingularSearchType(type)}`;

  return (
    <div
      className="predictive-search-result flex flex-col gap-4 pt-4 divide-y divide-[#79773a]"
      key={type}
    >
      <div className=" w-fit">
        <Link prefetch="intent" to={categoryUrl} onClick={goToSearchResult}>
          <h5>
            <span className="h-12 bg-[#79773a] font-semibold capitalize text-[#79773a]">
              {isSuggestions ? 'Suggestions' : type}
            </span>
          </h5>
        </Link>
      </div>

      <ul className="pt-4">
        {items.map((item) => (
          <SearchResultItem
            goToSearchResult={goToSearchResult}
            item={item}
            key={item.id}
          />
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {SearchResultItemProps}
 */
function SearchResultItem({goToSearchResult, item}) {
  return (
    <li className="predictive-search-result-item flex flex-row " key={item.id}>
      <Link
        onClick={goToSearchResult}
        to={item.url}
        className="flex flex-row gap-4 divide-y divide-[#79773a]"
      >
        {item.image?.url && (
          <div className="w-16 h-16 bg-[#79773a]"></div>
          // <Image
          //   alt={item.image.altText ?? ''}
          //   src={item.image.url}
          //   width={50}
          //   height={50}
          // />
        )}
        <div className="flex flex-col gap-2 h-full items-start">
          {item.styledTitle ? (
            <div
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
            />
          ) : (
            <span className=" text-[13px] bg-[#79773a] font-semibold capitalize text-[#79773a]">
              {item.title}
            </span>
          )}
          {item?.price && (
            <span className=" text-sm bg-[#79773a] font-semibold capitalize text-[#79773a]">
              <Money data={item.price} />
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

function usePredictiveSearch() {
  const fetchers = useFetchers();
  const searchTerm = useRef('');
  const searchInputRef = useRef(null);
  const searchFetcher = fetchers.find((fetcher) => fetcher.data?.searchResults);

  if (searchFetcher?.state === 'loading') {
    searchTerm.current = searchFetcher.formData?.get('q') || '';
  }

  const search = searchFetcher?.data?.searchResults || {
    results: NO_PREDICTIVE_SEARCH_RESULTS,
    totalResults: 0,
  };

  // capture the search input element as a ref
  useEffect(() => {
    if (searchInputRef.current) return;
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  return {...search, searchInputRef, searchTerm};
}

/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 * @param {| NormalizedPredictiveSearchResults[number]['type']
 *     | Array<NormalizedPredictiveSearchResults[number]['type']>} type
 */
function pluralToSingularSearchType(type) {
  const plural = {
    articles: 'ARTICLE',
    collections: 'COLLECTION',
    pages: 'PAGE',
    products: 'PRODUCT',
    queries: 'QUERY',
  };

  if (typeof type === 'string') {
    return plural[type];
  }

  return type.map((t) => plural[t]).join(',');
}

/**
 * @typedef {| PredictiveCollectionFragment['image']
 *   | PredictiveArticleFragment['image']
 *   | PredictiveProductFragment['variants']['nodes'][0]['image']} PredicticeSearchResultItemImage
 */
/** @typedef {| PredictiveProductFragment['variants']['nodes'][0]['price']} PredictiveSearchResultItemPrice */
/**
 * @typedef {{
 *   __typename: string | undefined;
 *   handle: string;
 *   id: string;
 *   image?: PredicticeSearchResultItemImage;
 *   price?: PredictiveSearchResultItemPrice;
 *   styledTitle?: string;
 *   title: string;
 *   url: string;
 * }} NormalizedPredictiveSearchResultItem
 */
/**
 * @typedef {Array<
 *   | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
 *   | {type: 'products'; items: Array<NormalizedPredictiveSearchResultItem>}
 *   | {type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem>}
 *   | {type: 'pages'; items: Array<NormalizedPredictiveSearchResultItem>}
 *   | {type: 'articles'; items: Array<NormalizedPredictiveSearchResultItem>}
 * >} NormalizedPredictiveSearchResults
 */
/**
 * @typedef {{
 *   results: NormalizedPredictiveSearchResults;
 *   totalResults: number;
 * }} NormalizedPredictiveSearch
 */
/**
 * @typedef {{
 *   searchResults: {
 *     results: SearchQuery | null;
 *     totalResults: number;
 *   };
 *   searchTerm: string;
 * }} FetchSearchResultsReturn
 */
/** @typedef {Class<useFetcher<NormalizedPredictiveSearchResults>>>} ChildrenRenderProps */
/**
 * @typedef {{
 *   action?: FormProps['action'];
 *   method?: FormProps['method'];
 *   className?: string;
 *   children: (passedProps: ChildrenRenderProps) => React.ReactNode;
 *   [key: string]: unknown;
 * }} SearchFromProps
 */
/**
 * @typedef {{
 *   goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
 *   items: NormalizedPredictiveSearchResultItem[];
 *   searchTerm: UseSearchReturn['searchTerm'];
 *   type: NormalizedPredictiveSearchResults[number]['type'];
 * }} SearchResultTypeProps
 */
/**
 * @typedef {Pick<SearchResultTypeProps, 'goToSearchResult'> & {
 *   item: NormalizedPredictiveSearchResultItem;
 * }} SearchResultItemProps
 */
/**
 * @typedef {NormalizedPredictiveSearch & {
 *   searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
 *   searchTerm: React.MutableRefObject<string>;
 * }} UseSearchReturn
 */

/** @typedef {import('@remix-run/react').FormProps} FormProps */
/** @typedef {import('storefrontapi.generated').PredictiveProductFragment} PredictiveProductFragment */
/** @typedef {import('storefrontapi.generated').PredictiveCollectionFragment} PredictiveCollectionFragment */
/** @typedef {import('storefrontapi.generated').PredictiveArticleFragment} PredictiveArticleFragment */
/** @typedef {import('storefrontapi.generated').SearchQuery} SearchQuery */
