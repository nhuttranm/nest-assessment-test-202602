import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPairsTable1707734400000 implements MigrationInterface {
    name = 'CreateUserPairsTable1707734400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`user_pairs\` (
                \`id\` char(36) NOT NULL,
                \`id1\` char(36) NOT NULL,
                \`id2\` char(36) NOT NULL,
                \`userID\` char(36) NOT NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE INDEX \`id1_id2_uniq_idx\` (\`id1\`, \`id2\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_pairs\``);
    }
}