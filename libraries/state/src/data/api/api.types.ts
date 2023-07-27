/* eslint-disable no-shadow */
import type { UID } from '../../core/index.js';

/**
 * Api type
 */
export interface Api {
  /**
   * Unique identifier.
   */
  $id: UID;

  /**
   * The reducer path key this api configures.
   */
  reducerPath: string;

  /**
   * Relative base URL for the api.
   */
  baseUrl?: string;

  /**
   * Flag that indicates if the api is used for authentication.
   * There can only be one authentication api per system.
   */
  auth?: boolean;

  /**
   * Bearer token to find for this api.
   * Defaults as the active system handle.
   */
  bearerId?: string;

  /**
   * Endpoints that require a signature header.
   * A value of `true` indicates all endpoints.
   */
  signature?: boolean | string[];

  /**
   * Endpoints that require a challenge header.
   * A value of `true` indicates all endpoints.
   */
  challenge?: boolean | string[];

  /**
   * Endpoint that require an OTP header.
   * A value of `true` indicates all endpoints.
   */
  otp?: boolean | string[];

  /**
   * Endpoints that require a bearer token.
   */
  bearer?: boolean | string[];

  /**
   * The system identifier for the api.
   */
  $system?: UID;
}

/**
 * Creation Type for an Api.
 */
export type ApiCreator = Omit<Api, '$id'>;

/**
 * Api collection meta data.
 */
export type ApiMeta = Record<string, Api>;
