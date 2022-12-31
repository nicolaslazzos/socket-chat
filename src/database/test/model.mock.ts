export abstract class ModelMock<T> {
  protected abstract stub: T & { toEntity: () => T; };

  then: (callback: (result: T | T[]) => T | T[]) => T | T[];

  create(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback(this.stub);
    return this;
  }

  find(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback([this.stub]);
    return this;
  }

  findOne(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback(this.stub);
    return this;
  }

  findById(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback(this.stub);
    return this;
  }

  findByIdAndUpdate(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback(this.stub);
    return this;
  }

  findOneAndUpdate(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback(this.stub);
    return this;
  }

  updateOne(): ModelMock<T> {
    return this;
  }

  updateMany(): ModelMock<T> {
    return this;
  }

  insertMany(): ModelMock<T> {
    this.then = (callback: (result: T | T[]) => T | T[]) => callback([this.stub]);
    return this;
  }

  select(): ModelMock<T> {
    return this;
  }

  populate(): ModelMock<T> {
    return this;
  }

  sort(): ModelMock<T> {
    return this;
  }

  limit(): ModelMock<T> {
    return this;
  }

  skip(): ModelMock<T> {
    return this;
  }
}