import * as crypto from 'crypto';
import { SHA_512_HASH } from '../config/env.config';

export const hashUtils = {
  hash(plainText: string) {
    const hash = crypto.createHash('sha512');
    return hash.update(`${plainText}${SHA_512_HASH}`).digest('hex');
  },
  compare(hashed: string, hash: string) {
    return hashed === hash;
  },
};
