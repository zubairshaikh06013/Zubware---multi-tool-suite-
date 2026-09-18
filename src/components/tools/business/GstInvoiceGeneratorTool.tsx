import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Plus,
  Trash2,
  Copy,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
  PackageCheck,
  CreditCard,
  FileCheck2,
  ChevronDown,
  Eye,
  Edit3,
  X,
  HelpCircle,
  QrCode
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface GstInvoiceGeneratorToolProps {
  onShowToast?: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export interface InvoiceItem {
  id: string;
  name: string;
  hsn: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  discountType: 'amount' | 'percent';
  gstRate: number;
}

export interface SupplierDetails {
  businessName: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pinCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string | null;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  reverseCharge: 'Yes' | 'No';
  invoiceType: 'Tax Invoice' | 'Bill of Supply' | 'Receipt Voucher';
}

export interface CustomerDetails {
  customerName: string;
  customerGstin: string;
  billingAddress: string;
  city: string;
  state: string;
  stateCode: string;
  pinCode: string;
  phone: string;
  email: string;
  sameAsBilling: boolean;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
}

export const INDIAN_STATES = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '25', name: 'Daman and Diu' },
  { code: '26', name: 'Dadra and Nagar Haveli' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh (Old)' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman and Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' }
];

export const GST_RATES = [0, 5, 12, 18, 28];
export const UNIT_TYPES = ['Pcs', 'Box', 'Kg', 'Mtr', 'Hours', 'Days', 'Nos', 'Sets', 'Service', 'Ltr', 'Sq.Ft'];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;

export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num < 0) return '';
  if (num === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertLessThanThousand(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    } else if (n > 0) {
      str += ones[n];
    }
    return str.trim();
  }

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let rupeeStr = '';

  if (rupees === 0) {
    rupeeStr = 'Zero';
  } else {
    let tempRupees = rupees;
    const crore = Math.floor(tempRupees / 10000000);
    tempRupees %= 10000000;
    const lakh = Math.floor(tempRupees / 100000);
    tempRupees %= 100000;
    const thousand = Math.floor(tempRupees / 1000);
    tempRupees %= 1000;

    const parts: string[] = [];

    if (crore > 0) {
      parts.push(convertLessThanThousand(crore) + ' Crore');
    }
    if (lakh > 0) {
      parts.push(convertLessThanThousand(lakh) + ' Lakh');
    }
    if (thousand > 0) {
      parts.push(convertLessThanThousand(thousand) + ' Thousand');
    }
    if (tempRupees > 0) {
      parts.push(convertLessThanThousand(tempRupees));
    }

    rupeeStr = parts.join(' ');
  }

  let result = `${rupeeStr} Rupee${rupees === 1 ? '' : 's'}`;

  if (paise > 0) {
    const paiseStr = convertLessThanThousand(paise);
    result += ` and ${paiseStr} Paise`;
  }

  return `${result} Only`;
}

const DEFAULT_SUPPLIER: SupplierDetails = {
  businessName: 'ABC Enterprises',
  gstin: '27AAAAA0000A1Z5',
  address: '102, Commercial Hub, MG Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  stateCode: '27',
  pinCode: '400001',
  phone: '+91 98765 43210',
  email: 'billing@abcenterprises.com',
  website: 'www.abcenterprises.com',
  logoUrl: null
};

const DEFAULT_INVOICE_META: InvoiceMeta = {
  invoiceNumber: 'INV-2026-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  placeOfSupply: 'Maharashtra',
  reverseCharge: 'No',
  invoiceType: 'Tax Invoice'
};

const DEFAULT_CUSTOMER: CustomerDetails = {
  customerName: 'XYZ Solutions Pvt Ltd',
  customerGstin: '27BBBBB1111B1Z2',
  billingAddress: '405, Tech Park, Station Road',
  city: 'Pune',
  state: 'Maharashtra',
  stateCode: '27',
  pinCode: '411001',
  phone: '+91 91234 56789',
  email: 'accounts@xyzsolutions.com',
  sameAsBilling: true,
  shippingAddress: '',
  shippingCity: '',
  shippingState: 'Maharashtra',
  shippingPinCode: ''
};

const DEFAULT_ITEMS: InvoiceItem[] = [
  {
    id: 'item-1',
    name: 'Web Development Services',
    hsn: '998314',
    description: 'Custom React & Tailwind CSS web portal development',
    quantity: 1,
    unit: 'Service',
    rate: 25000,
    discount: 1000,
    discountType: 'amount',
    gstRate: 18
  },
  {
    id: 'item-2',
    name: 'Cloud Hosting & Maintenance',
    hsn: '998315',
    description: 'Annual cloud server infrastructure management',
    quantity: 1,
    unit: 'Sets',
    rate: 5000,
    discount: 0,
    discountType: 'amount',
    gstRate: 18
  }
];

const DEFAULT_PAYMENT: PaymentDetails = {
  bankName: 'HDFC Bank',
  accountName: 'ABC Enterprises',
  accountNumber: '50200012345678',
  ifsc: 'HDFC0001234',
  upiId: 'abcenterprises@hdfcbank'
};

