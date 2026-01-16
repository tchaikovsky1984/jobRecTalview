import { describe, it, expect, vi, afterEach } from 'vitest';

describe('apiFetch', async () => {
  const AWS_BASE_URL = 'https://aws.example.com';
  const GQL_BASE_URL = 'https://gql.example.com';

  vi.stubGlobal('AWS_BASE_URL', AWS_BASE_URL);
  vi.stubGlobal('GQL_BASE_URL', GQL_BASE_URL);

  const { apiFetch } = await import('./api');

  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createResponse = (
    ok: boolean,
    data: any,
    status = 200,
    contentType = 'application/json'
  ) => {
    return {
      ok,
      status,
      headers: {
        get: (key: string) => key.toLowerCase() === 'content-type' ? contentType : null,
      },
      json: vi.fn().mockResolvedValue(data),
    };
  };

  describe('Headers and Config', () => {
    it('merges default headers with custom options', async () => {
      fetchMock.mockResolvedValue(createResponse(true, {}));

      await apiFetch(true, '/test', {
        headers: { 'Authorization': 'Bearer 123' },
        method: 'POST'
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 123'
          }
        })
      );
    });
  });

  describe('Success Responses', () => {
    it('returns data when response is JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetchMock.mockResolvedValue(createResponse(true, mockData));

      const result = await apiFetch(true, '/test');
      expect(result).toEqual(mockData);
    });

    it('returns empty object if content-type is NOT json', async () => {
      fetchMock.mockResolvedValue(createResponse(true, {}, 200, 'text/plain'));

      const result = await apiFetch(true, '/test');
      expect(result).toEqual({});
    });
  });

  describe('Failure Scenarios', () => {

    // Scenario 1: HTTP Error (e.g., 400, 404, 500) with a JSON error message
    it('throws error using message from error body if present', async () => {
      fetchMock.mockResolvedValue(createResponse(false, { message: 'Custom Backend Error' }, 400));

      await expect(apiFetch(true, '/fail')).rejects.toThrow('Custom Backend Error');
      expect(consoleSpy).toHaveBeenCalled(); // Verify catch block logged the error
    });

    // Scenario 2: HTTP Error without a specific message property
    it('throws generic HTTP status error if error body has no message', async () => {
      fetchMock.mockResolvedValue(createResponse(false, { error: 'Unknown' }, 500));

      await expect(apiFetch(true, '/fail')).rejects.toThrow('HTTP Error: 500');
    });

    // Scenario 3: HTTP Error where parsing the body fails (invalid JSON)
    it('throws TypeError (or catches internally) if error body parsing fails completely', async () => {
      const mockRes = {
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error('Parse error'))
      };
      fetchMock.mockResolvedValue(mockRes);

      await expect(apiFetch(true, '/fail')).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('API Call failed'));
    });

    // Scenario 4: GraphQL Logic Error (HTTP 200, but "errors" array exists)
    it('throws the first error message if GraphQL response contains errors', async () => {
      const gqlErrorResponse = {
        data: null,
        errors: [{ message: 'GraphQL syntax error', locations: [] }]
      };

      fetchMock.mockResolvedValue(createResponse(true, gqlErrorResponse));

      await expect(apiFetch(false, '/graphql')).rejects.toThrow('GraphQL syntax error');
    });

    // Scenario 5: Network/Fetch Failure (e.g. offline)
    it('logs and re-throws network errors', async () => {
      const networkError = new Error('Network request failed');
      fetchMock.mockRejectedValue(networkError);

      await expect(apiFetch(true, '/network-fail')).rejects.toThrow('Network request failed');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('API Call failed')
      );
    });
  });
});
