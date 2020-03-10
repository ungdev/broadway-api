/* eslint-disable @typescript-eslint/camelcase */

import qrcode from 'qrcode';
import { readFileSync } from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import PDFDocument from 'pdfkit';
import { join } from 'path';
import User from '../models/user';
import { identifyRepresentation } from '../utils/representation';
import { mailUrl, mailSender, mailPort, mailPassword, mailUser } from '../utils/env';
import Order from '../models/order';
import log from '../utils/log';

const template = readFileSync(join(__dirname, 'template.html')).toString();

const transporter = nodemailer.createTransport({
  host: mailUrl(),
  port: mailPort(),
  auth: {
    user: mailUser(),
    pass: mailPassword(),
  },
});

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

const generateHtml = (firstname: string, lastname: string) =>
  mustache.render(template, {
    title: 'Confirmation de votre commande',
    content: `Merci d'avoir commandé chez nous ${firstname} ${lastname}, blablablablablabla`,
  });

const generateAttachments = async (order: Order) =>
  Promise.all(
    order.users.map(async (_user) => {
      const user = _user;

      const pdf = await generateTicket(user, order.representation);

      return {
        filename: `${user.firstname}.pdf`,
        content: pdf,
      };
    }),
  );

export const sendConfirmationEmail = async (order: Order) => {
  const html = generateHtml(order.firstname, order.lastname);
  const attachments = await generateAttachments(order);

  await transporter.sendMail({
    from: mailSender(),
    to: order.email,
    subject: 'Confirmation de votre commande',
    html,
    attachments,
  });

  log.info(`Mail sent to <${order.email}>`);
};
