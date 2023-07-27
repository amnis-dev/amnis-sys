export interface LocalInfo {
  /**
   * The user uid.
   */
  uid: string;
}

const localInfo: LocalInfo = {
  uid: 'anonymous',
};

export function localInfoGet(): LocalInfo {
  return localInfo;
}

export function localInfoSet(info: Partial<LocalInfo>): void {
  Object.assign(localInfo, info);
}
