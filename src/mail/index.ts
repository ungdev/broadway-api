/* eslint-disable @typescript-eslint/camelcase */

import qrcode from 'qrcode';
import { readFileSync } from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import PDFDocument from 'pdfkit';
import { join } from 'path';
import { identifyRepresentation } from '../utils/representation';
import { mailHost, mailPort, mailSender, mailPassword, mailUser } from '../utils/env';
import Order from '../models/order';
import log from '../utils/log';
import { EmailAttachment } from '../types';

const qrcodeWidth = 150;
const width = 595.28;
const height = 841.89;
// TODO: ticket background
// const background = `data:image/jpg;base64,${readFileSync(join(__dirname, 'ticket.jpg'), 'base64')}`;
const template = readFileSync(join(__dirname, 'template.html')).toString();

const transporter = nodemailer.createTransport({
  host: mailHost(),
  port: mailPort(),
  auth: {
    user: mailUser(),
    pass: mailPassword(),
  },
});

export const generateQrCode = async (id: string) => {
  return qrcode.toDataURL(id, { margin: 1, width: qrcodeWidth });
};

export const generateTicket = async (order: Order) =>
  new Promise<Buffer>(async (resolve) => {
    const doc = new PDFDocument({ size: [width, height] });
    const qrcode = await generateQrCode(order.id);
    const buffers: Array<Uint8Array> = [];

    // doc.image(background, 0, 0, { width, height });
    doc.image(qrcode, width - qrcodeWidth - 20, 20, { width: qrcodeWidth });
    doc
      .font(join(__dirname, 'roboto.ttf'))
      .fontSize(16)
      .fillColor('black')
      .text(`Date : ${identifyRepresentation(order.representation)}`, 20, 20);

    order.users.forEach((user, i) => {
      doc.text(`${user.firstname} ${user.lastname} (${user.item.name})`, 20, 50 + i * 20);
    });

    // Return result
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc.end();
  });

export const sendEmail = async (
  to: string,
  text: {
    title: string;
    content: string;
  },
  attachments?: EmailAttachment[],
) => {
  await transporter.sendMail({
    from: mailSender(),
    to,
    subject: `Broadway UTT - ${text.title}`,
    html: mustache.render(template, text),
    attachments,
  });
};

export const sendConfirmationEmail = async (order: Order) => {
  const attachments = [
    {
      filename: `Billet_Broadway_UTT.pdf`,
      content: await generateTicket(order),
    },
  ];

  await sendEmail(
    order.email,
    {
      title: 'Confirmation de votre commande',
      // TODO: mail content
      content: `Merci d'avoir commandé chez nous ${order.firstname} ${order.lastname} !<br />Vous trouverez votre billet en pièce jointe.`,
    },
    attachments,
  );

  log.info(`Mail sent to <${order.email}>`);
};
