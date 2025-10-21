import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "string", length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    password: string;

    @Column({
        enum: ["admin", "customer"],
        default: "customer",
        nullable: false,
    })
    role: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: new Date() })
    updatedAt: Date;

    @Column({ default: new Date() })
    createdAt: Date;
}
