import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Table2 } from './table-2-table-with-a-join-column.entity';
import { Table3 } from './table-3-many-to-many-table.entity';

@Entity()
export class Table1 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @OneToMany(() => Table2, table2 => table2.table1)
  table2s: Table2[];

  @OneToMany(() => Table3, table3 => table3.table1)
  table3s: Table3[];
}

export default Table1;
