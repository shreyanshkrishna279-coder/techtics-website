import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const AGREEMENTS_DIR = join(__dirname, 'agreements');
if (!existsSync(AGREEMENTS_DIR)) mkdirSync(AGREEMENTS_DIR, { recursive: true });

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

function storeAgreement(type, data) {
  const filename = `${type}-${Date.now()}.json`;
  const filepath = join(AGREEMENTS_DIR, filename);
  writeFileSync(filepath, JSON.stringify({ ...data, agreedAt: new Date().toISOString() }, null, 2));
  return filename;
}

app.post('/api/client-form', async (req, res) => {
  try {
    const { name, contact, businessName, businessDetails, services } = req.body;
    const html = `
      <h2>New Client Registration</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Business Details:</strong> ${businessDetails}</p>
      <p><strong>Services Requested:</strong> ${services?.join(', ') || 'Not specified'}</p>
    `;
    await sendEmail({ subject: `New Client Registration - ${businessName}`, html });
    res.json({ success: true });
  } catch (err) {
    console.error('Client form error:', err);
    res.json({ success: true, warning: 'Form received but email notification failed' });
  }
});

app.post('/api/developer-form', async (req, res) => {
  try {
    const { name, yearsOfExperience, specialties } = req.body;
    const html = `
      <h2>New Developer Registration</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Years of Experience:</strong> ${yearsOfExperience}</p>
      <p><strong>Specialties:</strong> ${specialties?.join(', ') || 'Not specified'}</p>
    `;
    await sendEmail({ subject: `New Developer Registration - ${name}`, html });
    res.json({ success: true });
  } catch (err) {
    console.error('Developer form error:', err);
    res.json({ success: true, warning: 'Form received but email notification failed' });
  }
});

app.post('/api/client-agreement', async (req, res) => {
  try {
    const { name, contact, businessName } = req.body;
    const record = { type: 'client', ...req.body };
    const filename = storeAgreement('client', record);

    const html = `
      <h2>Client Agreement Signed</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Agreed At:</strong> ${new Date().toISOString()}</p>
      <p><strong>Reference:</strong> ${filename}</p>
    `;
    await sendEmail({ subject: `Client Agreement Signed - ${businessName}`, html });
    res.json({ success: true, reference: filename });
  } catch (err) {
    console.error('Client agreement error:', err);
    res.json({ success: true, reference: null, warning: 'Agreement stored but email failed' });
  }
});

app.post('/api/developer-agreement', async (req, res) => {
  try {
    const { name, yearsOfExperience, specialties } = req.body;
    const record = { type: 'developer', ...req.body };
    const filename = storeAgreement('developer', record);

    const html = `
      <h2>Developer Agreement Signed</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Years of Experience:</strong> ${yearsOfExperience}</p>
      <p><strong>Specialties:</strong> ${specialties?.join(', ') || 'Not specified'}</p>
      <p><strong>Agreed At:</strong> ${new Date().toISOString()}</p>
      <p><strong>Reference:</strong> ${filename}</p>
    `;
    await sendEmail({ subject: `Developer Agreement Signed - ${name}`, html });
    res.json({ success: true, reference: filename });
  } catch (err) {
    console.error('Developer agreement error:', err);
    res.json({ success: true, reference: null, warning: 'Agreement stored but email failed' });
  }
});

app.listen(PORT, () => {
  console.log(`TechTics backend running on http://localhost:${PORT}`);
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.log('[INFO] GMAIL_APP_PASSWORD not set — emails will be skipped. Forms and agreements still work.');
  }
});
