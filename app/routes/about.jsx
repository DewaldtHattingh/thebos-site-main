import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
// import {Suspense} from 'react';
// import {Image, Money} from '@shopify/hydrogen';
import {HomeHero} from '~/components/HomeHero';
import {KeyFrameText2} from '../components/KeyFrameText';
import {Profiles} from '../components/Profiles';
import {Discover} from '../components/Discover';
import {AboutFynbos} from '../components/AboutFynbos';
import {AboutCapensis} from '../components/AboutCapensis';
import {Mission} from '../components/Mission';
/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Thebos | About Us'}];
};
/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const home_hero = await storefront.query(HOME_HERO);
  const home_intro = await storefront.query(HOME_INTRO);
  const about_fynbos = await storefront.query(ABOUT_FYNBOS);
  const about_capensis = await storefront.query(ABOUT_CAPENSIS);
  const about_mission = await storefront.query(ABOUT_MISSION);
  const discover = await storefront.query(DISCOVER);
  const about_profiles = await storefront.query(PROFILES);

  return defer({
    home_hero,
    home_intro,
    discover,
    about_profiles,
    about_fynbos,
    about_capensis,
    about_mission,
  });
}
export default function Homepage() {
  /** @type {LoaderReturnData} */
  const {
    home_hero,
    home_intro,
    about_profiles,
    discover,
    about_fynbos,
    about_capensis,
    about_mission,
  } = useLoaderData();
  return (
    <>
      <div className="relative h-[83vh]">
        <HomeHero content={home_hero.metaobject.fields} />
      </div>
      <div className="w-full  bg-[#ECE9E4] flex flex-col items-center ">
        <div className="w-full md:w-10/12">
          <KeyFrameText2 content={home_intro.metaobject.fields} />
        </div>

        <div className="w-full">
          <Profiles content={about_profiles.metaobjects.nodes} />
        </div>
        <div className="w-full bg-[#84824D] flex flex-col items-center justify-center py-10">
          <Mission content={about_mission.metaobject.fields} />
        </div>
        <div className="w-full bg-[#636130] flex flex-col items-center justify-center">
          <AboutFynbos content={about_fynbos.metaobject.fields} />
        </div>
        <div className="w-full bg-[#84824D] flex flex-col items-center justify-center aspect-video">
          <AboutCapensis content={about_capensis.metaobject.fields} />
        </div>
        <div className="w-full">
          <Discover content={discover.metaobjects.nodes} />
        </div>
      </div>
    </>
  );
}

export const HOME_HERO = `#graphql
query content ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "about-hero", type: "hero"}) {
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
export const HOME_INTRO = `#graphql
query intro ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "home-intro", type: "intro"}) {
    fields {
      key
      type
      value
    }
  }
}
`;
export const ABOUT_FYNBOS = `#graphql
query fynbos ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "about-fynbos", type: "fynbos"}) {
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
export const ABOUT_CAPENSIS = `#graphql
query capensis ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "about-capensis", type: "bees"}) {
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
export const ABOUT_MISSION = `#graphql
query mission ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "about-mission", type: "mission"}) {
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
export const DISCOVER = `#graphql
query discover ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "discover", first: 3) {
    nodes {
      fields {
        type
        value
        key
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
}
`;
export const PROFILES = `#graphql
query profiles ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "profiles", first: 3) {
    nodes {
      fields {
        type
        value
        key
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
}
`;
export const PRODUCTS = `#graphql
query products ( $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 2) {
    edges {
      node {
        handle
        title
        images(first: 1) {
          nodes {
            url
          }
        }
        metafield(namespace: "custom", key: "subtitle") {
          value
          type
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
