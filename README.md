# DocPad Studio — Production Letter Pad & Document Editor

A production-ready Letter Pad and Document Editor web application built with **React**, **TypeScript**, **Vite**, **TipTap 2.x**, **Node.js**, **Express**, and **MongoDB**.

## 🌟 Key Features

### 1. Document & Letter Pad Workspace
- **Printable Canvas Simulation:** Realistic A4, Letter, and Legal paper dimensions with responsive zoom (50% to 175%) and shadow styling.
- **Custom Margins:** Standard Normal (25mm), Narrow (12.7mm), Wide (35mm), or custom top/bottom/left/right measurements in mm/in.
- **Orientation:** Instant switching between Portrait and Landscape.

### 2. Corporate Letterhead & Letter Pad System
- **Company Header:** Logo upload (PNG/JPG/SVG/WebP), Company Name, Tax / GST Registration Number, Full Address, Phone, Email, Website.
- **Header Layout Styles:** Classic, Modern (accent line), Minimal, Centered.
- **Structured Letter Pad Blocks:** Reference Number, Date, Recipient Name / Designation / Org / Address (To:), Subject Line with formal emphasis.
- **Signatory & Seal:** Signatory Name, Designation, Org, Digital Signature image, and Official Stamp image upload.
- **Page Footers:** Customizable confidentiality taglines, automatic page numbers (*Page 1 of 1*), and generated date stamps.

### 3. Rich Text Editing & Typography
- **Google Docs Style Ribbon:** Font Family (Inter, Roboto, Outfit, Playfair Display, Merriweather, Lora, Cinzel, JetBrains Mono, Dancing Script), Font Size (9pt–36pt), Headings (H1, H2, H3, Normal Text).
- **Text Styling:** Bold, Italic, Underline, Strikethrough, Text Color Picker, Highlighter Color Picker, Superscript, Subscript.
- **Paragraphs & Layout:** Align Left, Center, Right, Justify, Line Spacing (1.0 to 2.0), Bulleted Lists, Numbered Lists, Indentation, Horizontal Dividers, and Page Breaks.

### 4. Advanced Insert & Tables
- **Full Table Editor:** Contextual floating toolbar for adding rows above/below, adding columns left/right, deleting rows/cols, merging cells, splitting cells, and toggling header rows.
- **Image Insertion:** Upload local images (with base64 encoding) or insert via Web URL with alt descriptions.
- **Hyperlinks:** Add, edit, or remove interactive web links.

### 5. Document Management & Autosave
- **Autosave Engine:** Debounced autosave (1.5 seconds) with cloud synchronization badges (*Saving...*, *All changes saved*, *Error retry*).
- **Keyboard Shortcuts:** `Ctrl+S` (Save), `Ctrl+P` (Print), `Ctrl+Z` / `Ctrl+Y` (Undo/Redo), `Ctrl+B`, `Ctrl+I`, `Ctrl+U`.
- **Dashboard:** Search documents in real-time, filter by folders/categories, sort by Last Modified / Created Date / Title, grid and list view toggle, duplicate documents, rename documents, and delete.

### 6. Template Engine
- **Pre-seeded Templates:** Executive Letter Pad, Formal Business Proposal, Internal Memorandum (Memo), Tax Invoice / Bill of Services.
- **Custom Templates:** Save any current document layout, header, footer, and styling as a reusable custom template.

### 7. High-Fidelity Print & PDF
- **Dedicated `@media print` CSS:** Cleans away navigation bars, toolbars, and borders while preserving high-resolution print margins.
- **Direct PDF Export:** Client-side vector-accurate PDF generation matching exact page dimensions and orientation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ or v22+
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or cloud MongoDB URI via `backend/.env`)

### Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend API server (runs on `http://localhost:5000`):
   ```bash
   cd backend
   npm run dev
   ```

2. In a second terminal, start the frontend Vite development server (runs on `http://localhost:5173`):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.
