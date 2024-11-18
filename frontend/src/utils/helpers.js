const { VITE_BASE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID } = import.meta.env;

export function formatDate(date) {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

export function paginationRange(
  pageRange,
  currentPage,
  totalPages,
  totalPagesDisplay = 10,
) {
  const displayLimit = Math.min(totalPagesDisplay, totalPages);

  let middle = Math.floor(totalPagesDisplay / 2);
  let start = Math.max(1, currentPage - middle);
  let end = Math.min(totalPages, currentPage + middle);

  if (currentPage <= middle) {
    end = Math.min(totalPages, displayLimit);
  } else if (currentPage + middle >= totalPages) {
    start = Math.max(1, totalPages - displayLimit + 1);
  }

  return pageRange.slice(start - 1, end);
}

export function openGoogleLoginPage() {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirectUri = "accounts/api/google/login/";

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
  window.location = `${googleAuthUrl}?${urlParams}`;
}
