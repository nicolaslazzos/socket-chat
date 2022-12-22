import { User as UserEntity } from '../../entities/user.entity';
import { ModelMock } from "../../../database/test/model.mock";
import { userStub } from '../../test/user.stub';

export class User extends ModelMock<UserEntity> {
  protected stub = { ...userStub(), toEntity: () => userStub() };
}