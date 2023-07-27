/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */

/**
 * Pick specific properties to make optional.
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Unique identifier symbols for core types.
 */
export enum UIDNominal { _ = '' }
export enum DateNominal { _ = '' }
export enum SURLNominal { _ = '' }

/**
 * A id identifier to another document.
 *
 * @pattern ^[a-z]{1,24}:[A-Za-z0-9_-]{16,32}$
 * @minLength 18
 * @maxLength 56
 */
export type UID<T = unknown> = UIDNominal & string;

/**
 * List of identifiers.
 */
export type UIDList<T = unknown> = UID<T>[];

/**
 * Identifiers linked in a directory tree fashion.
 */
export type UIDTree<T = unknown> = [UID<T>, UID<T> | null][];

/**
 * A string that represents a JSON Date.
 *
 * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$
 * @errorMessage "Date format is invalid"
 */
export type DateJSON = DateNominal & string;

/**
 * A string that represents a JSON Date.
 *
 * @min 0
 */
export type DateNumeric = DateNominal & number;

/**
 * A string that represents a URL.
 * Named SURL (String URL) so it's not confused with the URL object type.
 *
 * @pattern ^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?$
 * @minLength 0
 * @maxLength 512
 */
export type SURL = string;

/**
 * An email address
 *
 * @pattern ^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$
 * @maxLength 64
 * @errorMessage "The email address is poorly formatted"
 */
export type Email = string;

/**
 * A clear-text password.
 *
 * @minLength 4
 * @maxLength 32
 */
export type Password = string;

/**
 * A human-friendly name.
 *
 * @minLength 1
 * @maxLength 32
 */
export type Name = string;

/**
 * A string encoded object.
 *
 * @minLength 1
 * @maxLength 512
 */
export type Encoding = string;

/**
 * An IP address.
 *
 * @pattern ^[0-9a-fA-F.:]+$
 * @minLength 8
 * @maxLength 34
 */
export type IP = string;
