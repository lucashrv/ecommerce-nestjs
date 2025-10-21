import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    password: string;

    @Column({ enum: ["admin", "customer"], default: "customer" })
    role: string;

    @Column()
    image: string;

    @Column()
    email_verified: boolean;

    @Column({ default: true })
    is_active: boolean;
}
