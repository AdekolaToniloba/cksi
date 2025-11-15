// utils/email.ts
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailUtils {
  static generateContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): EmailTemplate {
    return {
      subject: `Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${data.name}
        Email: ${data.email}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
      `,
    };
  }

  static generateDonationConfirmation(data: {
    amount: number;
    donorName?: string;
    donorEmail: string;
    reference: string;
  }): EmailTemplate {
    return {
      subject: "Thank you for your donation to CKSI",
      html: `
        <h2>Donation Confirmation</h2>
        <p>Dear ${data.donorName || "Supporter"},</p>
        <p>Thank you for your generous donation of ₦${data.amount.toLocaleString()} to CKSI.</p>
        <p><strong>Reference:</strong> ${data.reference}</p>
        <p>Your support helps us continue our mission of empowering families and children across Nigeria.</p>
        <p>Best regards,<br>The CKSI Team</p>
      `,
      text: `
        Donation Confirmation
        
        Dear ${data.donorName || "Supporter"},
        
        Thank you for your generous donation of ₦${data.amount.toLocaleString()} to CKSI.
        
        Reference: ${data.reference}
        
        Your support helps us continue our mission of empowering families and children across Nigeria.
        
        Best regards,
        The CKSI Team
      `,
    };
  }

  static generateNewsletterWelcome(
    email: string,
    name?: string
  ): EmailTemplate {
    return {
      subject: "Welcome to CKSI Newsletter",
      html: `
        <h2>Welcome to CKSI Newsletter</h2>
        <p>Dear ${name || "Subscriber"},</p>
        <p>Thank you for subscribing to our newsletter. You'll receive updates about our programs, success stories, and ways to get involved.</p>
        <p>Visit our website to learn more about our work: <a href="https://cksi.org">cksi.org</a></p>
        <p>Best regards,<br>The CKSI Team</p>
      `,
      text: `
        Welcome to CKSI Newsletter
        
        Dear ${name || "Subscriber"},
        
        Thank you for subscribing to our newsletter. You'll receive updates about our programs, success stories, and ways to get involved.
        
        Visit our website to learn more about our work: https://cksi.org
        
        Best regards,
        The CKSI Team
      `,
    };
  }
}
