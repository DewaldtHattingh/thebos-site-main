import {json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Login'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Login() {
  /** @type {ActionReturnData} */
  const data = useActionData();
  const error = data?.error || null;

  return (
    <div className="flex items-center justify-center w-full aspect-video bg-slate-50">
      <div className="flex flex-col w-full gap-4 px-4 py-6 bg-white divide-y divide-white md:border md:shadow-lg md:w-1/3 login border-slate-200 rounded-2xl">
          <h1 className="text-3xl font-bold text-center text-black ">Do you have an account?</h1>
          <p className='px-4 text-sm font-normal text-center'>Welcome back! Please enter your credentials below to securely log into your account and access all your personalized features.</p>
          <Form method="POST" className=''>
            <fieldset className="flex flex-col w-full gap-6 pt-4">
              <div className="flex flex-col w-full gap-4 ">
                {/* <label htmlFor="email" className="text-white bg-white">
                  Email address
                </label> */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email"
                  aria-label="Email address"
                  className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl active:ring-black"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  // autoFocus
                />
              </div>
              <div className="flex flex-col gap-2 ">
                {/* <label htmlFor="password" className="text-white bg-white">Password</label> */}
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  aria-label="Password"
                  minLength={8}
                  required
                  className="w-full text-sm leading-7 text-black bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </fieldset>
            {error ? (
              <p>
                <mark>
                  <small>{error}</small>
                </mark>
              </p>
            ) : (
              <br />
            )}
            <button
              type="submit"
              className="w-full h-12 mt-4 text-white bg-black rounded-full"
            >
              Continue
            </button>
          </Form>
          <div className="flex flex-row justify-between gap-4 pt-2 text-black">
            <div className="flex items-center justify-center w-1/2 h-12 bg-black rounded-full ">
            
              <Link
                to="/account/recover"
                className="w-full h-12 py-1 leading-10 text-center text-white rounded-full"
              >
               Password
              </Link>
            </div>
            <div className="flex items-center justify-center w-1/2 h-12 text-white bg-black rounded-full ">
              <Link
                to="/account/register"
                className="w-full h-12 py-1 leading-10 text-center text-white rounded-full"
              >
                Register
              </Link>
            </div>
          </div>
      </div>
    </div>
  
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
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
 * }} ActionResponse
 */

/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
