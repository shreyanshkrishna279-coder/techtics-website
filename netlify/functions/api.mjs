import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGREEMENTS_DIR = process.env.NETLIFY ? '/tmp/agreements' : join(__dirname, '..', '..', 'agreements');

function storeAgreement(type, data) {
  if (!existsSync(AGREEMENTS_DIR)) mkdirSync(AGREEMENTS_DIR, { recursive: true });
  const filename = `${type}-${Date.now()}.json`;
  const filepath = join(AGREEMENTS_DIR, filename);
  writeFileSync(filepath, JSON.stringify({ ...data, agreedAt: new Date().toISOString() }, null, 2));
  return filename;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mybusyflow@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
});

async function sendEmail({ subject, html }) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn(`[WARN] GMAIL_APP_PASSWORD not set. Skipping email: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: '"TechTics Website" <mybusyflow@gmail.com>',
      to: 'mybusyflow@gmail.com',
      subject,
      html,
    });
  } catch (err) {
    console.warn(`[WARN] Email send failed (non-blocking): ${err.message}`);
  }
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
      const html = `
        <h2>New Client Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Business Details:</strong> ${businessDetails || 'Not provided'}</p>
        <p><strong>Services Requested:</strong> ${services?.join(', ') || 'Not specified'}</p>
      `;
      await sendEmail({ subject: `New Client Registration - ${businessName}`, html });
      return respond(200, { success: true });
    }

    if (path.endsWith('/api/developer-form')) {
      const { name, yearsOfExperience, specialties } = data;
      if (!name || !yearsOfExperience) return respond(400, { success: false, error: 'Missing required fields' });
      const html = `
        <h2>New Developer Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Years of Experience:</strong> ${yearsOfExperience}</p>
        <p><strong>Specialties:</strong> ${specialties?.join(', ') || 'Not specified'}</p>
      `;
      await sendEmail({ subject: `New Developer Registration - ${name}`, html });
      return respond(200, { success: true });
    }

    if (path.endsWith('/api/client-agreement')) {
      if (!data.name) return respond(400, { success: false, error: 'Missing required fields' });
      const filename = storeAgreement('client', data);
      const html = `
        <h2>Client Agreement Signed</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Contact:</strong> ${data.contact || 'Not provided'}</p>
        <p><strong>Business Name:</strong> ${data.businessName || 'Not provided'}</p>
        <p><strong>Agreed At:</strong> ${new Date().toISOString()}</p>
        <p><strong>Reference:</strong> ${filename}</p>
      `;
      await sendEmail({ subject: `Client Agreement Signed - ${data.businessName || data.name}`, html });
      return respond(200, { success: true, reference: filename });
    }

    if (path.endsWith('/api/developer-agreement')) {
      if (!data.name) return respond(400, { success: false, error: 'Missing required fields' });
      const filename = storeAgreement('developer', data);
      const html = `
        <h2>Developer Agreement Signed</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Years of Experience:</strong> ${data.yearsOfExperience || 'Not provided'}</p>
        <p><strong>Specialties:</strong> ${data.specialties?.join(', ') || 'Not specified'}</p>
        <p><strong>Agreed At:</strong> ${new Date().toISOString()}</p>
        <p><strong>Reference:</strong> ${filename}</p>
      `;
      await sendEmail({ subject: `Developer Agreement Signed - ${data.name}`, html });
      return respond(200, { success: true, reference: filename });
    }

    return respond(404, { success: false, error: 'Not found' });
  } catch (err) {
    console.error('API error:', err);
    return respond(500, { success: false, error: 'Internal server error' });
  }
}
