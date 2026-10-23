"""Reproduce the public illustrative invoice; requires reportlab and DejaVu fonts.

Run with Python, then render using:
pdftoppm -scale-to-x 794 -scale-to-y 1123 -singlefile -png public/downloads/gst-invoice-sample.pdf public/downloads/gst-invoice-sample
This is an educational layout, separate from the browser's invoice export.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parents[1]
out = root / 'public/downloads/gst-invoice-sample.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
font_root = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Body', str(font_root / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('Bold', str(font_root / 'DejaVuSans-Bold.ttf')))
c = canvas.Canvas(str(out), pagesize=A4)
c.setTitle('Illustrative GST Invoice Sample | Zubware')
c.setAuthor('Zubware')
w, h = A4
navy, muted, indigo = '#0f172a', '#475569', '#4338ca'

def text(x, y, value, size=9, bold=False, color=navy):
    c.setFillColor(HexColor(color))
    c.setFont('Bold' if bold else 'Body', size)
    c.drawString(x, y, value)

def right(x, y, value, size=9, bold=False, color=navy):
    c.setFillColor(HexColor(color))
    c.setFont('Bold' if bold else 'Body', size)
    c.drawRightString(x, y, value)

def line(y):
    c.setStrokeColor(HexColor('#e2e8f0'))
    c.line(40, y, w - 40, y)

c.setFillColor(HexColor(indigo))
c.rect(0, h - 12, w, 12, fill=1, stroke=0)
text(40, 787, 'ZUBWARE', 11, True, indigo)
right(w - 40, 787, 'ILLUSTRATIVE SAMPLE • NOT FOR ISSUE', 8, True, muted)
text(40, 750, 'TAX INVOICE', 25, True)
text(40, 729, 'A4 layout example with discount and partial payment', 9, color=muted)
line(710)

text(40, 688, 'SELLER', 8, True, indigo)
text(40, 670, 'Example Services', 12, True)
text(40, 651, 'Sample address, Mumbai, Maharashtra')
text(40, 633, 'GSTIN: [your registered GSTIN]')
text(40, 615, 'Email: billing@example.invalid')
text(342, 688, 'INVOICE DETAILS', 8, True, indigo)
text(342, 670, 'Number: SAMPLE-001')
text(342, 651, 'Date: 24 Oct 2026')
text(342, 633, 'Place of Supply: Maharashtra')
text(342, 615, 'Reverse Charge: No (example)')
line(596)
text(40, 574, 'BILL TO', 8, True, indigo)
text(40, 556, 'Example Customer', 12, True)
text(40, 538, 'Sample address, Pune, Maharashtra')
text(40, 520, 'GSTIN: [buyer GSTIN, where applicable]')

cols = [(48, 'ITEM / HSN-SAC'), (285, 'QTY'), (347, 'RATE'), (426, 'DISCOUNT'), (543, 'TAXABLE')]
c.setFillColor(HexColor('#eef2ff'))
c.rect(40, 470, w - 80, 30, fill=1, stroke=0)
for x, value in cols:
    (text if x == 48 else right)(x, 481, value, 8, True, indigo)
for y, name, rate, discount, taxable in [
    (448, 'Service A', '25,000.00', '1,000.00', '24,000.00'),
    (394, 'Service B', '5,000.00', '0.00', '5,000.00'),
]:
    text(48, y, name, 9, True)
    text(48, y - 17, 'HSN/SAC: verify classification', 8, color=muted)
    for x, value in [(285, '1'), (347, rate), (426, discount), (543, taxable)]:
        right(x, y, value)
    line(y - 30)

text(40, 333, 'AMOUNTS IN INR', 8, True, indigo)
text(40, 314, '18% is an arithmetic example only.', 8, color=muted)
text(40, 298, 'Use the rate applicable to your transaction.', 8, color=muted)
for y, label, value in [
    (334, 'Taxable value', '29,000.00'),
    (313, 'CGST (9%)', '2,610.00'),
    (292, 'SGST (9%)', '2,610.00'),
    (271, 'Round off / other charges', '0.00'),
    (244, 'Invoice total', '34,220.00'),
    (223, 'Payment received', '10,000.00'),
]:
    text(321, y, label, 8, y == 244)
    right(543, y, value, 9, y == 244)
c.setFillColor(HexColor(indigo))
c.roundRect(312, 177, 243, 33, 6, fill=1, stroke=0)
text(324, 189, 'BALANCE DUE', 9, True, '#ffffff')
right(543, 189, '₹24,220.00', 13, True, '#ffffff')
text(40, 153, 'PAYMENT DETAILS', 8, True, indigo)
text(40, 136, 'Add your own bank and UPI details in the invoice editor.', 8, color=muted)
text(40, 120, 'No payment QR is included in this public sample.', 8, color=muted)
line(101)
text(40, 83, 'Fictional details. This sample explains layout; it is not a compliance certificate.', 8, color=muted)
text(40, 67, 'Create your own invoice: zubware.com/gst-invoice-generator', 8, True, indigo)
c.linkURL('https://www.zubware.com/gst-invoice-generator', (40, 62, 400, 79), relative=0)
c.showPage()
c.save()
print(out)
