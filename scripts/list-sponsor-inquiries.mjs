#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const inquiriesFile = path.join(process.cwd(), '.data', 'sponsor-inquiries.json');

const args = process.argv.slice(2);
const statusFilter = args.find((arg) => arg.startsWith('--status='))?.split('=')[1];
const updateArg = args.find((arg) => arg.startsWith('--update='))?.split('=')[1];
const setStatus = args.find((arg) => arg.startsWith('--set-status='))?.split('=')[1];

async function readInquiries() {
  try {
    const raw = await fs.readFile(inquiriesFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeInquiries(inquiries) {
  await fs.mkdir(path.dirname(inquiriesFile), { recursive: true });
  await fs.writeFile(inquiriesFile, JSON.stringify(inquiries, null, 2));
}

async function main() {
  let inquiries = await readInquiries();

  if (updateArg && setStatus) {
    const index = inquiries.findIndex((item) => item.id === updateArg);
    if (index === -1) {
      console.error(`Inquiry not found: ${updateArg}`);
      process.exit(1);
    }
    inquiries[index].status = setStatus;
    await writeInquiries(inquiries);
    console.log(`Updated ${updateArg} → ${setStatus}`);
    return;
  }

  if (statusFilter) {
    inquiries = inquiries.filter((item) => item.status === statusFilter);
  }

  inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (inquiries.length === 0) {
    console.log('No sponsor inquiries found.');
    return;
  }

  for (const inquiry of inquiries) {
    console.log('---');
    console.log(`ID:       ${inquiry.id}`);
    console.log(`Status:   ${inquiry.status}`);
    console.log(`Created:  ${inquiry.createdAt}`);
    console.log(`Company:  ${inquiry.companyName}`);
    console.log(`Contact:  ${inquiry.contactName} <${inquiry.email}>`);
    console.log(`Package:  ${inquiry.packageId}`);
    console.log(`Website:  ${inquiry.website ?? '—'}`);
    console.log(`Budget:   ${inquiry.budget ?? '—'}`);
    console.log(`Message:  ${inquiry.message}`);
  }

  console.log('---');
  console.log(`Total: ${inquiries.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
