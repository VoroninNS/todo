-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'READ');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ticket_list_id" INTEGER NOT NULL,
    "permissions" "Permission"[],

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketsLists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "TicketsLists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tickets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ticket_list_id" INTEGER NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_user_id_ticket_list_id_key" ON "Permissions"("user_id", "ticket_list_id");

-- CreateIndex
CREATE UNIQUE INDEX "TicketsLists_name_owner_id_key" ON "TicketsLists"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_name_ticket_list_id_key" ON "Tickets"("name", "ticket_list_id");

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_ticket_list_id_fkey" FOREIGN KEY ("ticket_list_id") REFERENCES "TicketsLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketsLists" ADD CONSTRAINT "TicketsLists_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_ticket_list_id_fkey" FOREIGN KEY ("ticket_list_id") REFERENCES "TicketsLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
