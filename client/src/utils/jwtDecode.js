/**
 * Lightweight JWT decoder (no validation — for reading payload only).
 * Never use for security checks; validation happens server-side.
 * @param {string} token
 * @returns {Object} decoded payload
 */
export const jwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return {};
  }
};
