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
 * A unique identifier.
 *
 * @title {
 *  en: "UID",
 *  de: "UID",
 * }
 * @description {
 *  en: "A unique identifier",
 *  de: "Ein eindeutiger Bezeichner",
 *  es: "Un identificador único",
 * }
 * @format reference
 */
export type UID<T = unknown> = UIDNominal & string;

/**
 * A unique identifier.
 *
 * @title {
 *  en: "UID",
 *  de: "UID",
 *  es: "UID",
 * }
 * @description {
 *  en: "A unique identifier",
 *  de: "Ein eindeutiger Bezeichner",
 *  es: "Un identificador único",
 * }
 * @format reference
 */
export type UIDv2<S extends string = string> = `${S}:${string}`;

/**
 * Extracts the key value from a UIDv2 type.
 *
 * @title {
 *  en: "UID Key",
 *  de: "UID Schlüssel"
 * }
 * @description {
 *  en: "Extracts the key value from a UIDv2 type",
 *  de: "Extrahiert den Schlüsselwert aus einem UIDv2-Typ"
 * }
 */
export type UIDv2Key<ID extends UIDv2> = ID extends `${infer S}:${infer _}` ? S : never;

/**
 * List of identifiers.
 *
 * @title {
 *  en: "UID List",
 *  de: "UID Liste"
 * }
 * @description {
 *  en: "List of unique data identifiers",
 *  de: "Liste eindeutiger Datenbezeichner"
 * }
 */
export type UIDList<T = unknown> = UID<T>[];

/**
 * List of identifiers.
 *
 * @title {
 *  en: "UID List",
 *  de: "UID Liste"
 * }
 * @description {
 *  en: "List of unique data identifiers",
 *  de: "Liste eindeutiger Datenbezeichner"
 * }
 */
export type UIDv2List<S extends string = string> = UIDv2<S>[];

/**
 * An array that links a UID to a parent UID.
 *
 * @title {
 * en: "UID Relation",
 * de: "UID Beziehung",
 * es: "Relación UID",
 * }
 * @description {
 * en: "An array that links a UID to a parent UID",
 * de: "Ein Array, das eine UID mit einer übergeordneten UID verknüpft",
 * es: "Una matriz que vincula un UID a un UID principal",
 * }
 */
export type UIDRelation<T extends UID = UID> = [item: T, parent: T | null];

/**
 * Identifiers linked in a directory tree fashion.
 *
 * @title {
 *  en: "UID Tree",
 *  de: "UID Baum"
 * }
 * @description {
 *  en: "List of unique data identifiers linked in a tree fashion",
 *  de: "Liste eindeutiger Datenbezeichner, die baumartig verknüpft sind"
 * }
 */
export type UIDTree<T extends UID = UID> = UIDRelation<T>[];

/**
 * Identifiers linked in a directory tree fashion.
 *
 * @title {
 *  en: "UID Tree",
 *  de: "UID Baum"
 * }
 * @description {
 *  en: "List of unique data identifiers linked in a tree fashion",
 *  de: "Liste eindeutiger Datenbezeichner, die baumartig verknüpft sind"
 * }
 */
export type UIDv2Tree<S extends string = string> = [item: UIDv2<S>, parent: UIDv2<S> | null][];

/**
 * A string that represents a JSON Date.
 *
 * @title {
 *  en: "JSON Date",
 *  de: "JSON Datum"
 * }
 * @description {
 *  en: "A string that represents a JSON Date",
 *  de: "Ein String, der ein JSON-Datum darstellt"
 * }
 * @format date-time
 * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$
 * @errorMessage "Date format is invalid"
 */
export type DateJSON = DateNominal & string;

/**
 * A string that represents a Numeric Date.
 *
 * @title {
 *  en: "Numeric Date",
 *  de: "Numerisches Datum"
 * }
 * @description {
 *  en: "A string that represents a Numeric Date",
 *  de: "Ein String, der ein numerisches Datum darstellt"
 * }
 * @min 0
 */
export type DateNumeric = DateNominal & number;

/**
 * A string that represents a URL.
 * Named SURL (String URL) so it's not confused with the URL object type.
 *
 * @title {
 *  en: "Web URL",
 *  de: "Webadresse"
 * }
 * @description {
 *  en: "An address to a web resource",
 *  de: "Adresse zu einer Webressource"
 * }
 * @format url
 */
export type SURL = string;

/**
 * An email address
 *
 * @title {
 *  en: "Email",
 *  de: "E-Mail"
 * }
 * @description {
 *  en: "Email address",
 *  de: "E-Mail-Adresse"
 * }
 * @format email
 * @minLength 3
 * @maxLength 64
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
 * @title {
 *  en: "IPv4",
 *  de: "IPv4"
 * }
 * @description {
 *  en: "A version 4 internet protocol (IP) address",
 *  de: "Eine Internetprotokoll-Version 4 (IPv4)-Adresse"
 * }
 * @format ipv4
 * @minLength 8
 * @maxLength 34
 */
export type IPv4 = string;

/**
 * An IP version 6 address.
 *
 * @title {
 *  en: "IPv6",
 *  de: "IPv6"
 * }
 * @description {
 *  en: "A version 6 internet protocol (IP) address",
 *  de: "Eine Internetprotokoll-Version 6 (IPv6)-Adresse"
 * }
 * @format ipv6
 * @minLength 8
 * @maxLength 34
 */
export type IPv6 = string;

/**
 * An IP address.
 *
 * @title {
 *  en: "IP Address",
 *  de: "IP-Adresse"
 * }
 * @description {
 *  en: "A version 4 or 6 internet protocol (IP) address",
 *  de: "Eine Internetprotokoll-Version 4 oder 6 (IPv4 oder IPv6)-Adresse"
 * }
 */
export type IP = IPv4 | IPv6;
