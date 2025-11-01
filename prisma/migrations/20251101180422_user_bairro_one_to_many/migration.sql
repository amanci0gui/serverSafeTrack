/*
  Warnings:

  - You are about to drop the `_UsuariosPorBairro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_UsuariosPorBairro_B_index";

-- DropIndex
DROP INDEX "_UsuariosPorBairro_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UsuariosPorBairro";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "bairroId" INTEGER,
    CONSTRAINT "User_bairroId_fkey" FOREIGN KEY ("bairroId") REFERENCES "Bairro" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("active", "email", "id", "name", "password", "role") SELECT "active", "email", "id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
