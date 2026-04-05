import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Table1 } from './table-1-simple-table.entity';
import { Table3 } from './table-3-many-to-many-table.entity';

@Entity()
export class Table2 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  name: string;

  @ManyToOne(() => Table1, table1 => table1.table2s)
  @JoinColumn({ name: 'table1_id' })
  table1: Table1;

  @OneToMany(() => Table3, table3 => table3.table2)
  table3s: Table3[];
}

export default Table2;
