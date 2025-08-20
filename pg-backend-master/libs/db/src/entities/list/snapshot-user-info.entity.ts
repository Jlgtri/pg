import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserEntity } from './user.entity';

const Name = 'snapshots_users_info';
const UniqueFields = ['walletAddress', 'date'];

@Entity(Name)
@Unique(UniqueFields)
export class SnapshotUserInfoEntity extends BaseEntity {
  @Column({ nullable: true })
  userId: number;

  @Column()
  walletAddress: string;

  @Column({ type: 'timestamptz' })
  date: string;

  @Column({ type: 'numeric', nullable: true })
  totalUsdBalance: number;

  @Column({ type: 'numeric', array: true, default: [] })
  checkInStages: number[];

  @Column({ type: 'jsonb' })
  holdingDistribution: string[];

  @ManyToOne(() => UserEntity, (e) => e.snapshotsDetails)
  user: UserEntity;

  static Name = Name;
  static UniqueFields = UniqueFields;
}
