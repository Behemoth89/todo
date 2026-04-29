import { NextRequest, NextResponse } from 'next/server';
import yaml from 'yamljs';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  const swaggerFilePath = path.join(process.cwd(), 'swagger.yaml');

  if (!fs.existsSync(swaggerFilePath)) {
    return new NextResponse('Swagger file not found', { status: 404 });
  }

  const swaggerDocument = yaml.load(swaggerFilePath);
  return NextResponse.json(swaggerDocument);
}
