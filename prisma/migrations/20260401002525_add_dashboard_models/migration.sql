-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "admin_user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_admin_log" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_adress" TEXT,
    "users_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_login_key" ON "admin_user"("login");

-- AddForeignKey
ALTER TABLE "audit_admin_log" ADD CONSTRAINT "audit_admin_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
