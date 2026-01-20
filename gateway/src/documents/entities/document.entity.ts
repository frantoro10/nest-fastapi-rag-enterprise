import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('documents')
export class Document {
    //Decorador indica lo que va a ir en PostgreSQL (propiedad)
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ name: 'file_path', type: 'text', nullable: true })
    filePath: string; // Mapeamos 'file_path' (SQL) a 'filePath' (CamelCase en TS)

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ name: 'owner_id', type: 'uuid', nullable: true })
    ownerId: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}
