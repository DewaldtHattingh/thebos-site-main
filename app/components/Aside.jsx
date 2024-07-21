/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   heading: React.ReactNode;
 *   id?: string;
 * }}
 */
export function Aside({children, heading, id = 'aside'}) {
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header className="bg-[#79773a] pl-6">
          <div className="h-10 w-10/12 bg-[#636130] flex justify-end items-center text-[0px]">
            <h3>{heading}</h3>
          </div>

          <div className="h-10 aspect-square rounded-full bg-[#636130] flex justify-end items-center">
            <CloseAside />
          </div>
        </header>
        <main>
          <div className="w-full p-4 pl-6">{children}</div>
        </main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a
      className="close text-[0px] h-10 aspect-video"
      href=""
      onChange={() => {
        history.go(-1);
        window.location.hash = '';
      }}
    >
      &times;
    </a>
  );
}
