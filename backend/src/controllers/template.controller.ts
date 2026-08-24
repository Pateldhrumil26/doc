import { Request, Response, NextFunction } from 'express';
import { TemplateModel } from '../models/Template.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

// Pre-seeded professional templates data
export const defaultTemplates = [
  {
    name: 'Aesthetic Arc Letter Pad',
    description: 'Designer corporate letterhead with gradient header banner, bottom corner waves, and city skyline graphic',
    category: 'letterpad',
    isPublic: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 18, bottom: 26, left: 18, right: 18, unit: 'mm' },
    header: {
      enabled: true,
      companyName: 'AESTHETIC ARC',
      address: '504, Venus Atlantis Corporate Park, 100ft Road, Prahlad Nagar, Satellite, Ahmedabad - 380015, India',
      phone: '+91 9825 0201 73',
      email: 'connect@aestheticarc.com',
      website: 'aestheticarc.com',
      gst: '24ABCDE1234F1Z5',
      layout: 'aesthetic',
      height: 90,
    },
    footer: {
      enabled: true,
      address: '504, Venus Atlantis Corporate Park, 100ft Road, Prahlad Nagar, Satellite, Ahmedabad - 380015, India',
      customText: '',
      showPageNumber: false,
      showDate: false,
      layout: 'aesthetic',
      height: 100,
    },
    letterpadConfig: {
      isLetterpadMode: true,
      refNo: 'ARC/2026/0892',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Mr. Rajesh Sharma',
      recipientDesignation: 'Executive Director',
      recipientOrg: 'Apex Infrastructure Pvt. Ltd.',
      recipientAddress: 'SG Highway, Bodakdev, Ahmedabad - 380054',
      subject: 'Architectural & Interior Design Consultancy Proposal',
      regardsName: 'Ar. Jaymin Patel',
      regardsDesignation: 'Principal Architect & Creative Director',
      regardsOrg: 'Aesthetic Arc Studio',
    },
    content: `
      <p>Dear Mr. Sharma,</p>
      <p>Thank you for expressing interest in our architectural and structural consultancy services for your prestigious commercial project. Aesthetic Arc specializes in contemporary design methodologies, smart spatial planning, and high-efficiency building aesthetics.</p>
      <p>We have carefully evaluated your initial project scope and requirements. Enclosed within this correspondence is our comprehensive concept brief, design timeline, and consultation framework tailored specifically to elevate your commercial landmark.</p>
      <p>Our multidisciplinary design team is prepared to present the preliminary 3D spatial elevations and schematic blueprints during our scheduled consultation next week.</p>
      <p>We look forward to forging a creative and visionary collaboration.</p>
    `,
  },
  {
    name: 'Executive Letter Pad',
    description: 'Modern corporate letterhead with company branding, contact banner, and formal sign-off',
    category: 'letterpad',
    isPublic: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, bottom: 20, left: 20, right: 20, unit: 'mm' },
    header: {
      enabled: true,
      companyName: 'ACME INNOVATIONS CORP.',
      address: 'Suite 400, Silicon Avenue, Tech Hub, CA 94016',
      phone: '+1 (555) 019-2834',
      email: 'contact@acmeinnovations.com',
      website: 'www.acmeinnovations.com',
      gst: 'TAX-9847291-US',
      layout: 'modern',
      height: 110,
    },
    footer: {
      enabled: true,
      customText: 'This document is confidential and proprietary to ACME Innovations Corp.',
      showPageNumber: true,
      showDate: true,
      layout: 'split',
      height: 50,
    },
    letterpadConfig: {
      isLetterpadMode: true,
      refNo: 'REF/ACME/2026/0482',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Mr. Alexander Wright',
      recipientDesignation: 'Chief Technology Officer',
      recipientOrg: 'Vanguard Global Enterprise',
      recipientAddress: '100 Broadway, 18th Floor, New York, NY 10005',
      subject: 'Formal Letter of Engagement & Partnership Memorandum',
      regardsName: 'Sarah Jenkins',
      regardsDesignation: 'Managing Director & VP of Operations',
      regardsOrg: 'ACME Innovations Corp.',
    },
    content: `
      <p>Dear Mr. Wright,</p>
      <p>We are pleased to submit this formal communication regarding our collaborative enterprise initiative. Following our comprehensive strategic discussions over the past month, we have finalized the operational framework and milestone deliverables designed to streamline our joint enterprise solutions.</p>
      <p>Our dedicated engineering and solutions architecture teams stand prepared to initiate Phase 1 deployment commencing on the first week of next month. All compliance, data privacy, and SLA governance guidelines will adhere strictly to our Master Services Agreement.</p>
      <p>Should you require any further clarification or preliminary technical documentation, please do not hesitate to reach out directly to our operations office.</p>
      <p>We look forward to an enduring and high-impact partnership.</p>
    `,
  },
  {
    name: 'Formal Business Proposal',
    description: 'Structured proposal template with executive summary, scope table, and terms',
    category: 'proposal',
    isPublic: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 25, bottom: 25, left: 25, right: 25, unit: 'mm' },
    header: {
      enabled: true,
      companyName: 'STRATOSPHERE SOLUTIONS LLC',
      address: '742 Evergreen Blvd, Level 12, Seattle, WA 98101',
      phone: '+1 (800) 456-7890',
      email: 'solutions@stratosphere.io',
      website: 'www.stratosphere.io',
      layout: 'classic',
      height: 100,
    },
    footer: {
      enabled: true,
      customText: 'Stratosphere Solutions • Proprietary Business Proposal',
      showPageNumber: true,
      showDate: true,
      layout: 'split',
      height: 50,
    },
    letterpadConfig: {
      isLetterpadMode: false,
    },
    content: `
      <h1 style="text-align: center; color: #1e3a8a;">PROJECT PROPOSAL & ROADMAP</h1>
      <p style="text-align: center; color: #64748b;">Prepared for Enterprise Client | Q3 2026</p>
      <hr />
      <h2>1. Executive Overview</h2>
      <p>This proposal details our turn-key approach to modernizing digital infrastructure, optimizing performance metrics, and securing high-availability cloud services across multi-region clusters.</p>
      <h2>2. Project Deliverables & Timeline</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Phase</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Description</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Duration</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Estimated Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Architecture Audit & Discovery</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">2 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">$15,000</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Platform Engineering & Testing</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">6 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">$45,000</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 3</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Production Deployment & Handoff</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">2 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">$12,000</td>
          </tr>
        </tbody>
      </table>
      <h2>3. Next Steps</h2>
      <p>Upon acceptance of this document, we will schedule the initial kickoff discovery meeting and issue the formal statement of work.</p>
    `,
  },
  {
    name: 'Internal Memorandum (Memo)',
    description: 'Clean inter-office memo for executive announcements and policy updates',
    category: 'memo',
    isPublic: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 25, bottom: 25, left: 25, right: 25, unit: 'mm' },
    header: {
      enabled: true,
      companyName: 'GLOBAL HORIZONS GROUP',
      address: 'Corporate Headquarters, Chicago, IL',
      layout: 'minimal',
      height: 80,
    },
    footer: {
      enabled: true,
      showPageNumber: true,
      customText: 'Internal Memorandum - For Internal Distribution Only',
      layout: 'centered',
      height: 45,
    },
    letterpadConfig: {
      isLetterpadMode: false,
    },
    content: `
      <h1 style="color: #0f172a; margin-bottom: 20px;">MEMORANDUM</h1>
      <p><strong>TO:</strong> All Department Leads & Team Members</p>
      <p><strong>FROM:</strong> Office of the Chief Operating Officer</p>
      <p><strong>DATE:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p><strong>SUBJECT:</strong> Implementation of Enhanced Digital Documentation Standards</p>
      <hr />
      <h3>Background & Objective</h3>
      <p>In our ongoing effort to enhance operational efficiency and maintain uniform brand presentation across all client-facing and internal communications, we are rolling out standardized letterhead and document templates across all divisions.</p>
      <h3>Action Items</h3>
      <ul>
        <li>Review all pending correspondence against the updated letter pad guidelines.</li>
        <li>Ensure correct company headers, GST numbers, and signatures are populated.</li>
        <li>Direct any template customization queries to the communications department.</li>
      </ul>
      <p>Thank you for your dedication to operational excellence.</p>
    `,
  },
  {
    name: 'Standard Invoice / Bill of Services',
    description: 'Billing document template with tabular item breakdown, bank details, and terms',
    category: 'invoice',
    isPublic: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, bottom: 20, left: 20, right: 20, unit: 'mm' },
    header: {
      enabled: true,
      companyName: 'VERTEX CREATIVE STUDIO',
      address: '250 Design Way, Austin, TX 78701',
      phone: '+1 (512) 998-1122',
      email: 'billing@vertexstudio.com',
      website: 'www.vertexstudio.com',
      gst: 'US-EIN-44910284',
      layout: 'modern',
      height: 110,
    },
    footer: {
      enabled: true,
      customText: 'Thank you for your business! Payment is due within 30 days.',
      showPageNumber: true,
      showDate: false,
      layout: 'centered',
      height: 50,
    },
    letterpadConfig: {
      isLetterpadMode: false,
    },
    content: `
      <h2 style="color: #1e293b; margin-bottom: 10px;">TAX INVOICE</h2>
      <p><strong>Invoice Number:</strong> INV-2026-0914<br /><strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br /><strong>Due Date:</strong> Net 30 Days</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: left;">Item Description</th>
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: center;">Qty / Hrs</th>
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">Unit Rate</th>
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">UI/UX Design & Typography System</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: center;">40 hrs</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">$120.00</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">$4,800.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">Frontend Application Implementation</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: center;">60 hrs</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">$140.00</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">$8,400.00</td>
          </tr>
          <tr style="font-weight: bold; background-color: #f8fafc;">
            <td colspan="3" style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">Total Payable:</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px; text-align: right;">$13,200.00</td>
          </tr>
        </tbody>
      </table>
    `,
  },
];

