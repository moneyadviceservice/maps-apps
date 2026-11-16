import { saveDataToBlob } from './handleCSPViolationBlob';

describe('Handle CSP violations blob', () => {
  it('should call netlify functions and return response', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        text: () =>
          Promise.resolve('The CSP violations are saved to Netlify Blobs'),
        json: () =>
          Promise.resolve('The CSP violations are saved to Netlify Blobs'),
      }),
    );
    const response = await saveDataToBlob('Data');
    expect(response).toBe('The CSP violations are saved to Netlify Blobs');
  });

  it('should call custom function path when provided', async () => {
    const mockFetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        text: () =>
          Promise.resolve('The CSP violations are saved to Netlify Blobs'),
      }),
    );
    global.fetch = mockFetch;

    const customPath = '/.netlify/functions/customCSPHandler';
    await saveDataToBlob('Data', customPath);

    expect(mockFetch).toHaveBeenCalledWith(customPath, {
      method: 'POST',
      body: 'Data',
    });
  });

  it('should fail to call netlify functions and return response', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        ok: false,
        text: () => Promise.resolve('Error in saving the data to Blob'),
      });
    });
    try {
      await saveDataToBlob('data');
    } catch (e) {
      expect(e.message).toBe(
        'Status code 404 -  Error in saving the data to Blob',
      );
    }
  });
});
