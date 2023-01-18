import { Message as MessageEntity } from '../../entities/message.entity';
import { ModelMock } from "../../../common/test/model.mock";
import { messageStub } from '../../test/message.stub';

export class Message extends ModelMock<MessageEntity> {
  protected stub = { ...messageStub(), toEntity: () => messageStub() };
}