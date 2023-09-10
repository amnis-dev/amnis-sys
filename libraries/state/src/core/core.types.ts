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
 * @maxLength 32
 */
export type UID<T = unknown> = UIDNominal & string;

/**
 * A id identifier to another document.
 *
 * @title %core:state:uid
 * @description %core:state:uid_desc
 * @pattern ^[a-z]{1,21}:[A-Za-z0-9_-]{21}$
 * @minLength 22
 * @maxLength 42
 */
export type UIDv2<S extends string = string> = `${S}:${string}`;

/**
 * Extracts the key value from a UIDv2 type.
 *
 * @title %core:state:uidkey
 * @description %core:state:uidkey_desc
 */
export type UIDv2Key<ID extends UIDv2> = ID extends `${infer S}:${infer _}` ? S : never;

/**
 * List of identifiers.
 */
export type UIDList<T = unknown> = UID<T>[];

/**
 * List of identifiers.
 *
 * @title %core:state:uidlist
 * @description %core:state:uidlist_desc
 */
export type UIDv2List<S extends string = string> = UIDv2<S>[];

/**
 * Identifiers linked in a directory tree fashion.
 */
export type UIDTree<T = unknown> = [item: UID<T>, parent: UID<T> | null][];

/**
 * Identifiers linked in a directory tree fashion.
 *
 * @title %core:state:uidtree
 * @description %core:state:uidtree_desc
 */
export type UIDv2Tree<S extends string = string> = [item: UIDv2<S>, parent: UIDv2<S> | null][];

/**
 * A string that represents a JSON Date.
 *
 * @title %core:state:datejson
 * @description %core:state:datejson_desc
 * @format date-time
 * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$
 * @errorMessage "Date format is invalid"
 */
export type DateJSON = DateNominal & string;

/**
 * A string that represents a Numeric Date.
 *
 * @title %core:state:datenumeric
 * @description %core:state:datenumeric_desc
 * @min 0
 */
export type DateNumeric = DateNominal & number;

/**
 * A string that represents a URL.
 * Named SURL (String URL) so it's not confused with the URL object type.
 *
 * @title %core:state:surl
 * @description %core:state:surl_desc
 * @format url
 */
export type SURL = string;

/**
 * An email address
 *
 * @title %core:state:email
 * @description %core:state:email_desc
 * @format email
 * @minLength 3
 * @maxLength 64
 * @errorMessage "The email address is poorly formatted"
 */
export type Email = string;

/**
 * A clear-text password.
 *
 * @format password
 * @minLength 4
 * @maxLength 64
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
 * An IP version 4 address.
 *
 * @title %core:state:ipv4
 * @description %core:state:ipv4_desc
 * @format ipv4
 * @minLength 8
 * @maxLength 34
 */
export type IPv4 = string;

/**
 * An IP version 6 address.
 *
 * @title %core:state:ipv6
 * @description %core:state:ipv6_desc
 * @format ipv6
 * @minLength 8
 * @maxLength 34
 */
export type IPv6 = string;

/**
 * An IP address.
 *
 * @title %core:state:ip
 * @description %core:state:ip_desc
 */
export type IP = IPv4 | IPv6;
