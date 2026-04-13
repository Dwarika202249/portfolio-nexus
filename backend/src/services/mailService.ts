import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface MailPayload {
  name: string;
  email: string;
  phone?: string;
  brief: string;
  aiSummary: string;
}

export const mailService = {
  async sendContactEmail(payload: MailPayload) {
    const { name, email, phone, brief, aiSummary } = payload;

    try {
      const { data, error } = await resend.emails.send({
        from: 'NEXUS Concierge <onboarding@resend.dev>',
        to: ['codeweavers.dk@gmail.com'], // Using your clarified Dev account
        replyTo: email, // Direct signal callback
        subject: `[NEXUS OPPORTUNITY] ${name} // Neural Archives`,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace; background-color: #050a14; color: #00d4ff; padding: 20px; border: 1px solid #1a2e4a;">
            <h2 style="border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">INCOMING TRANSMISSION</h2>
            
            <section style="margin-bottom: 20px;">
              <p><strong>RECRUITER:</strong> ${name}</p>
              <p><strong>COORDINATES:</strong> ${email} ${phone ? `| ${phone}` : ''}</p>
            </section>

            <section style="background-color: rgba(0, 212, 255, 0.05); padding: 15px; border-left: 4px solid #00d4ff;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">AI Summary</h3>
              <p style="color: #ffffff; line-height: 1.6;">${aiSummary}</p>
            </section>

            <section style="margin-top: 20px; font-size: 12px; color: #4a5d71;">
              <p><strong>ORIGINAL BRIEF:</strong></p>
              <p>${brief}</p>
            </section>

            <footer style="margin-top: 30px; font-size: 10px; border-top: 1px solid #1a2e4a; padding-top: 10px;">
              NEXUS OS // TRANS-COMM PROTOCOL V1.0
            </footer>
          </div>
        `,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Mail Service Error:', err);
      throw err;
    }
  }
};
