import { BeforeInsert, CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

abstract class BaseEntitySequentialGeneratedUUID {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @BeforeInsert()
  private generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
export { BaseEntitySequentialGeneratedUUID };
