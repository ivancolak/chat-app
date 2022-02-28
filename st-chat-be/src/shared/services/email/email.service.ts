import { Injectable } from '@nestjs/common';
import { SendMailOptions, createTransport } from 'nodemailer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as smtpTransport from 'nodemailer-smtp-transport';

@Injectable()
export class EmailService {
  configService: any;

  async composeEmailData(
    templatePath: string,
    data: any,
    subject: string,
    to: string,
  ): Promise<SendMailOptions> {
    const html = await ejs.renderFile(
      path.resolve(__dirname, templatePath),
      data,
    );
    const emailData: SendMailOptions = {
      from: 'stchatapp@yahoo.com',
      to,
      subject,
      html,
    };
    return emailData;
  }

  async sendEmail(emailData: SendMailOptions) {
    const pass = 'uqrucenkscfnvplj';
    const user = 'stchatapp@yahoo.com';
    const transporter = createTransport(
      smtpTransport({
        service: 'yahoo',
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user,
          pass,
        },
      }),
    );
    try {
      await transporter.sendMail(emailData);
    } catch (e) {
      console.log(e);
    }
  }

  async sendInvitationEmail(
    emailTo: string,
    username: string,
    tempPassword: string,
  ) {
    const emailData: SendMailOptions = await this.composeEmailData(
      '../../../../email-templates/invitation-template.ejs',
      {
        username,
        tempPassword,
        loginUrl: ``,
      },
      'invitation',
      emailTo,
    );
    return await this.sendEmail(emailData);
  }


  async sendResetPasswordEmail(
    emailTo: string,
    username: string,
    tempPassword: string,
  ) {
    const emailData: SendMailOptions = await this.composeEmailData(
      '../../../../email-templates/resetPassword-template.ejs',
      {
        username,
        tempPassword,
        loginUrl: ``,
      },
      'Reset password',
      emailTo,
    );

    return await this.sendEmail(emailData);
  }
}
