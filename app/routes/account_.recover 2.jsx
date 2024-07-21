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
    <div className="flex items-center justify-center w-full h-screen">
      <div className="login bg-[#636130] py-6 px-4 flex flex-col gap-4 w-full md:w-1/3">
        {action?.resetRequested ? (
          <>
            <h1>Request Sent.</h1>
            <p>
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
            <Link to="/account/login">Return to Login</Link>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-3xl text-center text-white ">
              Forgot your Password?
            </h1>
            <div className="w-full pt-2 mb-2">
              <div className="leading-8 text-center text-white">
                Enter the email address associated with your account to receive
                a link to reset your password.
              </div>
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
                  className="mt-4 text-white bg-white border border-slate-300"
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
                className="w-full h-12 leading-10 text-center text-white uppercase border border-white bg-[#84824D]"
              >
                Reset Link
              </button>
            </Form>
            <Link
              to="/account/login"
              className="w-full h-12 mt-3 leading-10 text-center text-white uppercase border border- bg-[#84824D]"
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
