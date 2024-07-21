import {json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {storefront, session} = context;
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  const password = form.has('password') ? String(form.get('password')) : null;
  const passwordConfirm = form.has('passwordConfirm')
    ? String(form.get('passwordConfirm'))
    : null;

  const validPasswords =
    password && passwordConfirm && password === passwordConfirm;

  const validInputs = Boolean(email && password);
  try {
    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password},
      },
    });

    if (customerCreate?.customerUserErrors?.length) {
      throw new Error(customerCreate?.customerUserErrors[0].message);
    }

    const newCustomer = customerCreate?.customer;
    if (!newCustomer?.id) {
      throw new Error('Could not create customer');
    }

    // get an access token for the new customer
    const {customerAccessTokenCreate} = await storefront.mutate(
      REGISTER_LOGIN_MUTATION,
      {
        variables: {
          input: {
            email,
            password,
          },
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error('Missing access token');
    }
    session.set(
      'customerAccessToken',
      customerAccessTokenCreate?.customerAccessToken,
    );

    return json(
      {error: null, newCustomer},
      {
        status: 302,
        headers: {
          'Set-Cookie': await session.commit(),
          Location: '/account',
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Register() {
  /** @type {ActionReturnData} */
  const data = useActionData();
  const error = data?.error || null;
  return (
    <div className="flex items-center justify-center w-full aspect-video bg-slate-50">
      <div className="flex flex-col w-full gap-4 px-4 py-6 bg-white divide-y divide-white md:border md:shadow-lg md:w-1/3 login border-slate-200 rounded-2xl">
   
    <h1 className="text-3xl font-bold text-center text-black">Register Shuffle Account</h1>
    <p className='px-4 text-sm font-normal text-center'>Unlock exclusive perks by joining us today. It only takes a moment to sign up!</p>

      <Form method="POST">
        <fieldset className="flex flex-col w-full gap-6 mt-4">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl active:ring-black"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            minLength={8}
            className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl active:ring-black"
            required
          />
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="current-password"
            placeholder="Re-enter password"
            aria-label="Re-enter password"
            minLength={8}
            className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl active:ring-black"
            required
          />
        </fieldset>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          ''
        )}
        <button
          type="submit"
          className="w-full h-12 mt-10 text-white bg-black rounded-full"
        >
          Register
        </button>
      </Form>
  
      <div className="flex items-center justify-center w-full h-12 text-white bg-black rounded-full ">
    
        <Link
          to="/account/login"
          className="w-full h-12 py-1 leading-10 text-center text-white rounded-full"
        >
          Login
        </Link>
      </div>
    </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const REGISTER_LOGIN_MUTATION = `#graphql
  mutation registerLogin(
    $input: CustomerAccessTokenCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

/**
 * @typedef {{
 *   error: string | null;
 *   newCustomer:
 *     | NonNullable<CustomerCreateMutation['customerCreate']>['customer']
 *     | null;
 * }} ActionResponse
 */

/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CustomerCreateMutation} CustomerCreateMutation */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