export function GstInvoiceGeneratorTool({ onShowToast }: GstInvoiceGeneratorToolProps) {
  // Main Data States
  const [supplier, setSupplier] = useState<SupplierDetails>(DEFAULT_SUPPLIER);
  const [invoiceMeta, setInvoiceMeta] = useState<InvoiceMeta>(DEFAULT_INVOICE_META);
  const [customer, setCustomer] = useState<CustomerDetails>(DEFAULT_CUSTOMER);
  const [items, setItems] = useState<InvoiceItem[]>(DEFAULT_ITEMS);
  const [payment, setPayment] = useState<PaymentDetails>(DEFAULT_PAYMENT);
  const [terms, setTerms] = useState<string>('1. Payment is due within 15 days of invoice date.\n2. Please mention the invoice number in all wire transfers.\n3. Goods or services once provided are non-refundable.');
  const [signatoryName, setSignatoryName] = useState<string>('Authorized Signatory');
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Extra Charges & Tax Override
  const [otherChargesLabel, setOtherChargesLabel] = useState<string>('Shipping & Packing');
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [autoRoundOff, setAutoRoundOff] = useState<boolean>(true);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [taxOverride, setTaxOverride] = useState<'auto' | 'intra' | 'inter'>('auto');

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [activeFormSection, setActiveFormSection] = useState<'supplier' | 'invoice' | 'customer' | 'items' | 'payment' | 'terms'>('supplier');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [draftExists, setDraftExists] = useState<boolean>(false);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Check for local draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('splitdrop_gst_invoice_draft');
      if (saved) {
        setDraftExists(true);
      }
    } catch {
      // Storage restricted
    }
  }, []);

  // Generate UPI QR Code whenever upiId or amounts change
  useEffect(() => {
    const generateQr = async () => {
      if (!payment.upiId || !payment.upiId.trim()) {
        setUpiQrDataUrl(null);
        return;
      }
      try {
        const grandTotal = calculateTotals().grandTotal;
        const upiUri = `upi://pay?pa=${payment.upiId.trim()}&pn=${encodeURIComponent(supplier.businessName || 'Business')}&am=${grandTotal}&cu=INR`;
        const url = await QRCode.toDataURL(upiUri, { width: 140, margin: 1 });
        setUpiQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate UPI QR code:', err);
        setUpiQrDataUrl(null);
      }
    };
    generateQr();
  }, [payment.upiId, supplier.businessName, items, otherCharges, autoRoundOff]);

  // Load Draft handler
  const handleLoadDraft = () => {
    try {
      const saved = localStorage.getItem('splitdrop_gst_invoice_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.supplier) setSupplier(parsed.supplier);
        if (parsed.invoiceMeta) setInvoiceMeta(parsed.invoiceMeta);
        if (parsed.customer) setCustomer(parsed.customer);
        if (parsed.items) setItems(parsed.items);
        if (parsed.payment) setPayment(parsed.payment);
        if (parsed.terms) setTerms(parsed.terms);
        if (parsed.signatoryName) setSignatoryName(parsed.signatoryName);
        if (parsed.signatureUrl) setSignatureUrl(parsed.signatureUrl);
        if (parsed.otherCharges !== undefined) setOtherCharges(parsed.otherCharges);
        if (parsed.otherChargesLabel) setOtherChargesLabel(parsed.otherChargesLabel);
        if (parsed.autoRoundOff !== undefined) setAutoRoundOff(parsed.autoRoundOff);
        if (parsed.amountReceived !== undefined) setAmountReceived(parsed.amountReceived);
        if (parsed.taxOverride) setTaxOverride(parsed.taxOverride);
        if (onShowToast) onShowToast('Loaded previous invoice draft!');
      }
      setDraftExists(false);
    } catch {
      if (onShowToast) onShowToast('Failed to load draft.');
    }
  };

  // Save Draft handler
  const handleSaveDraft = () => {
    try {
      const payload = {
        supplier,
        invoiceMeta,
        customer,
        items,
        payment,
        terms,
        signatoryName,
        signatureUrl,
        otherCharges,
        otherChargesLabel,
        autoRoundOff,
        amountReceived,
        taxOverride,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('splitdrop_gst_invoice_draft', JSON.stringify(payload));
      if (onShowToast) onShowToast('Invoice saved as draft locally! 💾');
    } catch {
      if (onShowToast) onShowToast('Failed to save draft locally.');
    }
  };

  // Reset Invoice handler
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all invoice fields to default?')) {
      setSupplier(DEFAULT_SUPPLIER);
      setInvoiceMeta(DEFAULT_INVOICE_META);
      setCustomer(DEFAULT_CUSTOMER);
      setItems(DEFAULT_ITEMS);
      setPayment(DEFAULT_PAYMENT);
      setTerms('1. Payment is due within 15 days of invoice date.\n2. Please quote invoice number in all wire transfers.\n3. Goods or services once provided are non-refundable.');
      setSignatoryName('Authorized Signatory');
      setSignatureUrl(null);
      setOtherCharges(0);
      setAutoRoundOff(true);
      setAmountReceived(0);
      setTaxOverride('auto');
      if (onShowToast) onShowToast('Invoice reset to default.');
    }
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        if (onShowToast) onShowToast('Logo file size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSupplier((prev) => ({ ...prev, logoUrl: event.target?.result as string }));
        if (onShowToast) onShowToast('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        if (onShowToast) onShowToast('Signature file size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignatureUrl(event.target?.result as string);
        if (onShowToast) onShowToast('Signature uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: '',
      hsn: '',
      description: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discount: 0,
      discountType: 'amount',
      gstRate: 18
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Duplicate Item
  const handleDuplicateItem = (index: number) => {
    const itemToDup = items[index];
    const dup: InvoiceItem = {
      ...itemToDup,
      id: `item-${Date.now()}`
    };
    const updated = [...items];
    updated.splice(index + 1, 0, dup);
    setItems(updated);
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      if (onShowToast) onShowToast('Invoice must contain at least one item.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Update Item
  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Auto set State Code when State changes
  const handleSupplierStateChange = (stateName: string) => {
    const match = INDIAN_STATES.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
    setSupplier((prev) => ({
      ...prev,
      state: stateName,
      stateCode: match ? match.code : prev.stateCode
    }));
  };

  const handleCustomerStateChange = (stateName: string) => {
    const match = INDIAN_STATES.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
    setCustomer((prev) => ({
      ...prev,
      state: stateName,
      stateCode: match ? match.code : prev.stateCode
    }));
    // Sync place of supply
    setInvoiceMeta((prev) => ({
      ...prev,
      placeOfSupply: stateName
    }));
  };

  // GSTIN format checker helper
  const validateGstin = (gstinStr: string) => {
    if (!gstinStr || !gstinStr.trim()) return null;
    const clean = gstinStr.trim();
    if (GSTIN_REGEX.test(clean)) {
      return { valid: true, msg: 'GSTIN format looks valid.' };
    }
    return { valid: false, msg: 'Please check the GSTIN format (15 characters, e.g. 27AAAAA0000A1Z5).' };
  };

  // TAX & TOTAL CALCULATIONS
  const calculateTotals = () => {
    // Determine Intra vs Inter state
    const supplierStateNorm = (supplier.state || '').trim().toLowerCase();
    const customerPlaceNorm = (invoiceMeta.placeOfSupply || customer.state || '').trim().toLowerCase();

    let isIntraState = true;
    if (taxOverride === 'intra') {
      isIntraState = true;
    } else if (taxOverride === 'inter') {
      isIntraState = false;
    } else {
      isIntraState = supplierStateNorm !== '' && customerPlaceNorm !== '' && supplierStateNorm === customerPlaceNorm;
    }

    let grossSubtotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalGstAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const itemCalculations = items.map((item) => {
      const qty = Math.max(0, item.quantity || 0);
      const rate = Math.max(0, item.rate || 0);
      const lineGross = qty * rate;

      let discAmt = 0;
      if (item.discountType === 'percent') {
        discAmt = (lineGross * Math.max(0, item.discount || 0)) / 100;
      } else {
        discAmt = Math.max(0, item.discount || 0);
      }
      discAmt = Math.min(lineGross, discAmt);

      const taxableValue = Math.max(0, lineGross - discAmt);
      const gstRate = Math.max(0, item.gstRate || 0);
      const gstAmt = (taxableValue * gstRate) / 100;
      const totalItem = taxableValue + gstAmt;

      grossSubtotal += lineGross;
      totalDiscount += discAmt;
      totalTaxableAmount += taxableValue;
      totalGstAmount += gstAmt;

      if (isIntraState) {
        totalCgst += gstAmt / 2;
        totalSgst += gstAmt / 2;
      } else {
        totalIgst += gstAmt;
      }

      return {
        lineGross,
        discAmt,
        taxableValue,
        gstAmt,
        totalItem
      };
    });

    const netBeforeRound = totalTaxableAmount + totalGstAmount + Math.max(0, otherCharges || 0);
    const roundedGrandTotal = autoRoundOff ? Math.round(netBeforeRound) : netBeforeRound;
    const roundOffDiff = roundedGrandTotal - netBeforeRound;
    const balanceDue = Math.max(0, roundedGrandTotal - Math.max(0, amountReceived || 0));

    return {
      isIntraState,
      grossSubtotal,
      totalDiscount,
      totalTaxableAmount,
      totalGstAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      otherCharges: Math.max(0, otherCharges || 0),
      netBeforeRound,
      roundOffDiff,
      grandTotal: roundedGrandTotal,
      balanceDue,
      itemCalculations
    };
  };

  const totals = calculateTotals();

  // Export PDF Handler
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    if (onShowToast) onShowToast('Preparing A4 PDF Document...');

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const sanitizedBusiness = (supplier.businessName || 'Invoice').replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizedNumber = (invoiceMeta.invoiceNumber || 'INV-001').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${sanitizedBusiness}-${sanitizedNumber}.pdf`;

      pdf.save(filename);
      if (onShowToast) onShowToast(`Downloaded ${filename}! 📄`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      if (onShowToast) onShowToast('Failed to generate PDF. Please try the Print option.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  const supplierGstinValidation = validateGstin(supplier.gstin);
  const customerGstinValidation = validateGstin(customer.customerGstin);

  return (
    <div className="space-y-6">
      
      {/* LOCAL PRIVACY BANNER */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-200 font-medium">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong className="font-bold">🔒 Private & Local:</strong> Your invoice details, business logo, and signature are processed completely inside your browser and never uploaded to any server.
          </span>
        </div>

        {draftExists && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadDraft}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" /> Continue Draft
            </button>
            <button
              onClick={() => setDraftExists(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Dismiss draft alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* TOP ACTION BAR & NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Mobile View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Form
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </button>
        </div>

        {/* Quick Utility Buttons */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
            title="Save draft to browser storage"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
            title="Reset invoice fields"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5" /> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: SPLIT FORM & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: STEP-BY-STEP FORM (Visible on mobile when tab='form' or desktop always) */}
        <div className={`lg:col-span-6 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* FORM NAVIGATION PILLS */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-xs font-bold border-b border-slate-200/80 dark:border-slate-800">
            {[
              { id: 'supplier', label: '1. Business', icon: Building2 },
              { id: 'invoice', label: '2. Invoice', icon: FileText },
              { id: 'customer', label: '3. Bill To', icon: User },
              { id: 'items', label: '4. Items', icon: PackageCheck },
              { id: 'payment', label: '5. Payment', icon: CreditCard },
              { id: 'terms', label: '6. Terms & Sig', icon: FileCheck2 }
            ].map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeFormSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveFormSection(sec.id as any)}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" /> {sec.label}
                </button>
              );
            })}
          </div>

          {/* SECTION 1 — SUPPLIER DETAILS */}
          {activeFormSection === 'supplier' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" /> SECTION 1 — Your Business Details
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">* Required</span>
              </div>

              {/* Logo Upload Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Business Logo (Optional)</label>
                <div className="flex items-center gap-3">
                  {supplier.logoUrl ? (
                    <div className="relative group w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white flex items-center justify-center p-1">
                      <img src={supplier.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      <button
                        onClick={() => setSupplier((prev) => ({ ...prev, logoUrl: null }))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-indigo-500" /> Upload Business Logo (PNG/JPG)
                      <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  )}
                  <span className="text-[11px] text-slate-400">Max 2MB. Stored locally.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={supplier.businessName}
                    onChange={(e) => setSupplier({ ...supplier, businessName: e.target.value })}
                    placeholder="ABC Enterprises"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">GSTIN *</label>
                  <input
                    type="text"
                    value={supplier.gstin}
                    onChange={(e) => setSupplier({ ...supplier, gstin: e.target.value.toUpperCase() })}
                    placeholder="27AAAAA0000A1Z5"
                    maxLength={15}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {supplierGstinValidation && (
                    <span className={`text-[10px] font-semibold mt-1 block flex items-center gap-1 ${supplierGstinValidation.valid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {supplierGstinValidation.valid ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
                      {supplierGstinValidation.msg}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1">Business Address *</label>
                  <textarea
                    rows={2}
                    value={supplier.address}
                    onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                    placeholder="Building No, Street Name, Area"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    value={supplier.city}
                    onChange={(e) => setSupplier({ ...supplier, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">State</label>
                  <select
                    value={supplier.state}
                    onChange={(e) => handleSupplierStateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">State Code</label>
                  <input
                    type="text"
                    value={supplier.stateCode}
                    onChange={(e) => setSupplier({ ...supplier, stateCode: e.target.value })}
                    placeholder="27"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={supplier.pinCode}
                    onChange={(e) => setSupplier({ ...supplier, pinCode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone</label>
                  <input
                    type="text"
                    value={supplier.phone}
                    onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={supplier.email}
                    onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
                    placeholder="billing@abcenterprises.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveFormSection('invoice')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Next: Invoice Details →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2 — INVOICE DETAILS */}
          {activeFormSection === 'invoice' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" /> SECTION 2 — Invoice Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Invoice Type</label>
                  <select
                    value={invoiceMeta.invoiceType}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, invoiceType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  >
                    <option value="Tax Invoice">Tax Invoice (Default)</option>
                    <option value="Bill of Supply">Bill of Supply</option>
                    <option value="Receipt Voucher">Receipt Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    value={invoiceMeta.invoiceNumber}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, invoiceNumber: e.target.value })}
                    placeholder="INV-2026-001"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    value={invoiceMeta.invoiceDate}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceMeta.dueDate}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Place of Supply</label>
                  <select
                    value={invoiceMeta.placeOfSupply}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, placeOfSupply: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Reverse Charge Applicable?</label>
                  <select
                    value={invoiceMeta.reverseCharge}
                    onChange={(e) => setInvoiceMeta({ ...invoiceMeta, reverseCharge: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  >
                    <option value="No">No (Default)</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveFormSection('supplier')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveFormSection('customer')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Next: Customer Details →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3 — CUSTOMER DETAILS */}
          {activeFormSection === 'customer' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" /> SECTION 3 — Bill To (Customer Details)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Customer / Business Name *</label>
                  <input
                    type="text"
                    value={customer.customerName}
                    onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="XYZ Solutions Pvt Ltd"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Customer GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={customer.customerGstin}
                    onChange={(e) => setCustomer({ ...customer, customerGstin: e.target.value.toUpperCase() })}
                    placeholder="27BBBBB1111B1Z2"
                    maxLength={15}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {customerGstinValidation && (
                    <span className={`text-[10px] font-semibold mt-1 block flex items-center gap-1 ${customerGstinValidation.valid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {customerGstinValidation.valid ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
                      {customerGstinValidation.msg}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1">Billing Address *</label>
                  <textarea
                    rows={2}
                    value={customer.billingAddress}
                    onChange={(e) => setCustomer({ ...customer, billingAddress: e.target.value })}
                    placeholder="Suite / Floor, Building Name, Street"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="Pune"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">State</label>
                  <select
                    value={customer.state}
                    onChange={(e) => handleCustomerStateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">State Code</label>
                  <input
                    type="text"
                    value={customer.stateCode}
                    onChange={(e) => setCustomer({ ...customer, stateCode: e.target.value })}
                    placeholder="27"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={customer.pinCode}
                    onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                    placeholder="411001"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address Checkbox & Subform */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={customer.sameAsBilling}
                    onChange={(e) => setCustomer({ ...customer, sameAsBilling: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-indigo-600 cursor-pointer"
                  />
                  Shipping address same as billing address
                </label>

                {!customer.sameAsBilling && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-slate-700 dark:text-slate-300">Shipping Address</label>
                      <textarea
                        rows={2}
                        value={customer.shippingAddress}
                        onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                        placeholder="Warehouse / Delivery Location"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-700 dark:text-slate-300">Shipping City</label>
                      <input
                        type="text"
                        value={customer.shippingCity}
                        onChange={(e) => setCustomer({ ...customer, shippingCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-700 dark:text-slate-300">Shipping State</label>
                      <select
                        value={customer.shippingState}
                        onChange={(e) => setCustomer({ ...customer, shippingState: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveFormSection('invoice')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveFormSection('items')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Next: Add Items →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4 — ITEMS / SERVICES */}
          {activeFormSection === 'items' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-indigo-600" /> SECTION 4 — Items / Services
                </h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {items.length} Item{items.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Items Cards Editor (Mobile & Responsive Friendly) */}
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const calc = totals.itemCalculations[idx];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          Item #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicateItem(idx)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                            title="Duplicate Item"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <div className="sm:col-span-2">
                          <label className="block mb-1">Item / Service Name *</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                            placeholder="Product title or service description"
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">HSN / SAC</label>
                          <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) => handleUpdateItem(idx, 'hsn', e.target.value)}
                            placeholder="e.g. 998314"
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Quantity</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Unit</label>
                          <select
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                          >
                            {UNIT_TYPES.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1">Rate (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => handleUpdateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Discount</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.discount}
                              onChange={(e) => handleUpdateItem(idx, 'discount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                            />
                            <select
                              value={item.discountType}
                              onChange={(e) => handleUpdateItem(idx, 'discountType', e.target.value as any)}
                              className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold outline-none text-xs shrink-0"
                            >
                              <option value="amount">₹</option>
                              <option value="percent">%</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1">GST Rate (%)</label>
                          <select
                            value={item.gstRate}
                            onChange={(e) => handleUpdateItem(idx, 'gstRate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                          >
                            {GST_RATES.map((r) => (
                              <option key={r} value={r}>
                                {r}% GST
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Line Summary */}
                      {calc && (
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                          <span>Taxable: <strong className="text-slate-900 dark:text-white font-bold">₹{calc.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                          <span>GST ({item.gstRate}%): <strong className="text-indigo-600 dark:text-indigo-400 font-bold">₹{calc.gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                          <span>Line Total: <strong className="text-emerald-600 dark:text-emerald-400 font-black">₹{calc.totalItem.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Item Button */}
              <button
                onClick={handleAddItem}
                className="w-full py-2.5 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-dashed border-indigo-300 dark:border-indigo-800 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Item / Service Row
              </button>

              {/* Extra Charges & Round off toggles */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 block border-b border-slate-200/80 dark:border-slate-800 pb-1">
                  Additional Adjustments
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">Other Charges Label</label>
                    <input
                      type="text"
                      value={otherChargesLabel}
                      onChange={(e) => setOtherChargesLabel(e.target.value)}
                      placeholder="Shipping / Freight / Packaging"
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">Other Charges Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={otherCharges}
                      onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">Amount Received / Advance (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">Tax Breakdown Override</label>
                    <select
                      value={taxOverride}
                      onChange={(e) => setTaxOverride(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                    >
                      <option value="auto">Auto (Compare Supplier vs Place of Supply State)</option>
                      <option value="intra">Intra-State (Force CGST + SGST)</option>
                      <option value="inter">Inter-State (Force IGST)</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoRoundOff}
                    onChange={(e) => setAutoRoundOff(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-indigo-600 cursor-pointer"
                  />
                  Automatically round off grand total to nearest rupee
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveFormSection('customer')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveFormSection('payment')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Next: Payment Details →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5 — PAYMENT DETAILS */}
          {activeFormSection === 'payment' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> SECTION 5 — Payment & Bank Details (Optional)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={payment.bankName}
                    onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
                    placeholder="HDFC Bank"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={payment.accountName}
                    onChange={(e) => setPayment({ ...payment, accountName: e.target.value })}
                    placeholder="ABC Enterprises"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={payment.accountNumber}
                    onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })}
                    placeholder="50200012345678"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={payment.ifsc}
                    onChange={(e) => setPayment({ ...payment, ifsc: e.target.value.toUpperCase() })}
                    placeholder="HDFC0001234"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium uppercase outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1">UPI VPA ID (For Auto QR Code)</label>
                  <input
                    type="text"
                    value={payment.upiId}
                    onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                    placeholder="e.g. abcenterprises@hdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-normal mt-1 block">
                    Generates a instant scan-to-pay UPI QR code embedded on the printed invoice.
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveFormSection('items')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveFormSection('terms')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Next: Terms & Signature →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6 — TERMS & SIGNATURE */}
          {activeFormSection === 'terms' && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" /> SECTION 6 — Terms & Authorized Signatory
                </h3>
              </div>

              <div className="space-y-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Terms & Conditions</label>
                  <textarea
                    rows={4}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Enter payment terms, warranty info, or notes..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Signatory Title</label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    placeholder="Authorized Signatory / For ABC Enterprises"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>

                {/* Signature Upload */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Digital Signature Stamp Image (Optional)</label>
                  <div className="flex items-center gap-3">
                    {signatureUrl ? (
                      <div className="relative group w-24 h-12 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white flex items-center justify-center p-1">
                        <img src={signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                        <button
                          onClick={() => setSignatureUrl(null)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Signature"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4 text-indigo-500" /> Upload Signature Image
                        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleSignatureUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveFormSection('payment')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    setActiveTab('preview');
                    if (onShowToast) onShowToast('Invoice complete! Switched to live preview.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Eye className="w-3.5 h-3.5" /> View Live Invoice Preview
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REAL-TIME LIVE INVOICE PREVIEW (A4 PRINTABLE DOCUMENT) */}
        <div className={`lg:col-span-6 space-y-4 ${activeTab === 'form' ? 'hidden lg:block' : 'block'}`}>
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" /> LIVE INVOICE PREVIEW (A4)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Updates in real-time
            </span>
          </div>

          {/* PRINTABLE A4 CONTAINER WITH CRISP TYPOGRAPHY */}
          <div className="bg-slate-200/60 dark:bg-slate-900/80 p-2 sm:p-4 rounded-3xl overflow-x-auto shadow-inner border border-slate-300/50 dark:border-slate-800">
            
            <div
              id="invoice-document-preview"
              ref={previewRef}
              className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl mx-auto w-full max-w-[794px] min-h-[1050px] text-[11px] leading-snug font-sans flex flex-col justify-between print:shadow-none print:p-0 print:m-0"
            >
              {/* DOCUMENT TOP HEADER */}
              <div className="space-y-6">
                
                {/* Title & Type */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 gap-4">
                  <div>
                    {supplier.logoUrl ? (
                      <img src={supplier.logoUrl} alt="Logo" className="h-12 max-w-[180px] object-contain mb-2" />
                    ) : (
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{supplier.businessName || 'BUSINESS NAME'}</h2>
                    )}
                    <p className="font-bold text-slate-800 text-[12px]">{supplier.businessName}</p>
                    <p className="text-slate-600 whitespace-pre-line">{supplier.address}</p>
                    <p className="text-slate-600">{supplier.city}{supplier.city && supplier.state ? ', ' : ''}{supplier.state} {supplier.pinCode && `- ${supplier.pinCode}`}</p>
                    <p className="text-slate-700 font-bold mt-1">GSTIN: <span className="font-extrabold text-slate-900">{supplier.gstin || 'N/A'}</span></p>
                    {supplier.phone && <p className="text-slate-600">Ph: {supplier.phone}</p>}
                    {supplier.email && <p className="text-slate-600">Email: {supplier.email}</p>}
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-md">
                      {invoiceMeta.invoiceType || 'TAX INVOICE'}
                    </span>
                    <div className="pt-2 text-slate-800 font-medium">
                      <p><strong className="text-slate-900">Invoice No:</strong> <span className="font-black text-indigo-900">{invoiceMeta.invoiceNumber}</span></p>
                      <p><strong className="text-slate-900">Date:</strong> {invoiceMeta.invoiceDate}</p>
                      {invoiceMeta.dueDate && <p><strong className="text-slate-900">Due Date:</strong> {invoiceMeta.dueDate}</p>}
                      <p><strong className="text-slate-900">Place of Supply:</strong> {invoiceMeta.placeOfSupply} ({supplier.stateCode})</p>
                      <p><strong className="text-slate-900">Reverse Charge:</strong> {invoiceMeta.reverseCharge}</p>
                    </div>
                  </div>
                </div>

                {/* BILL TO / SHIP TO TWO-COLUMN GRID */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* Bill To */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">BILL TO:</span>
                    <h3 className="font-extrabold text-slate-900 text-[12px]">{customer.customerName || 'Customer Name'}</h3>
                    {customer.customerGstin && (
                      <p className="font-bold text-slate-800">GSTIN: <span className="font-black">{customer.customerGstin}</span></p>
                    )}
                    <p className="text-slate-600 whitespace-pre-line">{customer.billingAddress}</p>
                    <p className="text-slate-600">{customer.city}{customer.city && customer.state ? ', ' : ''}{customer.state} {customer.pinCode && `- ${customer.pinCode}`}</p>
                    {customer.phone && <p className="text-slate-600">Ph: {customer.phone}</p>}
                  </div>

                  {/* Ship To */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">SHIP TO:</span>
                    {customer.sameAsBilling ? (
                      <p className="text-slate-500 italic">Same as Billing Address</p>
                    ) : (
                      <>
                        <h3 className="font-extrabold text-slate-900 text-[12px]">{customer.customerName}</h3>
                        <p className="text-slate-600 whitespace-pre-line">{customer.shippingAddress}</p>
                        <p className="text-slate-600">{customer.shippingCity}{customer.shippingCity && customer.shippingState ? ', ' : ''}{customer.shippingState} {customer.shippingPinCode && `- ${customer.shippingPinCode}`}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                        <th className="p-2 w-8 text-center">#</th>
                        <th className="p-2">Item / Description</th>
                        <th className="p-2 text-center w-16">HSN/SAC</th>
                        <th className="p-2 text-center w-14">Qty</th>
                        <th className="p-2 text-right w-20">Rate (₹)</th>
                        <th className="p-2 text-right w-20">Taxable (₹)</th>
                        <th className="p-2 text-center w-14">GST %</th>
                        <th className="p-2 text-right w-20">GST Amt (₹)</th>
                        <th className="p-2 text-right w-24">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {items.map((item, idx) => {
                        const calc = totals.itemCalculations[idx];
                        return (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                            <td className="p-2 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-2">
                              <span className="font-bold text-slate-900 block">{item.name || 'Unnamed Item'}</span>
                              {item.description && <span className="text-[10px] text-slate-500 block">{item.description}</span>}
                            </td>
                            <td className="p-2 text-center font-mono text-slate-600">{item.hsn || '-'}</td>
                            <td className="p-2 text-center font-bold">{item.quantity} {item.unit}</td>
                            <td className="p-2 text-right font-medium">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-right font-semibold">{calc?.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-center font-bold">{item.gstRate}%</td>
                            <td className="p-2 text-right font-semibold">{calc?.gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-right font-extrabold text-slate-900">{calc?.totalItem.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* TOTALS & TAX BREAKDOWN GRID */}
                <div className="grid grid-cols-12 gap-4 items-start pt-2">
                  
                  {/* Left Column: Amount in Words */}
                  <div className="col-span-7 space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">AMOUNT IN WORDS:</span>
                      <p className="font-bold text-slate-900 text-[11px] capitalize">
                        {numberToIndianWords(totals.grandTotal)}
                      </p>
                    </div>

                    {/* GST Breakdown Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden text-[10px]">
                      <div className="bg-slate-100 p-1.5 font-bold uppercase text-slate-700 border-b border-slate-200">
                        GST Tax Breakdown ({totals.isIntraState ? 'Intra-State: CGST + SGST' : 'Inter-State: IGST'})
                      </div>
                      <div className="p-2 space-y-1 font-medium text-slate-700">
                        {totals.isIntraState ? (
                          <>
                            <div className="flex justify-between">
                              <span>Central Tax (CGST):</span>
                              <strong className="text-slate-900">₹{totals.totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>State Tax (SGST):</span>
                              <strong className="text-slate-900">₹{totals.totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <span>Integrated Tax (IGST):</span>
                            <strong className="text-slate-900">₹{totals.totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
                          <span>Total Tax Amount:</span>
                          <span>₹{totals.totalGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Financial Summary Table */}
                  <div className="col-span-5 border border-slate-300 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="p-2 space-y-1.5 text-right font-medium text-slate-700">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal (Gross):</span>
                        <span>₹{totals.grossSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>

                      {totals.totalDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Total Discount:</span>
                          <span>- ₹{totals.totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                        <span>Total Taxable Value:</span>
                        <span>₹{totals.totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>

                      {totals.isIntraState ? (
                        <>
                          <div className="flex justify-between text-slate-600">
                            <span>CGST:</span>
                            <span>₹{totals.totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>SGST:</span>
                            <span>₹{totals.totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between text-slate-600">
                          <span>IGST:</span>
                          <span>₹{totals.totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      {totals.otherCharges > 0 && (
                        <div className="flex justify-between text-slate-700">
                          <span>{otherChargesLabel}:</span>
                          <span>₹{totals.otherCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      {autoRoundOff && totals.roundOffDiff !== 0 && (
                        <div className="flex justify-between text-slate-500 text-[10px]">
                          <span>Round Off:</span>
                          <span>{totals.roundOffDiff > 0 ? '+' : ''}₹{totals.roundOffDiff.toFixed(2)}</span>
                        </div>
                      )}

                      {/* GRAND TOTAL ROW */}
                      <div className="flex justify-between items-center bg-slate-900 text-white p-2 rounded-lg font-black text-sm mt-1">
                        <span>GRAND TOTAL:</span>
                        <span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                      </div>

                      {amountReceived > 0 && (
                        <>
                          <div className="flex justify-between text-emerald-700 font-bold pt-1">
                            <span>Amount Received:</span>
                            <span>₹{amountReceived.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-rose-700 font-extrabold text-xs">
                            <span>BALANCE DUE:</span>
                            <span>₹{totals.balanceDue.toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>

                {/* BANK DETAILS & UPI QR CODE SECTION */}
                {(payment.bankName || payment.upiId) && (
                  <div className="grid grid-cols-12 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 items-center">
                    <div className="col-span-8 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">BANK & PAYMENT DETAILS:</span>
                      {payment.bankName && <p className="text-slate-800"><strong className="text-slate-900">Bank:</strong> {payment.bankName}</p>}
                      {payment.accountName && <p className="text-slate-800"><strong className="text-slate-900">Account Name:</strong> {payment.accountName}</p>}
                      {payment.accountNumber && <p className="text-slate-800"><strong className="text-slate-900">Account No:</strong> <span className="font-mono font-bold">{payment.accountNumber}</span></p>}
                      {payment.ifsc && <p className="text-slate-800"><strong className="text-slate-900">IFSC Code:</strong> <span className="font-mono font-bold">{payment.ifsc}</span></p>}
                      {payment.upiId && <p className="text-slate-800"><strong className="text-slate-900">UPI ID:</strong> <span className="font-mono font-bold text-indigo-900">{payment.upiId}</span></p>}
                    </div>

                    {/* UPI QR CODE */}
                    {upiQrDataUrl && (
                      <div className="col-span-4 flex flex-col items-center justify-center text-center border-l border-slate-200 pl-3">
                        <img src={upiQrDataUrl} alt="UPI QR" className="w-20 h-20 border border-slate-300 rounded-md p-1 bg-white" />
                        <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase flex items-center gap-0.5">
                          <QrCode className="w-2.5 h-2.5 text-indigo-600" /> SCAN TO PAY UPI
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* DOCUMENT BOTTOM FOOTER (TERMS & SIGNATURE) */}
              <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-4 items-end">
                {/* Terms */}
                <div className="text-[9px] text-slate-600 space-y-1">
                  <span className="font-black uppercase text-slate-800 block">TERMS & CONDITIONS:</span>
                  <p className="whitespace-pre-line leading-normal font-medium">{terms}</p>
                </div>

                {/* Signatory Box */}
                <div className="text-end space-y-2 flex flex-col items-end">
                  {signatureUrl ? (
                    <img src={signatureUrl} alt="Signature" className="h-12 max-w-[140px] object-contain mb-1" />
                  ) : (
                    <div className="h-10"></div>
                  )}
                  <div className="border-t border-slate-800 pt-1 w-44 text-center">
                    <p className="font-extrabold text-slate-900 text-[10px] uppercase">{signatoryName}</p>
                    <p className="text-[9px] text-slate-500 font-bold">Authorized Signatory</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* DISCLAIMERS & E-INVOICING NOTES */}
          <div className="space-y-2 px-1 text-[11px] text-slate-500 dark:text-slate-400">
            <p className="italic">
              * <strong className="font-semibold">Disclaimer:</strong> This tool generates an invoice document based on the information you provide. GST applicability, tax rate, HSN/SAC classification and other compliance requirements should be verified by the taxpayer or a qualified tax professional.
            </p>
            <p className="italic">
              * <strong className="font-semibold">Note on E-Invoicing:</strong> GST e-invoicing, where applicable, requires registration through the prescribed Invoice Registration Portal (IRP) process.
            </p>
          </div>

        </div>

      </div>

      {/* SEO FAQs & INFORMATIONAL SECTION */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 mt-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            GST Invoice FAQ & Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions about GST Invoices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> What is a GST invoice?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A GST invoice is a legal document issued by a GST-registered business to a customer for goods or services supplied. It details supplier and recipient GSTINs, HSN/SAC codes, itemized values, applicable tax rates (CGST, SGST, or IGST), and total payable amount.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Can I create a GST invoice for free?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! Zubware's GST Invoice Generator is 100% free with no watermarks, registration, or monthly subscription fees.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Does the tool calculate CGST, SGST & IGST?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. The tool automatically detects whether the transaction is intra-state (same supplier & customer state) or inter-state. For intra-state sales, it splits the tax equally into CGST and SGST. For inter-state sales, it applies IGST.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Can I download the invoice as PDF or Print?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! You can download a high-resolution A4 PDF document directly to your device or print it formatted with one click.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Can I add my business logo & UPI QR code?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! You can upload your business logo and digital signature stamp, as well as enter your UPI ID to generate a scan-to-pay QR code embedded on the invoice.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Is my invoice data uploaded to any server?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No. All calculations, logo processing, QR generation, and PDF downloads happen 100% locally inside your Web browser. Your business data remains completely private.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
