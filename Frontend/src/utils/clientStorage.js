const isBrowser = typeof window !== 'undefined';

const getSessionStorage = () => {
  if (!isBrowser) return null;
  return window.sessionStorage;
};

export const getSessionItem = (key) => {
  const storage = getSessionStorage();
  return storage ? storage.getItem(key) : null;
};

export const setSessionItem = (key, value) => {
  const storage = getSessionStorage();
  if (storage) {
    storage.setItem(key, value);
  }
};

export const removeSessionItem = (key) => {
  const storage = getSessionStorage();
  if (storage) {
    storage.removeItem(key);
  }
};

export const getCookieValue = (name) => {
  if (!isBrowser) return null;
  const encodedName = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const match = cookies.find((cookie) => cookie.startsWith(encodedName));
  if (!match) return null;
  return decodeURIComponent(match.slice(encodedName.length));
};

export const setSessionCookie = (name, value) => {
  if (!isBrowser) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; SameSite=Strict${secure}`;
};

export const removeCookie = (name) => {
  if (!isBrowser) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Strict${secure}`;
};

export const clearAuthSession = () => {
  removeCookie('auth_token');
  removeSessionItem('currentUser');
  removeSessionItem('isLoggedIn');
  removeSessionItem('exchangeRate');
};

