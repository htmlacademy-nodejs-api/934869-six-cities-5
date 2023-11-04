import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';

import { createSHA256 } from '../../helpers/hash.js';
import { User, UserType } from '../../types/index.js';
import { OfferEntity } from '../offer/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'user'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    default: '',
  })
  public name: string;

  @prop({
    required: true,
    unique: true,
  })
  public email: string;

  @prop({
    required: false,
    default: 'avatar-max.jpg'
  })
  public avatarPath: string;

  @prop({
    type: () => String,
    enum: UserType,
    require: true
  })
  public userType: UserType;

  @prop({
    required: true,
    default: ''
  })
  private password?: string;

  @prop({
    required: true,
    ref: 'OfferEntity',
    default: [],
  })
  public favorites: Ref<OfferEntity | null>[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashedPassword = createSHA256(password, salt);
    return hashedPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);

