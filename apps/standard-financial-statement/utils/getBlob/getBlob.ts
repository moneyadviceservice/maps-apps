import { BlobServiceClient } from '@azure/storage-blob';

export type AssetBlob = {
  name: string;
  url: string;
  order: number;
  displayName: string;
  container: string;
  size: number;
  contentType: string;
};

export async function getBlob(
  path: string,
  lang: string,
): Promise<AssetBlob[]> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_BLOB_ENDPOINT_ACCOUNT_NAME};AccountKey=${process.env.AZURE_BLOB_ENDPOINT_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
  );

  const containerClient = blobServiceClient.getContainerClient(path);

  try {
    const assetList = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const tags = await blobClient.getProperties();

      const metaName = tags?.metadata?.['name'] ?? '';
      const metaOrder = tags?.metadata?.['order'] ?? 0;

      assetList.push({
        name: blob.name,
        displayName: decodeURI(metaName) ?? blob.name,
        order: Number(metaOrder),
        size: blob.properties.contentLength ?? 0,
        contentType: blob.properties.contentType ?? '',
        container: path,
        url: `?container=${path}&lang=${lang}&asset=${blob.name}`,
      });
    }

    return assetList.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching blobs:', error);
    return [];
  }
}
