-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Bairro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "polygon" JSONB,
    "adminId" INTEGER,
    CONSTRAINT "Bairro_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Marker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UsuariosPorBairro" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UsuariosPorBairro_A_fkey" FOREIGN KEY ("A") REFERENCES "Bairro" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UsuariosPorBairro_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bairro_adminId_key" ON "Bairro"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Bairro_name_cidade_key" ON "Bairro"("name", "cidade");

-- CreateIndex
CREATE UNIQUE INDEX "_UsuariosPorBairro_AB_unique" ON "_UsuariosPorBairro"("A", "B");

-- CreateIndex
CREATE INDEX "_UsuariosPorBairro_B_index" ON "_UsuariosPorBairro"("B");
