import { Resend } from 'resend';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

const webReport = fs.existsSync('NATTRAPPORT.md')
  ? fs.readFileSync('NATTRAPPORT.md', 'utf-8')
  : 'Ingen web-rapport funnet.';

const mobileReport = fs.existsSync('NATTRAPPORT_MOBIL.md')
  ? fs.readFileSync('NATTRAPPORT_MOBIL.md', 'utf-8')
  : 'Ingen mobil-rapport funnet.';

const today = new Date().toLocaleDateString('nb-NO', {
  day: 'numeric', month: 'long', year: 'numeric'
});

const { error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'adrian.sandstrand@gmail.com',
  subject: `Levd.ai nattrapport ${today}`,
  text: [
    'GOD MORGEN ADRIAN',
    '',
    'Her er hva Clawdbot bygde i natt.',
    '',
    '=== WEB-BACKEND ===',
    webReport,
    '',
    '=== MOBILAPP ===',
    mobileReport,
  ].join('\n'),
});

if (error) {
  console.error('Feil:', error);
  process.exit(1);
}

console.log('Morgenrapport sendt til adrian.sandstrand@gmail.com');
