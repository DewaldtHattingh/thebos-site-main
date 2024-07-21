import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Thebos | ${data?.article.title ?? ''} article`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle, articleHandle},
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {

  /** @type {LoaderReturnData} */
  const {article} = useLoaderData();
  const {title, image, contentHtml, author} = article;
  console.log(article);
  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="flex justify-center w-full p-4 py-20">
      <div className="flex flex-col w-full gap-6 article md:w-2/3">
        <div className="h-12 text-4xl text-white">
          {title}
        </div>
        <div className="pb-4 text-white font-base">{article.excerpt}</div>
        <div className="h-8 text-base text-white ">
          <span>
            {publishedDate} &middot; {author?.name}
          </span>
        </div>
        {image && <Image data={image} sizes="90vw" loading="eager" />}
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="pt-2 text-white article font-base"
        />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        excerpt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
