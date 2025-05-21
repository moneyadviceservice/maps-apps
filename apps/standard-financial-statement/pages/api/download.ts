import type { NextApiRequest, NextApiResponse } from 'next';

import {
  BlobClient,
  BlobDownloadResponseParsed,
  BlobServiceClient,
  ContainerClient,
} from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_BLOB_ENDPOINT_ACCOUNT_NAME};AccountKey=${process.env.AZURE_BLOB_ENDPOINT_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const containerClient = blobServiceClient.getContainerClient(
    request.query['container'] as string,
  );

  const asset = request.query['asset'] as string;
  const lang = request.query['lang'] as string;
  const filename = asset.replace(`${lang}/`, '');

  const stream = await downloadBlobToString(containerClient, asset);

  response.setHeader('Content-Type', `application/${asset.split('.').pop()}`);
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`,
  );
  response.end(stream);
}

async function downloadBlobToString(
  containerClient: ContainerClient,
  blobName: string,
): Promise<unknown> {
  const blobClient: BlobClient = containerClient.getBlobClient(blobName);

  const downloadResponse: BlobDownloadResponseParsed =
    await blobClient.download();

  if (!downloadResponse.errorCode && downloadResponse.readableStreamBody) {
    const downloaded = await streamToBuffer(
      downloadResponse.readableStreamBody,
    );

    if (downloaded) {
      return downloaded;
    }
  }
}

function streamToBuffer(readableStream: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    readableStream.on('data', (data) => {
      const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
      chunks.push(content);
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks.map((chunk) => Uint8Array.from(chunk))));
    });
    readableStream.on('error', reject);
  });
}
