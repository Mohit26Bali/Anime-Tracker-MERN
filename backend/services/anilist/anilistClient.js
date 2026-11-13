const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(process.env.ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 429) {
    const error = new Error("AniList rate limit exceeded, please try again shortly");
    error.statusCode = 429;
    error.retryAfter = response.headers.get("retry-after");
    throw error;
  }

  const body = await response.json();

  if (!response.ok || body.errors) {
    const message = body.errors?.[0]?.message || "AniList request failed";
    const error = new Error(message);
    error.statusCode = response.status >= 400 ? response.status : 502;
    throw error;
  }

  return body.data;
};

export default graphqlRequest;
