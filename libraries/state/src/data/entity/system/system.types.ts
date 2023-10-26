/* eslint-disable max-len */
import type { RoleID } from '../role/role.types.js';
import type {
  Email, SURL,
} from '../../../core/core.types.js';
import type { HandleName } from '../handle/handle.types.js';
import type {
  Data,
  DataMeta,
  DataMinimal,
  DataRoot,
} from '../../data.types.js';

/**
 * System entity.
 *
 * @title {
 *  en: "System",
 *  de: "System",
 *  es: "Sistema",
 * }
 * @description {
 *  en: "Essential system-wide behaviors and settings",
 *  de: "Wesentliche systemweite Verhaltensweisen und Einstellungen",
 *  es: "Comportamientos y configuraciones esenciales en todo el sistema",
 * }
 */
export interface System extends Data {
  /**
   * Name of the system.
   *
   * @title {
   *  en: "Name",
   *  de: "Name",
   *  es: "Nombre",
   * }
   * @description {
   *  en: "The name of the system",
   *  de: "Der Name des Systems",
   *  es: "El nombre del sistema",
   * }
   * @minLength 1
   * @maxLength 32
   */
  name: string;

  /**
   * System handle for identifying system created resources.
   *
   * @title {
   *  en: "Handle",
   *  de: "Handle",
   *  es: "Manija",
   * }
   * @description {
   *  en: "Identifies system created resources",
   *  de: "Identifiziert vom System erstellte Ressourcen",
   *  es: "Identifica los recursos creados por el sistema",
   * }
   */
  handle: HandleName;

  /**
   * Domain name of the system.
   *
   * @title {
   *  en: "Domain",
   *  de: "Domain",
   *  es: "Dominio",
   * }
   * @description {
   *  en: "Domain name of the system",
   *  de: "Domänenname des Systems",
   *  es: "Nombre de dominio del sistema",
   * }
   * @format hostname
   */
  domain: string;

  /**
   * Allowed CORS origins.
   *
   * @title {
   *  en: "CORS Origins",
   *  de: "CORS-Originale",
   *  es: "Orígenes CORS",
   * }
   * @description {
   *  en: "Allowed URLs for cross-origin resource sharing",
   *  de: "Zulässige URLs für das Cross-Origin-Ressourcen-Sharing",
   *  es: "URL permitidas para el intercambio de recursos entre orígenes",
   * }
   * @uniqueItems true
   */
  cors: SURL[];

  /**
   * Name of the session key.
   *
   * @title {
   *  en: "Session Reference Key",
   *  de: "Sitzungs-Referenzschlüssel",
   *  es: "Clave de referencia de sesión",
   * }
   * @description {
   *  en: "The name that references the session key used to maintain authentication",
   *  de: "Der Name, der den zur Authentifizierung verwendeten Sitzungsschlüssel referenziert",
   *  es: "El nombre que referencia la clave de sesión utilizada para mantener la autenticación",
   * }
   * @format variable
   * @minLength 1
   * @maxLength 32
   */
  sessionKey: string;

  /**
   * Number in minutes that an authentication session should live.
   *
   * @title {
   *  en: "Session Expiration",
   *  de: "Sitzungsablauf",
   *  es: "Expiración de sesión"
   * }
   * @description {
   *  en: "Number in minutes that an authentication session should live",
   *  de: "Anzahl in Minuten, wie lange eine Authentifizierungssitzung aktiv bleiben sollte",
   *  es: "Número en minutos que debe vivir una sesión de autenticación",
   * }
   * @minimum 1
   * @maximum 20160
   */
  sessionExpires: number;

  /**
   * Number in minutes that a bearer token should live.
   *
   * @title {
   *  en: "Bearer Expiration",
   *  de: "Bearer-Ablauf",
   *  es: "Expiración de portador",
   * }
   * @description {
   *  en: "Number in minutes that a bearer token should live",
   *  de: "Anzahl in Minuten, wie lange ein Bearer-Token aktiv bleiben sollte",
   *  es: "Número en minutos que debe vivir un token de portador",
   * }
   * @minimum 1
   * @maximum 20160
   */
  bearerExpires: number;

