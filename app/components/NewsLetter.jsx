import React, {useState} from 'react';
export function NewsLetter({newsLetter, setNewsLetter}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    return /^[a-zA-Z ]+$/.test(name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setMessage(
        <div className="flex items-center justify-center w-full h-12 mt-8 bg-white text-slate-300">
          Please enter a valid email address.
        </div>,
      );
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      setMessage(
        <div className="flex items-center justify-center w-full h-12 mt-8 bg-white text-slate-300">
          Names should only contain letters.
        </div>,
      );
      return;
    }

    // Length checks can be added here as needed

    try {
      const response = await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, firstName, lastName}),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(
          <div className="flex items-center justify-center w-full h-12 mt-8 bg-white text-slate-300">
            Thank you for subscribing!
          </div>,
        );
      } else {
        setMessage(
          <div className="flex items-center justify-center w-full h-12 mt-8 bg-white text-slate-300">
            Subscription failed. Please try again.
          </div>,
        );
      }
    } catch (error) {
      setMessage(
        <div className="flex items-center justify-center w-full h-12 mt-8 bg-white text-slate-300">
          An error occurred. Please try again.
        </div>,
      );
    }
  };
  function handleClick() {
    setNewsLetter('translate-y-[100vh]');
  }

  return (
    <div
      className={
        'w-full bg-[#79773a] flex flex-col fixed bottom-0 left-0 h-screen z-20 transition-all duration-300 ease-in-out' +
        ' ' +
        newsLetter
      }
    >
      {/* <div className="w-0 h-0 bg-red-100"></div> */}

      <div className="relative flex flex-row items-center justify-center w-full h-20 ">
        <span className="bg-[#79773a] text-white text-2xl text-center font-bold leading-[45px] ">
          Newsletter Signup
        </span>
        <button
          className="absolute w-10 h-10 rounded-full bg-[#636130] top-5 right-5"
          onClick={handleClick}
        ></button>
      </div>

      <div className=" flex justify-center items-start h-screen p-4 bg-[#636130] ">
        <div className="flex flex-col w-full md:w-1/3 gap-10 pt-10 md:pt-[20vh]">    
        
          <p className="w-full text-center">
          <span className="text-lg font-normal leading-4 text-center text-white ">
            This is your email signup form subtitle, what can they expect from
            communications from you. Somthing short and snappy
          </span>
        </p>
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            className="text-sm border ring-1 text-slate-300 border-slate-300 ring-slate-200 focus:ring-1 focus:ring-slate-300 focus:border focus:border-slate-200"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            className="text-sm border ring-1 text-slate-300 border-slate-300 ring-slate-200 focus:ring-1 focus:ring-slate-300 focus:border focus:border-slate-200"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="text-sm border ring-1 text-slate-300 border-slate-300 ring-slate-200 focus:ring-1 focus:ring-slate-300 focus:border focus:border-slate-200"
          />
          <button
            type="submit"
            className="w-full h-12 bg-[#79773a] border border-white text-white uppercase text-lg text-center mt-8"
          >
            Subscribe Now
          </button>
        </form>
        </div>
      
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}
