import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseDatesEntity } from '../base/base.entity';
import { SnapshotUserInfoEntity } from './snapshot-user-info.entity';

const Name = 'users';
const UniqueFields = ['walletAddress', 'xUserName'];

@Entity(Name)
@Unique(UniqueFields)
export class UserEntity extends BaseDatesEntity {
  @Column()
  walletAddress: string;

  @Column()
  xUserName: string;

  @Column({ type: 'boolean', default: false })
  existsXTweet: boolean;

  @Column()
  registrationSignature: string;

  @OneToMany(() => SnapshotUserInfoEntity, (e) => e.user)
  snapshotsDetails: SnapshotUserInfoEntity[];

  static Name = Name;
  static UniqueFields = UniqueFields;
}