  /**
   * Expiration of a challenge code in minutes.
   *
   * @title {
   *  en: "Challenge Expiration",
   *  de: "Ablauf der Herausforderung",
   *  es: "Expiración del desafío",
   * }
   * @description {
   *  en: "Number in minutes that a challenge should live",
   *  de: "Anzahl in Minuten, wie lange eine Herausforderung aktiv bleiben sollte",
   *  es: "Número en minutos que debe vivir un desafío",
   * }
   * @minimum 1
   * @maximum 60
   */
  challengeExpiration: number;

  /**
   * Expiration of a One-time password in minutes.
   *
   * @title {
   *  en: "OTP Expiration",
   *  de: "Ablauf des Einmalpassworts (OTP)",
   *  es: "Expiración de la contraseña de un solo uso (OTP)"
   * }
   * @description {
   *  en: "Number in minutes that an one-time password (OTP) should live",
   *  de: "Anzahl in Minuten, wie lange ein Einmalpasswort (OTP) aktiv bleiben sollte",
   *  es: "Número en minutos que debe vivir una contraseña de un solo uso (OTP)",
   * }
   * @minimum 1
   * @maximum 60
   */
  otpExpiration: number;

  /**
   * Character length of one-time passwords.
   *
   * @title {
   *  en: "OTP Length",
   *  de: "OTP-Länge"
   * }
   * @description {
   *  en: "Number of characters in an one-time password (OTP)",
   *  de: "Anzahl der Zeichen in einem Einmalpasswort (OTP)",
   *  es: "Número de caracteres en una contraseña de un solo uso (OTP)",
   * }
   * @minimum 1
   * @maximum 32
   */
  otpLength: number;

  /**
   * Open registration to anonymous users. Otherwise, only executives and
   * admins can initialize a registration for a new client.
   *
   * @title {
   *  en: "Registration Open",
   *  de: "Registrierung geöffnet",
   *  es: "Registro abierto"
   * }
   * @description {
   *  en: "If enabled, registration is open to the public",
   *  de: "Wenn aktiviert, ist die Registrierung für die Öffentlichkeit zugänglich",
   *  es: "Si está habilitado, el registro está abierto al público",
   * }
   */
  registrationOpen: boolean;

  /**
   * The sender email address for news.
   *
   * @title {
   *  en: "News Email Address",
   *  de: "E-Mail-Adresse für Nachrichten",
   *  es: "Dirección de correo electrónico de noticias"
   * }
   * @description {
   *  en: "The FROM email address when sending news related content",
   *  de: "Die Absender-E-Mail-Adresse beim Senden von nachrichtenbezogenem Inhalt",
   *  es: "La dirección de correo electrónico DE cuando se envía contenido relacionado con noticias",
   * }
   */
  emailNews: Email;

  /**
   * The sender email address for system notifications.
   *
   * @title {
   *  en: "Notify Email Address",
   *  de: "E-Mail-Adresse für Benachrichtigungen",
   *  es: "Dirección de correo electrónico de notificación"
   * }
   * @description {
   *  en: "The FROM email address when sending notifications",
   *  de: "Die Absender-E-Mail-Adresse beim Senden von Benachrichtigungen",
   *  es: "La dirección de correo electrónico DE cuando se envían notificaciones",
   * }
   */
  emailNotify: Email;

  /**
   * The sender email address for authentication tasks.
   *
   * @title {
   *  en: "Auth Email Address",
   *  de: "E-Mail-Adresse für Authentifizierung",
   *  es: "Dirección de correo electrónico de autenticación"
   * }
   * @description {
   *  en: "The FROM email address when sending authentication related information",
   *  de: "Die Absender-E-Mail-Adresse beim Senden von Authentifizierungsbezogenen Informationen",
   *  es: "La dirección de correo electrónico DE cuando se envía información relacionada con la autenticación",
   * }
   */
  emailAuth: Email;

  /**
   * Overall maximum file size that can be uploaded in kilobytes.
   * Individual roles can have their own limits.
   *
   * @title {
   *  en: "Maximum File Size",
   *  de: "Maximale Dateigröße",
   *  es: "Tamaño máximo de archivo",
   * }
   * @description {
   *  en: "Maximum file size in kilobytes",
   *  de: "Maximale Dateigröße in Kilobyte",
   *  es: "Tamaño máximo de archivo en kilobytes",
   * }
   * @minimum 1
   * @maximum 8388608
   */
  fileSizeMax: number;

