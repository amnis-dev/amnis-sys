import type {
  DataUpdate,
  DataDeleter,
  DataQuery,
} from '../data/data.types.js';
import type { Audit } from '../data/entity/audit/audit.types.js';
import type { Contact } from '../data/entity/contact/contact.types.js';
import type { Credential } from '../data/entity/credential/credential.types.js';
import type { Handle } from '../data/entity/handle/handle.types.js';
import type { History } from '../data/entity/history/history.types.js';
import type { Image } from '../data/entity/image/image.types.js';
import type { Locale } from '../data/entity/locale/locale.types.js';
import type { Log } from '../data/entity/log/log.types.js';
import type { Note } from '../data/entity/note/note.types.js';
import type { Profile } from '../data/entity/profile/profile.types.js';
import type { Role } from '../data/entity/role/role.types.js';
import type { Service } from '../data/entity/service/service.types.js';
import type { System } from '../data/entity/system/system.types.js';
import type { User } from '../data/entity/user/user.types.js';
import type { Session } from '../data/entity/session/session.types.js';
import type { Video } from '../data/entity/video/video.types.js';

export interface DataCreator {
  audit?: Audit[];
  contact?: Contact[];
  credential?: Credential[];
  handle?: Handle[];
  history?: History[];
  image?: Image[];
  locale?: Locale[];
  log?: Log[];
  note?: Note[];
  profile?: Profile[];
  role?: Role[];
  service?: Service[];
  system?: System[];
  user?: User[];
  session?: Session[];
  video?: Video[];
}

export interface DataUpdater {
  audit?: DataUpdate<Audit>[];
  contact?: DataUpdate<Contact>[];
  credential?: DataUpdate<Credential>[];
  history?: DataUpdate<History>[];
  image?: DataUpdate<Image>[];
  locale?: DataUpdate<Locale>[];
  log?: DataUpdate<Log>[];
  note?: DataUpdate<Note>[];
  profile?: DataUpdate<Profile>[];
  role?: DataUpdate<Role>[];
  service?: DataUpdate<Service>[];
  system?: DataUpdate<System>[];
  user?: DataUpdate<User>[];
  session?: DataUpdate<Session>[];
  video?: DataUpdate<Video>[];
}

export interface DataOperations {
  create?: DataCreator;
  update?: DataUpdater;
  delete?: DataDeleter;
  query?: DataQuery;
}
