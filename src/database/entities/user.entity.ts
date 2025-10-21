import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ unique: true, nullable: false })
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
}
