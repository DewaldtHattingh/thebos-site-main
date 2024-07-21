import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';

/**
 * @type {MetaFunction<({ request, params, context: { storefront }, }: LoaderFunctionArgs) => unknown>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.blog.title ?? ''} blog`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export const loader = async ({request, params, context: {storefront}}) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return json({blog});
};

export default function Blog() {
  /** @type {LoaderReturnData} */
  const {blog} = useLoaderData();
  const {articles} = blog;


  console.log(articles);

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col w-full gap-4 p-4 md:w-full ">
      <h1 className={'collection-description'}>
        <span className="w-10/12 text-[15vw] md:text-[12vw] lg:w-[10vw]  text-white leading-[20vw] md:leading-[20vw] lg:leading-[20vw] font-normal uppercase text-center">
          Stories We Love
        </span>
      </h1>
        <div className="blog-grid">
          <Pagination connection={articles}>
            {({nodes, isLoading, PreviousLink, NextLink}) => {
              return (
                <>
                  <div className="flex flex-col justify-center gap-4 divide-y divide-slate-200 md:grid md:grid-cols-3">
                    <PreviousLink>
                      {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                    </PreviousLink>
                    {nodes.map((article, index) => {
                      return (
                        <ArticleItem
                          article={article}
                          key={article.id}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      );
                    })}
                  </div>
                  <NextLink>
                    {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                  </NextLink>
                </>
              );
            }}
          </Pagination>
        </div>
      </div>
    </div>
 
  );
}

/**
 * @param {{
 *   article: ArticleItemFragment;
 *   loading?: HTMLImageElement['loading'];
 * }}
 */
function ArticleItem({article, loading}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));
  return (
    <div className="pt-4 blog-article" key={article.id}>
 
        <div className="w-full mb-4 aspect-video bg-[#84824D] text-white flex flex-col items-start justify-start p-4 hover:bg-[#A78EB2]">
        <div className="flex flex-col w-full gap-2">
            <div className='text-2xl leading-7 text-white'>
              <span className="text-2xl font-semibold text-white">
                {article.title}
              </span>
            </div>
            <div className="w-full text-base leading-7 ">{article.excerpt}</div>
            <Link to={`/blogs/${article.blog.handle}/${article.handle}`} className='underline'>
              Read Article
             </Link>
            {/* <small>
              <span className="text-base text-white ">
                {publishedAt}
              </span>
            </small> */}
          </div>
        </div>
        {/* {article.image && (
          <div className="blog-article-image">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )} */}
        <div className="flex flex-row items-center justify-between gap-4">
          {/* <div className="w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          </div> */}


        </div>
     
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    excerpt(truncateAt: 100)
      
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ArticleItemFragment} ArticleItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
