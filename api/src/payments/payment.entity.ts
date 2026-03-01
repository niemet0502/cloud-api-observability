import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type PaymentStatus = 'success' | 'declined' | 'error';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column('float')
  amountEur: number;

  @Column({ nullable: true })
  method?: string;

  @Column({ type: 'varchar', length: 16 })
  status: PaymentStatus;

  @CreateDateColumn()
  processedAt: Date;
}