  /**
   * If the system's server is behind a trusted proxy, this flag should be enabled to forwarded the IP address.
   *
   * @title {
   *  en: "Proxy Trust",
   *  de: "Proxy-Vertrauen",
   *  es: "Confianza del proxy"
   * }
   * @description {
   *  en: "If the system's server is behind a trusted proxy, this flag should be enabled to use the forwarded the IP address",
   *  de: "Wenn der Server des Systems hinter einem vertrauenswürdigen Proxy liegt, sollte diese Flagge aktiviert werden, um die weitergeleitete IP-Adresse zu verwenden",
   *  es: "Si el servidor del sistema está detrás de un proxy de confianza, esta bandera debe habilitarse para usar la dirección IP reenviada",
   * }
   */
  proxyTrust?: boolean;

  /**
   * Supported language coded for the system.
   *
   * @title {
   *  en: "Languages",
   *  de: "Sprachen",
   *  es: "Idiomas"
   * }
   * @description {
   *  en: "List of language codes supported by the system. The first item is the default",
   *  de: "Liste der vom System unterstützten Sprachcodes. Der erste Eintrag ist der Standard",
   *  es: "Lista de códigos de idioma admitidos por el sistema. El primer elemento es el predeterminado",
   * }
   * @minItems 1
   * @maxItems 32
   * @uniqueItems true
   */
  languages: string[];

  /**
   * Role to be considered an administrator.
   * Administrators have complete control.
   *
   * @title {
   *  en: "Administrator Role",
   *  de: "Administratorrolle",
   *  es: "Rol de administrador"
   * }
   * @description {
   *  en: "Users with this role will be considered an administrator with complete control",
   *  de: "Benutzer mit dieser Rolle werden als Administrator mit vollständiger Kontrolle betrachtet",
   *  es: "Los usuarios con este rol serán considerados administradores con control total",
   * }
   */
  $adminRole: RoleID;

  /**
   * Role to be considered an executive.
   * Executives have second-highest control over a system, just under administrators.
   *
   * @title {
   *  en: "Executive Role",
   *  de: "Führungskräfterolle",
   *  es: "Rol ejecutivo",
   * }
   * @description {
   *  en: "Users with this role will be considered an executive with privileged control over a system, just under administrators",
   *  de: "Benutzer mit dieser Rolle werden als Führungskräfte mit privilegierter Kontrolle über ein System betrachtet, direkt unter Administratoren",
   *  es: "Los usuarios con este rol serán considerados ejecutivos con control privilegiado sobre un sistema, justo debajo de los administradores",
   * }
   */
  $execRole: RoleID;

  /**
   * Anonymous access permissions.
   * These are roles used when no authorization is provided by the client.
   *
   * @title {
   *  en: "Anonymous Role",
   *  de: "Anonyme Rolle",
   *  es: "Rol anónimo",
   * }
   * @description {
   *  en: "This role is used when no authentication is provided by the client",
   *  de: "Diese Rolle wird verwendet, wenn kein Authentifizierung durch den Client bereitgestellt wird",
   *  es: "Este rol se utiliza cuando el cliente no proporciona autenticación",
   * }
   */
  $anonymousRole: RoleID;

  /**
   * The initial roles to assign to a user when a new account is created.
   *
   * @title {
   *  en: "Initial Roles",
   *  de: "Anfängliche Rollen",
   *  es: "Roles iniciales",
   * }
   * @description {
   *  en: "The roles that are applied whenever a new account is registered",
   *  de: "Die Rollen, die bei der Registrierung eines neuen Kontos zugewiesen werden",
   *  es: "Los roles que se aplican cada vez que se registra una nueva cuenta",
   * }
   * @uniqueItems true
   */
  $initialRoles: RoleID[];
}

/**
 * System properties excluding the extended entity properties.
 */
export type SystemRoot = DataRoot<System>;

/**
 * System base properties for creation.
 */
export type SystemMinimal = DataMinimal<System, 'name' | '$adminRole' | '$execRole'>;

/**
 * System collection meta data.
 */
export type SystemMeta = DataMeta<System>;
