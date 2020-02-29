/* eslint-disable @typescript-eslint/camelcase */

import qrcode from 'qrcode';
import { readFileSync } from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import { Attachment } from 'nodemailer/lib/mailer';
import PDFDocument from 'pdfkit';
import { join } from 'path';
import User from '../models/user';
import { identifyRepresentation } from '../utils/representation';
import { mailUrl, mailSender, mailPort, mailPassword, mailUser } from '../utils/env';

const template = readFileSync(join(__dirname, 'template.html')).toString();

export const generateQrCode = async (id: string) => {
  return qrcode.toDataURL(id, { margin: 1 });
};

// const background = `data:image/jpg;base64,${readFileSync(join(__dirname, 'ticket.jpg'), 'base64')}`;
const width = 595.28;
const height = 841.89;

export const generateTicket = async (user: User, representation: number) =>
  new Promise<Buffer>(async (resolve) => {
    const doc = new PDFDocument({ size: [width, height] });
    const qrcode = await generateQrCode(user.id);
    const buffers: Array<Uint8Array> = [];

    // doc.image(background, 0, 0, { width, height });
    doc.image(qrcode, width - 75 - 20, 20, { width: 75 });
    doc
      .font(join(__dirname, 'roboto.ttf'))
      .fontSize(20)
      .fillColor('black')
      .text(`${user.firstname} ${user.lastname}`, 20, 20)
      .text(identifyRepresentation(representation), 20, 40)
      .text(user.item.name, 20, 60);

    // Return result
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc.end();
  });

interface PaymentParams {
  username: string;
}

const payment = (data: PaymentParams) => ({
  title: 'Confirmation de votre commande - UTT Arena 2019',
  data: mustache.render(template, {
    title: 'PAIEMENT',
    subtitle: `Félicitations ${data.username}, votre commande est confirmée !`,
    content:
      'Si vous avez acheté une place, elle est disponible en pièce jointe de ce mail ou dans l\'onglet "Mon compte" sur le site.<br />Vous pouvez accéder à votre commande en cliquant sur le bouton ci-dessous.',
    button_title: 'A SUPPRIMER',
  }),
});

export const sendMail = async (to: string, data: PaymentParams, attachments?: Array<Attachment>) => {
  const transporter = nodemailer.createTransport({
    host: mailUrl(),
    port: mailPort(),
    auth: {
      user: mailUser(),
      pass: mailPassword(),
    },
  });

  const mailContent = payment(data);

  return transporter.sendMail({
    from: mailSender(),
    to,
    subject: mailContent.title,
    html: mustache.render(mailContent.data, data),
    attachments,
  });
};
