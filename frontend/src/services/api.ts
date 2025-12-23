const REST_BASE_URL = "http://localhost:7171";
const GQL_BASE_URL = "http://localhost:8080/v1/graphql";

async function apiFetch<T>(REST: boolean = true, endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = (REST) ? REST_BASE_URL + endpoint : GQL_BASE_URL + endpoint;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => { });
      throw new Error(errorBody.message || `HTTP Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return {} as T;

  }
  catch (e) {
    console.log("API Call failed\n." + e);
    throw e;
  }

}

export const api = {
  get: <T>(REST: boolean, endpoint: string, headers?: any) => apiFetch<T>(REST, endpoint, { method: "GET", headers: headers }),

  post: <T>(REST: boolean, endpoint: string, body: any, headers?: any) => apiFetch<T>(REST, endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers
  }),

  put: <T>(REST: boolean, endpoint: string, body: any, headers?: any) => apiFetch<T>(REST, endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: headers
  }),

  delete: <T>(REST: boolean, endpoint: string, headers?: any) => apiFetch<T>(REST, endpoint, { method: "DELETE", headers: headers })
};
