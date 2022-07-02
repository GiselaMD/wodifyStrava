import { getSecureData } from "./secureStore";

const get = async (url) => {
  const token = await getSecureData("access_token");
  const requestOptions = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(url, requestOptions);
  return await handleResponse(response);
};

const post = async (url, body) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return await handleResponse(response);
};

const put = async (url, body) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return await handleResponse(response);
};
// helper functions

const handleResponse = async (response) => {
  const json = await response.json();
  return json;
};

export const fetchWrapper = {
  post,
  get,
  put,
};
