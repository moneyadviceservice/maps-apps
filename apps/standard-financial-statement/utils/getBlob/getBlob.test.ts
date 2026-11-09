import { BlobServiceClient } from '@azure/storage-blob';

import { getBlob } from './getBlob';

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockImplementation(() => ({
      getContainerClient: jest.fn().mockImplementation(() => ({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'test-blob',
            properties: {
              contentLength: 123,
              contentType: 'text/plain',
            },
          },
          {
            name: 'test-blob2',
            properties: {
              contentLength: 456,
              contentType: 'application/pdf',
            },
          },
        ]),
        getBlobClient: jest.fn().mockImplementation(() => ({
          getProperties: jest.fn().mockResolvedValue({
            metadata: {
              name: 'meta-name',
            },
          }),
        })),
      })),
    })),
  },
}));

describe('getBlob', () => {
  it('should return blobs', () => {
    expect(getBlob('test', 'en')).resolves.toEqual([
      {
        name: 'test-blob',
        displayName: 'meta-name',
        order: 0,
        size: 123,
        contentType: 'text/plain',
        container: 'test',
        url: '?container=test&lang=en&asset=test-blob',
      },
      {
        name: 'test-blob2',
        displayName: 'meta-name',
        order: 0,
        size: 456,
        contentType: 'application/pdf',
        container: 'test',
        url: '?container=test&lang=en&asset=test-blob2',
      },
    ]);
  });

  it('should return empty array if no container found', () => {
    (
      BlobServiceClient.fromConnectionString as jest.Mock
    ).mockImplementationOnce(() => ({
      getContainerClient: jest.fn().mockImplementation(() => ({
        listBlobsFlat: jest.fn().mockReturnValue([]),
      })),
    }));

    expect(getBlob('test', 'cy')).resolves.toEqual([]);
  });
});
