export function Transition({show}) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black z-50 
    transition-transform duration-500 ease-in-out
    ${show ? 'translate-y-0' : 'translate-y-full'}`}
    ></div>
  );
}
