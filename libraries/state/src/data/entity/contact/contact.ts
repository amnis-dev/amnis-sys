import { uid } from '../../../core/index.js';
import { entitySliceCreate } from '../entity.slice.js';
import type { Contact, ContactRoot, ContactMinimal } from './contact.types.js';

const contactKey = 'contact';

export const contactRoot = (): ContactRoot => ({
  name: 'Unknown Contact',
  phones: [],
  emails: [],
  socials: [],
});

export function contactCreate(
  contact: ContactMinimal,
): Contact {
  return {
    ...contactRoot(),
    ...contact,
    $id: uid(contactKey),
  };
}

export const contactSlice = entitySliceCreate({
  key: contactKey,
  create: contactCreate,
});
