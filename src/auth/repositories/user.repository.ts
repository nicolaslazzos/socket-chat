import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  public abstract create(dto: AuthCredentialsDto): Promise<void>;
  public abstract findByUsername(username: string): Promise<User>;
}
