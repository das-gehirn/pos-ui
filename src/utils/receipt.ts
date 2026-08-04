import QRCode from "qrcode";

export interface ReceiptItem {
  name: string;
  price: number | string;
  quantity: number | string;
  total: number | string;
}

export interface ReceiptData {
  items: ReceiptItem[];
  subTotal: string;
  salesURL: string;
  tax: string;
  customer: string;
  teller: string;
  amountPaid: string;
  changeGiven: string;
  arrears: string;
  isChangeGiven: boolean;
  isArrears: boolean;
  receiptNumber: string;
  createdAt: string;
  paymentStatus: string;
  discountSymbol: string;
  discountAmount: string;
  totalAmount: string;
}

const escapeHTML = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char] as string
  );

const REMARKS: Record<string, { label: string; color: string }> = {
  paid: { label: "PAID", color: "rgba(19, 209, 67, 0.342)" },
  "partly paid": { label: "PARTLY PAID", color: "rgba(255, 166, 0, 0.342)" },
  expired: { label: "EXPIRED", color: "rgba(255, 0, 0, 0.342)" }
};

/**
 * Builds the standalone receipt document. Styles are inlined rather than pulled
 * from a CDN so printing works offline and never blocks on the network.
 */
export function buildReceiptHTML(data: ReceiptData, qrDataURL: string) {
  const remark = REMARKS[data.paymentStatus];

  const rows = data.items
    .map(
      item => `
        <tr>
          <td class="left">${escapeHTML(item.name)}</td>
          <td class="right">${escapeHTML(item.price)}</td>
          <td class="right">${escapeHTML(item.quantity)}</td>
          <td class="right">${escapeHTML(item.total)}</td>
        </tr>`
    )
    .join("");

  const line = (label: string, value: string, bold = false) => `
    <div class="row${bold ? " bold" : ""}">
      <span>${escapeHTML(label)}</span><span>${escapeHTML(value)}</span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Receipt ${escapeHTML(data.receiptNumber)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 16px;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        color: #111;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .receipt { position: relative; max-width: 600px; margin: 0 auto; padding: 16px; }
      .remark {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px; font-weight: 700; pointer-events: none; z-index: 10;
        white-space: nowrap;
      }
      .head { text-align: center; margin-bottom: 24px; }
      .head h1 { font-size: 26px; margin: 0 0 6px; }
      .head p { margin: 2px 0; font-size: 13px; color: #4b5563; }
      .divider { border-top: 1px solid #d1d5db; margin: 12px 0; }
      .meta { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; margin-bottom: 10px; }
      .meta b { color: #111; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
      thead { background: #f3f4f6; }
      th, td { padding: 6px 4px; }
      th.left, td.left, .left { text-align: left; }
      th.right, td.right, .right { text-align: right; }
      tbody tr { border-bottom: 1px solid #e5e7eb; }
      .row { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; }
      .row.bold span:first-child { font-weight: 700; }
      .arrears span { color: #dc2626; font-weight: 700; }
      .qr { display: flex; justify-content: center; margin: 18px 0; }
      .qr img { width: 128px; height: 128px; }
      .footer { text-align: center; font-size: 13px; color: #4b5563; margin-top: 24px; }
      .footer .thanks { font-weight: 700; }
      .notice { text-align: center; font-weight: 700; margin: 12px 0; }
      @page { size: A4; margin: 12mm; }
      @media print { body { padding: 0; } }
    </style>
  </head>
  <body>
    <div class="receipt">
      ${remark ? `<div class="remark" style="color:${remark.color}">${remark.label}</div>` : ""}
      <div class="head">
        <h1>OSEIKROM HARDWARE</h1>
        <p>C0-0056-0664 Gomoa Ekwamkrom Police Barrier</p>
        <p>Phone: 0557921536 / 0302964752</p>
      </div>
      <div class="divider"></div>
      <div class="meta">
        <span>Date: <b>${escapeHTML(data.createdAt)}</b></span>
        <span>Receipt #: <b>${escapeHTML(data.receiptNumber)}</b></span>
      </div>
      <div class="meta">
        <span>Teller: <b>${escapeHTML(data.teller)}</b></span>
        <span>Customer: <b>${escapeHTML(data.customer)}</b></span>
      </div>
      <table>
        <thead>
          <tr>
            <th class="left">Item</th>
            <th class="right">Price</th>
            <th class="right">Qty</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div>
        ${line("Subtotal:", data.subTotal, true)}
        ${line(`Discount(${data.discountSymbol}):`, data.discountAmount, true)}
        ${line("Tax (0%):", data.tax, true)}
        ${line("Total:", data.totalAmount, true)}
      </div>
      <div class="divider"></div>
      <div>
        ${line("Cash Received:", data.amountPaid, true)}
        ${data.isChangeGiven ? line("Change Given:", data.changeGiven, true) : ""}
        ${
          data.isArrears
            ? `<div class="row arrears"><span>Arrears:</span><span>${escapeHTML(data.arrears)}</span></div>`
            : ""
        }
      </div>
      ${qrDataURL ? `<div class="qr"><img src="${qrDataURL}" alt="Receipt QR code" /></div>` : ""}
      <div class="footer">
        <p class="thanks">Thank you for your purchase!</p>
        <p>Visit us again!</p>
      </div>
      <div class="notice">NB: GOODS SOLD ARE NOT RETURNABLE</div>
    </div>
  </body>
</html>`;
}

/**
 * Renders the receipt in a hidden iframe and opens the browser print dialog.
 * Nothing leaves the page, so there is no popup blocker to fight and no
 * server round-trip for rendering.
 */
export async function printReceipt(data: ReceiptData) {
  let qrDataURL = "";
  try {
    qrDataURL = await QRCode.toDataURL(data.salesURL, {
      width: 128,
      margin: 1,
      errorCorrectionLevel: "H"
    });
  } catch {
    // A missing QR code should never stop the receipt from printing.
  }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const cleanup = () => {
    // Give the print dialog time to take over before tearing the frame down.
    setTimeout(() => iframe.remove(), 1000);
  };

  await new Promise<void>(resolve => {
    iframe.onload = () => resolve();
    const doc = iframe.contentDocument;
    if (!doc) return resolve();
    doc.open();
    doc.write(buildReceiptHTML(data, qrDataURL));
    doc.close();
  });

  const frameWindow = iframe.contentWindow;
  if (!frameWindow) {
    cleanup();
    throw new Error("Unable to prepare the receipt for printing");
  }

  // Wait for the QR image to decode so it is not missing from the printout.
  const images = Array.from(iframe.contentDocument?.images ?? []);
  await Promise.all(
    images.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(resolve => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );

  frameWindow.focus();
  frameWindow.print();
  cleanup();
}
