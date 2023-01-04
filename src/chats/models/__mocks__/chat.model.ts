import { Chat as ChatEntity } from '../../entities/chat.entity';
import { ModelMock } from "../../../common/test/model.mock";
import { chatStub } from '../../test/chat.stub';

export class Chat extends ModelMock<ChatEntity> {
  protected stub = { ...chatStub(), toEntity: () => chatStub() };
}