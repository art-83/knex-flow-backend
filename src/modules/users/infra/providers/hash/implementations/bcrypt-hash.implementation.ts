import { compare, hash } from 'bcryptjs';
import IHashProvider from '../providers/hash.provider';

class BcryptHashProvider implements IHashProvider {
  public async hash(payload: string): Promise<string> {
    return hash(payload, 10);
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BcryptHashProvider;
