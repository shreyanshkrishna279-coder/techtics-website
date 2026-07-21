import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGREEMENTS_DIR = process.env.NETLIFY ? '/tmp/agreements' : join(__dirname, '..', '..', 'agreements');

function storeAgreement(type, data) {
  if (!existsSync(AGREEMENTS_DIR)) mkdirSync(AGREEMENTS_DIR, { recursive: true });
  const filename = `${type}-${Date.now()}.json`;
  const filepath = join(AGREEMENTS_DIR, filename);
  writeFileSync(filepath, JSON.stringify({ ...data, agreedAt: new Date().toISOString() }, null, 2));
  return filename;
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const { path, httpMethod, body } = event;

  if (httpMethod === 'OPTIONS') return respond(204, '');

  if (httpMethod !== 'POST') return respond(405, { success: false, error: 'Method not allowed' });

  let data;
  try {
    data = JSON.parse(body || '{}');
  } catch {
    return respond(400, { success: false, error: 'Invalid JSON' });
  }

  try {
    if (path.endsWith('/api/client-form')) {
      const { name, contact, businessName, businessDetails, services } = data;
      if (!name || !contact || !businessName) return respond(400, { success: false, error: 'Missing required fields' });
      return respond(200, { success: true });
    }

    if (path.endsWith('/api/developer-form')) {
      const { name, yearsOfExperience } = data;
      if (!name || !yearsOfExperience) return respond(400, { success: false, error: 'Missing required fields' });
      return respond(200, { success: true });
    }

    if (path.endsWith('/api/client-agreement')) {
      if (!data.name) return respond(400, { success: false, error: 'Missing required fields' });
      const filename = storeAgreement('client', data);
      return respond(200, { success: true, reference: filename });
    }

    if (path.endsWith('/api/developer-agreement')) {
      if (!data.name) return respond(400, { success: false, error: 'Missing required fields' });
      const filename = storeAgreement('developer', data);
      return respond(200, { success: true, reference: filename });
    }

    return respond(404, { success: false, error: 'Not found' });
  } catch (err) {
    console.error('API error:', err);
    return respond(500, { success: false, error: 'Internal server error' });
  }
}
