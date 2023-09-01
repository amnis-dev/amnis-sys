export const en = {
  /**
   * Core data types.
   */
  'core:state:uid': 'UID',
  'core:state:uid_desc': 'Unique identifier for referencing data.',
  'core:state:uidlist': 'UID List',
  'core:state:uidlist_desc': 'List of unique data identifiers.',
  'core:state:uidtree': 'UID Tree',
  'core:state:uidtree_desc': 'List of unique data identifiers linked in a tree fashion.',
  'core:state:datejson': 'JSON Date',
  'core:state:datejson_desc': 'A string that represents a JSON Date.',
  'core:state:email': 'Email',
  'core:state:email_desc': 'Email address.',
  'core:state:surl': 'Web URL',
  'core:state:surl_desc': 'An address to a web resource.',
  'core:state:datenumeric': 'Numeric Date',
  'core:state:datenumeric_desc': 'A string that represents a Numeric Date.',
  'core:state:ipv6': 'IP v6',
  'core:state:ipv6_desc': 'A version 6 internet protocol (IP) address.',
  'core:state:ipv4': 'IP v4',
  'core:state:ipv4_desc': 'A version 4 internet protocol (IP) address.',
  'core:state:ip': 'IP Address',
  'core:state:ip_desc': 'A version 4 or 6 internet protocol (IP) address.',

  /**
   * System entity
   */
  'core:state:system:name': 'Name',
  'core:state:system:name_desc': 'Name of the system.',
  'core:state:system:handle': 'Handle',
  'core:state:system:handle_desc': 'Helps identifies system created resources.',
  'core:state:system:domain': 'Domain',
  'core:state:system:domain_desc': 'Domain name of the system.',
  'core:state:system:cors': 'CORS Origins',
  'core:state:system:cors_desc': 'Allowed CORS origins.',
  'core:state:system:sessionKey': 'Session Reference Key',
  'core:state:system:sessionKey_desc': 'The name that references the session key used to maintain authentication.',
  'core:state:system:sessionExpires': 'Session Expiration',
  'core:state:system:sessionExpires_desc': 'Number in minutes that an authentication session should live.',
  'core:state:system:bearerExpires': 'Bearer Expiration',
  'core:state:system:bearerExpires_desc': 'Number in minutes that a bearer token should live.',
  'core:state:system:challengeExpiration': 'Challenge Expiration',
  'core:state:system:challengeExpiration_desc': 'Number in minutes that a challenge should live.',
  'core:state:system:otpExpiration': 'OTP Expiration',
  'core:state:system:otpExpiration_desc': 'Number in minutes that an one-time password (OTP) should live.',
  'core:state:system:otpLength': 'OTP Length',
  'core:state:system:otpLength_desc': 'Number of characters in an one-time password (OTP).',
  'core:state:system:registrationOpen': 'Registration Open',
  'core:state:system:registrationOpen_desc': 'If enabled, registration is open to the public.',
  'core:state:system:emailNews': 'News Email Address',
  'core:state:system:emailNews_desc': 'The FROM email address when sending news related content.',
  'core:state:system:emailNotify': 'Notify Email Address',
  'core:state:system:emailNotify_desc': 'The FROM email address when sending notifications.',
  'core:state:system:emailAuth': 'Auth Email Address',
  'core:state:system:emailAuth_desc': 'The FROM email address when sending authentication related information.',
  'core:state:system:fileSizeMax': 'Maximum File Size',
  'core:state:system:fileSizeMax_desc': 'Maximum file size in kilobytes.',
  'core:state:system:languages': 'Languages',
  'core:state:system:languages_desc': 'List of languages supported by the system. The first item is the default.',
  'core:state:system:$adminRole': 'Administrator Role',
  'core:state:system:$adminRole_desc': 'The role that has the most permissive access.',
  'core:state:system:$execRole': 'Executive Role',
  'core:state:system:$execRole_desc': 'The role that has the second most permissive access.',
  'core:state:system:$anonymousRole': 'Anonymous Role',
  'core:state:system:$anonymousRole_desc': 'The role that has minimal access as an unauthenticated client.',
  'core:state:system:$initialRoles': 'Initial Roles',
  'core:state:system:$initialRoles_desc': 'The roles that are applied whenever a new account is registered.',

  /**
   * Contact entity
   */
  'core:state:contact:name': 'Name',
  'core:state:contact:name_desc': 'Name (or title) of the contact',
  'core:state:contact:description': 'Description',
  'core:state:contact:description_desc': 'Details about the contact.',
  'core:state:contact:phones': 'Phone Numbers',
  'core:state:contact:phones_desc': 'First item is the primary phone number.',
  'core:state:contact:emails': 'Emails',
  'core:state:contact:emails_desc': 'First item is the primary email.',
  'core:state:contact:socials': 'Social Networks',
  'core:state:contact:socials_desc': 'Links to the social networking platform.',

  /**
   * Role Instances
   */
  'core:instance:role:admin_name': 'Administrator',
  'core:instance:role:admin_desc': 'Most permissive role for overall system configuration and maintenance.',
  'core:instance:role:exec_name': 'Executive',
  'core:instance:role:exec_desc': 'Authoritative role for application configuration and maintenance.',
  'core:instance:role:anon_name': 'Anonymous',
  'core:instance:role:anon_desc': 'Permissions for accessing the application data without authentication.',
  'core:instance:role:base_name': 'Base',
  'core:instance:role:base_desc': 'Basis for standard authenticated use of the application.',
};

export default en;