export const getTemplates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    // Ensure all pre-seeded default templates exist in database
    for (const tpl of defaultTemplates) {
      const exists = await TemplateModel.findOne({ name: tpl.name, isPublic: true });
      if (!exists) {
        await TemplateModel.create(tpl);
      }
    }

    const templates = await TemplateModel.find({
      $or: [{ isPublic: true }, { createdBy: userId }],
    }).sort({ isPublic: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: { templates },
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await TemplateModel.findById(id);

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { template },
    });
  } catch (error) {
    next(error);
  }
};

export const createTemplate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const {
      name,
      description,
      category,
      thumbnail,
      content,
      header,
      footer,
      letterpadConfig,
      pageSize,
      orientation,
      margins,
    } = req.body;

    if (!name) {
      throw new AppError('Template name is required', 400);
    }

    const template = await TemplateModel.create({
      name,
      description: description || '',
      category: category || 'custom',
      thumbnail: thumbnail || '',
      content: content || '<p></p>',
      header,
      footer,
      letterpadConfig,
      pageSize: pageSize || 'A4',
      orientation: orientation || 'portrait',
      margins: margins || { top: 25, bottom: 25, left: 25, right: 25, unit: 'mm' },
      isPublic: false,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: { template },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const template = await TemplateModel.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!template) {
      throw new AppError('Custom template not found or unauthorized', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
