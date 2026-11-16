import { dbConnect } from 'lib/database/dbConnect';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export const updateFirm = async (
  id: string,
  updates: Partial<TravelInsuranceFirmDocument> | Record<string, unknown>,
) => {
  try {
    const { container } = await dbConnect();

    const itemRef = container.item(id, id);
    const { resource: currentItem } = await itemRef.read();

    if (!currentItem) {
      return { error: 'Document not found' };
    }

    const updatedItem = cloneDeep(currentItem);

    let statusUpdated = false;

    for (const [path, value] of Object.entries(updates)) {
      // Support both:
      // office.contact.email_address
      // office/contact/email_address
      const normalizedPath = path
        .replace(/^\/+/, '') // remove leading slash
        .replaceAll('/', '.');

      if (normalizedPath === 'status') {
        statusUpdated = true;
      }

      set(updatedItem, normalizedPath, value);
    }

    if (statusUpdated) {
      updatedItem.hidden_at =
        updatedItem.status === 'hidden' ? new Date().toISOString() : null;
    }

    updatedItem.updated_at = new Date().toISOString();

    const { resource } = await itemRef.replace(updatedItem);

    return {
      success: true,
      response: resource,
    };
  } catch (error) {
    console.error('Update failed:', error);

    return {
      error: 'Failed to update progress',
    };
  }
};
