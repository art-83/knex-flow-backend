import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Table1 } from './table-1-simple-table.entity';
import { Table2 } from './table-2-table-with-a-join-column.entity';

@Entity()
export class Table3 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Table1, table1 => table1.table3s)
  @JoinColumn({ name: 'table1_id' })
  table1: Table1;

  @ManyToOne(() => Table2, table2 => table2.table3s)
  @JoinColumn({ name: 'table2_id' })
  table2: Table2;
}

export default Table3;
