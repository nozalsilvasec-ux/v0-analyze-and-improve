# User Flow Documentation

## Overview

This document describes the end-to-end user flows for two primary template creation methods:
1. **Create Template** - Build a new template from scratch
2. **Upload Document** - Import an existing document to convert into a template

---

## Section 1: Create Template Flow

### Flow Diagram
```
[Templates Page] → [Click "Create Template"] → [/templates/new] → [Fill Details] → [Select Starter] → [Create] → [API Calls] → [Editor]
```

### Detailed Steps

#### Step 1: User Initiates Creation
- **Location**: `/templates` page
- **Action**: User clicks the "Create Template" button (blue gradient button with + icon)
- **System**: Navigates to `/templates/new`

#### Step 2: Template Details Form
- **Location**: `/templates/new` page
- **User Actions**:
  1. **Template Name** (Required)
     - Input field with placeholder "e.g., Sales Proposal Template"
     - Validation: Must not be empty
  2. **Description** (Optional)
     - Textarea with placeholder "Describe what this template is for..."
  3. **Category** (Required, default: "Sales")
     - Dropdown with options: Sales, Marketing, Engineering, Design, Consulting, Finance, Product, HR, Legal, Other

#### Step 3: Select Starting Point
- **User Action**: Choose one of four template starters:

| Starter | Description | Pre-built Sections |
|---------|-------------|-------------------|
| **Blank Template** | Start from scratch | Hero only |
| **Business Proposal** | Professional proposal | Hero, Executive Summary, Scope of Work, Pricing |
| **Project Proposal** | Detailed project plan | Hero, Project Overview, Timeline & Milestones, Deliverables |
| **Consulting Proposal** | Service-focused | Hero, Understanding Your Needs, Our Approach, Expected Outcomes |

#### Step 4: Submit Creation
- **User Action**: Click "Create Template" button
- **Validation**:
  - If name is empty → Show alert "Please enter a template name"
  - If valid → Proceed to API calls

#### Step 5: System Processing
- **API Call 1**: `POST /api/templates`
  ```json
  {
    "name": "User's Template Name",
    "description": "Optional description",
    "category": "Sales",
    "content": { /* starter content */ },
    "is_public": false
  }
  ```
  - **Success**: Returns `{ template: { id, name, ... } }`
  - **Error**: Returns `{ error: "message" }` → Show alert, stop flow

- **API Call 2**: `POST /api/proposals`
  ```json
  {
    "template_id": "created-template-id",
    "name": "User's Template Name",
    "source_type": "template"
  }
  ```
  - **Success**: Returns `{ proposal: { id, ... } }`
  - **Error**: Redirect to `/templates` (graceful fallback)

#### Step 6: Completion
- **Success**: Redirect to `/editor/{proposal.id}`
- **User**: Can now edit the proposal in the full editor

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty template name | Alert "Please enter a template name", prevent submission |
| API template creation fails | Alert "Failed to create template. Please try again.", stay on page |
| API proposal creation fails | Redirect to `/templates` (template still created) |
| Network error | Caught in try/catch, alert shown |
| User cancels | "Cancel" button redirects to `/templates` |

### State Indicators
- **isCreating**: Shows loading spinner on button, disables interaction
- **Button States**: Disabled when `isCreating || !name.trim()`

---

## Section 2: Upload Document Flow

### Flow Diagram
```
[Templates Page] → [Click "Upload Document"] → [File Selection] → [Validation] → [Text Extraction] → [Content Populated] → [Continue to Analyze/Edit]
```

### Detailed Steps

#### Step 1: User Initiates Upload
- **Location**: `/templates` page OR AI Proposal Studio
- **Action**: User clicks "Upload Document" button (emerald gradient)
- **Alternative**: Drag and drop file onto designated area

#### Step 2: File Selection
- **Methods**:
  1. Click button → Opens file picker dialog
  2. Drag and drop file onto drop zone
  3. Paste content directly (text only)

#### Step 3: File Validation
- **Supported File Types**:
  | Type | MIME Type | Extension |
  |------|-----------|-----------|
  | Plain Text | `text/plain` | .txt |
  | PDF | `application/pdf` | .pdf |
  | Word Document | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | .docx |

- **Size Limit**: 10MB maximum

