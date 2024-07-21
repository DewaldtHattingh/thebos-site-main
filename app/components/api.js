export async function createReview(document, accessToken) {
  const response = await fetch('http://localhost:3001/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify(document),
  });

  if (!response.ok) {
    throw new Error('Failed to create document');
  }
}
