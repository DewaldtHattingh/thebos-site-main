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
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export default function Recover() {
  /** @type {ActionReturnData} */
  const action = useActionData();

  return (
    <div className="flex items-center justify-center w-full aspect-video bg-slate-50">
      <div className="flex flex-col w-full gap-4 px-4 py-6 bg-white divide-y divide-white md:border md:shadow-lg md:w-1/3 login border-slate-200 rounded-2xl">
        {action?.resetRequested ? (
          <>
            <h1 className='text-3xl font-bold text-center text-black'>Request Sent.</h1>
            <p className='px-4 text-sm font-normal text-center'>
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
            <Link to="/account/login">Return to Login</Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-black">
              Forgot your Password?
            </h1>
            <div className="w-full pt-2 mb-2">
              <p className="px-4 text-sm font-normal text-center">
                Enter the email address associated with your account to receive
                a link to reset your password.
              </p>
            </div>

            <Form method="POST">
              <fieldset>
                {/* <label htmlFor="email">Email</label> */}
                <input
                  aria-label="Email address"
                  autoComplete="email"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl active:ring-black"
                  type="email"
                />
              </fieldset>
              {action?.error ? (
                <p>
                  <mark>
                    <small>{action.error}</small>
                  </mark>
                </p>
              ) : (
                <br />
              )}

              <button
                type="submit"
                className="w-full h-12 mt-4 text-white bg-black rounded-full"
              >
                Reset Link
              </button>
            </Form>
            <Link
              to="/account/login"
              className="w-full h-12 py-3 mt-2 text-base text-center text-white bg-black rounded-full "
            >
              Login
            </Link>

            {/* <div>
              <br />
              <p>
                <Link to="/account/login">Login →</Link>
              </p>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * @typedef {{
 *   error?: string;
 *   resetRequested?: boolean;
 * }} ActionResponse
 */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
