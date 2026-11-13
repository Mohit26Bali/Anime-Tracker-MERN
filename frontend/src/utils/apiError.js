// The API returns { message } for most errors but { errors: [{ msg, path }] } for validation failures.
export const apiErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || fallback;
