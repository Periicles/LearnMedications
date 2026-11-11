const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  email_not_confirmed: "Confirmez votre adresse e-mail avant de vous connecter.",
  user_already_exists: "Un compte existe déjà avec cette adresse e-mail.",
  email_exists: "Un compte existe déjà avec cette adresse e-mail.",
  weak_password: "Ce mot de passe est trop faible.",
  same_password: "Le nouveau mot de passe doit être différent de l'ancien.",
  over_email_send_rate_limit: "Trop d'e-mails envoyés. Réessayez dans quelques minutes.",
  over_request_rate_limit: "Trop de tentatives. Réessayez dans quelques minutes.",
  signup_disabled: "Les inscriptions sont momentanément fermées.",
};

const FALLBACK_MESSAGE = "Une erreur est survenue. Réessayez dans un instant.";

export function describeAuthError(code: string | undefined): string {
  return (code && AUTH_ERROR_MESSAGES[code]) || FALLBACK_MESSAGE;
}
