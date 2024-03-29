import { Member as MemberEntity } from '../../entities/member.entity';
import { ModelMock } from "../../../common/test/model.mock";
import { memberStub } from '../../test/member.stub';

export class Member extends ModelMock<MemberEntity> {
  protected stub = { ...memberStub(), toEntity: () => memberStub() };
}