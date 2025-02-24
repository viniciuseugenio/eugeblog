export function buildApiUrl(urlTemplate, params) {
  return Object.entries(params).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, value);
  }, urlTemplate);
}
