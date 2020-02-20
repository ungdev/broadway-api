import qrcode from 'qrcode';
import PDFDocument from 'pdfkit';
import { join } from 'path';
import User from '../models/user';
import { identifyRepresentation } from '../utils/representation';

export const generateQrCode = async (id: string) => {
  return qrcode.toDataURL(id, { margin: 1 });
};

// const background = `data:image/jpg;base64,${readFileSync(join(__dirname, 'ticket.jpg'), 'base64')}`;
const width = 595.28;
const height = 841.89;

export const generateTicket = async (user: User, representation: number) =>
  new Promise(async (resolve) => {
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
