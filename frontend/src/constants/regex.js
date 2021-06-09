export const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,})$/;
export const NAME_REGEX = /[A-Za-ząčęėįšųūž]+$/;
export const FILENAME_WITHOUT_EXTENSION_REGEX = /(.*)\.[^.]+/;
