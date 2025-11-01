import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type RawBairro = {
  name?: string;
  cidade?: string;
  polygon?: any;
  properties?: any;
  geometry?: any;
};

async function main() {
  const filePath = path.join(__dirname, 'tabela-bairro.json');

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao parsear JSON:', e);
    process.exit(1);
  }

  // tabela-bairro.json pode ser um array de objetos ou um GeoJSON.
  const items: RawBairro[] = Array.isArray(parsed)
    ? parsed
    : // se for GeoJSON com features
      parsed.features || [];

  console.log(`ℹ️ Total de regiões no JSON: ${items.length}`);

  let inserted = 0;
  for (const item of items) {
    // extrai name de várias formas possíveis
    const name =
      item.name || item.properties?.name || item.properties?.NOME || item.properties?.nome;

    if (!name) {
      console.log('⚠️ Pulando entrada sem nome', item);
      continue;
    }

    // cidade pode não existir no JSON — usa valor padrão vazio
    const cidade = item.cidade ?? item.properties?.cidade ?? '';

    // polygon pode ser objeto ou string contendo JSON
    let polygon: any = item.polygon ?? item.geometry ?? item.properties?.polygon;
    if (typeof polygon === 'string') {
      try {
        polygon = JSON.parse(polygon);
      } catch (e) {
        // Se não for JSON válido, log e pular
        console.warn(`⚠️ Polygon como string inválida para ${name}, pulando.`);
        continue;
      }
    }

    try {
      await prisma.bairro.create({
        data: {
          name,
          cidade,
          polygon,
        },
      });
      console.log(`✅ Bairro inserido: ${name}`);
      inserted++;
    } catch (error: any) {
      // conflito unique (name,cidade)
      if (error?.code === 'P2002') {
        console.log(`⚠️ Bairro já existe: ${name} / ${cidade}`);
      } else {
        console.error(`❌ Erro ao inserir ${name}:`, error);
      }
    }
  }

  console.log(`🌍 Inserção de bairros concluída. Inseridos: ${inserted}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