- **Validation Errors**:
  | Error | Message |
  |-------|---------|
  | Unsupported type | "Unsupported file type. Please upload a PDF, DOCX, or TXT file." |
  | File too large | "File size exceeds 10MB limit." |

#### Step 4: Text Extraction Process

**For TXT Files (Client-side)**:
```
File → file.text() → Content populated
```
- Direct text reading, no server call needed

**For DOCX Files (Client-side)**:
```
File → JSZip.loadAsync() → Extract word/document.xml → Parse <w:t> tags → Content populated
```
- Uses JSZip library to unpack DOCX
- Extracts text from XML structure
- Preserves paragraph breaks

**For PDF Files (Server-side)**:
```
File → FormData → POST /api/studio/extract → Parse PDF → Content populated
```
- Requires server-side processing
- API extracts text and returns it

#### Step 5: Content Population
- **Success**: 
  - Extracted text populates the content area
  - Success banner shows: "Successfully loaded {filename} ({filetype})"
  - Banner auto-dismisses after 3 seconds

- **Error**:
  - Error banner shows specific error message
  - User can dismiss manually
  - Original content preserved

#### Step 6: Continue Workflow
- **In AI Studio**: User can now click "Analyze" to process the content
- **In Templates**: Content ready for template creation

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Unsupported file type | Error state, message displayed, upload rejected |
| File > 10MB | Error state, message displayed, upload rejected |
| Empty/corrupted DOCX | Error: "Could not extract text from DOCX. Please try copying and pasting the text directly." |
| PDF extraction fails | Server returns error, displayed to user |
| Network error during PDF upload | Caught in try/catch, error displayed |
| User drops multiple files | Only first file processed |
| Paste empty content | No change to existing content |

### Upload States

| State | Visual Indicator |
|-------|------------------|
| `idle` | Normal appearance |
| `uploading` | Blue banner, spinner, "Extracting text from {filename}..." |
| `success` | Green banner, checkmark, "Successfully loaded {filename}" |
| `error` | Red banner, alert icon, error message |

### Processing Indicators
- **Overlay**: Semi-transparent white overlay with centered spinner
- **Message**: Dynamic based on state ("Extracting text from PDF..." or "Analyzing your proposal...")
- **Disabled State**: Textarea and buttons disabled during processing

---

## Comparison: Create Template vs Upload Document

| Aspect | Create Template | Upload Document |
|--------|----------------|-----------------|
| **Starting Point** | Blank or pre-built structure | Existing document content |
| **User Input** | Name, description, category, starter | File selection only |
| **Processing** | API calls to create template + proposal | Client/server text extraction |
| **Result** | New template with structure, opens in editor | Text content ready for analysis/editing |
| **Best For** | Starting fresh with structure | Converting existing proposals |
| **Validation** | Name required | File type and size |
| **Time to Editor** | ~2-3 seconds | Depends on file size |

---

## Technical Architecture

### Create Template
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Supabase      │
│   /templates/   │───▶│   /api/         │───▶│   Database      │
│   new/page.tsx  │    │   templates     │    │   templates     │
└─────────────────┘    │   proposals     │    │   proposals     │
                       └─────────────────┘    └─────────────────┘
```

### Upload Document
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Processing    │
│   ProposalInput │───▶│   /api/studio/  │───▶│   PDF Parser    │
│   Component     │    │   extract       │    │   (pdf-parse)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │
        ▼ (DOCX/TXT - client-side)
┌─────────────────┐
│   JSZip /       │
│   FileReader    │
└─────────────────┘
```

---

## Security Considerations

1. **File Type Validation**: Both client and server validate MIME types
2. **File Size Limits**: 10MB limit prevents DoS attacks
3. **Content Sanitization**: Extracted text should be sanitized before rendering
4. **No Execution**: Uploaded files are only read, never executed
5. **Rate Limiting**: Consider implementing rate limits on API endpoints

---

## Future Enhancements

1. **Batch Upload**: Allow multiple document uploads
2. **Template Import/Export**: JSON-based template sharing
3. **Cloud Storage Integration**: Google Drive, Dropbox, OneDrive
4. **Version History**: Track template changes over time
5. **Collaborative Editing**: Real-time multi-user editing
6. **AI Enhancement**: Auto-suggest improvements after upload
