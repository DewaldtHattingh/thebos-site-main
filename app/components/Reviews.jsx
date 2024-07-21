import React, {useState, useEffect} from 'react';
import {register} from 'swiper/element/bundle';

export function Reviews({isAuthenticated}) {
  // console.log(isAuthenticated);
  register();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  //   const accessToken = config.accessToken;

  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/all-reviews');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchReviews();
  }, [refresh]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {name, description};

    try {
      const response = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.ok) {
        // Update the refresh state to trigger a re-fetch of reviews
        setIsSubmitted(true);
        setRefresh((prev) => !prev);
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 divide-y">
      <div className="flex flex-col justify-between w-full md:flex-row ">
        <div className="">
        <span className="text-3xl font-semibold leading-10 text-white">
          Latest Reviews
        </span>
        </div>
        <div className="">
        {isAuthenticated ? (
        <div className="w-full h-full py-4 ">
          {!isSubmitted ? (
            <div className="flex justify-center w-full py-6 bg-blue-100 ">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-11/12 gap-4 border border-[#79773a]"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className=""
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className=""
                ></textarea>
                <button
                  type="submit"
                  className=""
                >
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 bg-blue-100 success-message ">
              <p>
                <span className="text-base text-black bg-white ">
                  Your review has been submitted successfully!
                </span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full py-4">
          <div className="w-full text-white underline uppercase">
            Write a Review
          </div>
        </div>
      )}
        </div>
      </div>

   

      <div className="w-full pt-4">
        {/* <span className="text-3xl font-semibold leading-10 text-white">
          Latest Review
        </span> */}

        <ul className="flex flex-col gap-4 divide-y divide-[#79773a] items-center justify-center pt-2">
          {reviews.map((review) => (
            <li key={review._id} className="flex flex-col w-full gap-2 pt-4 ">
              <p>
                <span className="py-1 text-xl font-semibold leading-9 text-white">
                  {review.name}
                </span>
              </p>

              <p>
                <span className="font-normal leading-8 text-white text-basef">
                  {review.description}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="w-full ">
    
        <swiper-container>
          <swiper-slide>Slide 1</swiper-slide>
          <swiper-slide>Slide 2</swiper-slide>
          <swiper-slide>Slide 3</swiper-slide>
        </swiper-container>
      </div> */}
    </div>
  );
}
