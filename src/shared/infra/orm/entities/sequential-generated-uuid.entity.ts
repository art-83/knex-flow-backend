import { PrimaryColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export abstract class SequentialGeneratedUUID {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  private generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
