const { VITE_GITHUB_CLIENT_ID, VITE_BASE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID } =
  import.meta.env;

export function buildApiUrl(urlTemplate, params) {
  return Object.entries(params).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, value);
  }, urlTemplate);
}

export function openGoogleLoginPage() {
  const next_url = new URLSearchParams(window.location.search).get("next");
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirectUri = "api/accounts/login/google/";

  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const params = {
    response_type: "code",
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${VITE_BASE_BACKEND_URL}/${redirectUri}`,
    prompt: "select_account",
    scope,
  };

  const urlParams = new URLSearchParams(params).toString();
  const url = `${googleAuthUrl}?${urlParams}`;
  const urlWithNext = next_url ? `${url}&state=${next_url}` : url;
  window.location = urlWithNext;
}

export function openGitLoginPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}`;

  const fullRedirectUrl = next ? `${redirectUrl}&state=${next}` : redirectUrl;
  window.location = fullRedirectUrl;
}
