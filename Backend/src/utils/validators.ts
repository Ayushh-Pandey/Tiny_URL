import validator from 'validator';

export const isValidUrl = (u: string) => {
  return validator.isURL(u, { require_protocol: true });
};

export const isValidCode = (c: string) => /^[A-Za-z0-9]{6,8}$/.test(c);
