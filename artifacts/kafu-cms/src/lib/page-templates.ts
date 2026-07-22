import type { PageBlock } from "@/components/page-blocks-editor";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  summary: string;
  body: string;
  blocks: PageBlock[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty page.",
    summary: "",
    body: "",
    blocks: [],
  },
  {
    id: "info",
    name: "Information Page",
    description: "General page with an introduction, sections and highlights. Good for services, offices and departments.",
    summary: "A short one-sentence introduction shown under the page title. Replace this with your own.",
    body: `<p><strong>Start with a strong opening paragraph.</strong> Introduce what this page is about in two or three sentences so visitors immediately know they are in the right place.</p>

<h2>Overview</h2>
<p>Describe the service, office or topic in more detail here. Keep paragraphs short — three to four sentences each reads best on the website.</p>

<h2>What We Offer</h2>
<ul>
<li><strong>First item</strong> — a short description of the first key point or service.</li>
<li><strong>Second item</strong> — a short description of the second key point or service.</li>
<li><strong>Third item</strong> — a short description of the third key point or service.</li>
</ul>

<h2>How It Works</h2>
<ol>
<li>First step of the process, explained in one sentence.</li>
<li>Second step of the process.</li>
<li>Third step of the process.</li>
</ol>

<blockquote><p>Use a quote block like this one to highlight an important message, motto or testimonial.</p></blockquote>

<h2>Contact</h2>
<p>For more information, contact us at <a href="mailto:info@kafu.ac.ke">info@kafu.ac.ke</a> or call +254 777 373 633.</p>`,
    blocks: [],
  },
  {
    id: "event",
    name: "Event / Conference",
    description: "Full event page: about, key details table, programme themes, important dates, fees and contact.",
    summary: "Event dates, venue and a one-line description of the event. Replace this with your own.",
    body: `<p><strong>Kaimosi Friends University warmly invites you</strong> to this event. Use this opening paragraph to say who the event is for and why they should attend.</p>

<h2>Key Details</h2>
<table>
<thead><tr><th>Detail</th><th>Information</th></tr></thead>
<tbody>
<tr><td><strong>Dates</strong></td><td>DD–DD Month YYYY</td></tr>
<tr><td><strong>Venue</strong></td><td>Kaimosi Friends University, Kenya</td></tr>
<tr><td><strong>Format</strong></td><td>Physical / Virtual / Hybrid</td></tr>
<tr><td><strong>Theme</strong></td><td>The event theme goes here</td></tr>
</tbody>
</table>

<h2>About the Event</h2>
<p>Describe the purpose of the event, what participants can expect, and who will be attending. Two or three short paragraphs work well.</p>

<h2>Themes / Programme Areas</h2>
<ol>
<li><strong>First theme</strong> — short description.</li>
<li><strong>Second theme</strong> — short description.</li>
<li><strong>Third theme</strong> — short description.</li>
</ol>

<h2>Important Dates</h2>
<table>
<thead><tr><th>Milestone</th><th>Date</th></tr></thead>
<tbody>
<tr><td>Registration opens</td><td>Month DD, YYYY</td></tr>
<tr><td>Registration deadline</td><td>Month DD, YYYY</td></tr>
<tr><td>Event dates</td><td>Month DD–DD, YYYY</td></tr>
</tbody>
</table>

<h2>Fees</h2>
<table>
<thead><tr><th>Category</th><th>Fee</th></tr></thead>
<tbody>
<tr><td>Participants</td><td>KES 0,000</td></tr>
<tr><td>Students</td><td>KES 0,000</td></tr>
</tbody>
</table>

<h2>Registration & Contact</h2>
<p>To register or ask a question, email <a href="mailto:info@kafu.ac.ke">info@kafu.ac.ke</a>.</p>`,
    blocks: [],
  },
  {
    id: "call",
    name: "Announcement / Call for Applications",
    description: "Announcement with eligibility, how to apply, deadlines and required documents.",
    summary: "One-line description of what is being announced and the deadline. Replace this with your own.",
    body: `<p><strong>Kaimosi Friends University announces…</strong> — state clearly what is open (applications, tenders, nominations, submissions) and the closing date.</p>

<h2>Who Can Apply</h2>
<ul>
<li>First eligibility requirement.</li>
<li>Second eligibility requirement.</li>
<li>Third eligibility requirement.</li>
</ul>

<h2>How to Apply</h2>
<ol>
<li>First step — for example, prepare the required documents.</li>
<li>Second step — for example, complete the application form.</li>
<li>Third step — for example, submit by email or through the portal.</li>
</ol>

<h2>Required Documents</h2>
<ul>
<li>Document one</li>
<li>Document two</li>
<li>Document three</li>
</ul>

<h2>Key Dates</h2>
<table>
<thead><tr><th>Milestone</th><th>Date</th></tr></thead>
<tbody>
<tr><td>Applications open</td><td>Month DD, YYYY</td></tr>
<tr><td>Deadline</td><td>Month DD, YYYY</td></tr>
</tbody>
</table>

<h2>Enquiries</h2>
<p>Direct questions to <a href="mailto:info@kafu.ac.ke">info@kafu.ac.ke</a>.</p>`,
    blocks: [],
  },
  {
    id: "downloads",
    name: "Resources & Downloads",
    description: "A page that lists downloadable documents with a short introduction. Add files as content blocks.",
    summary: "Downloadable documents and resources. Replace this with your own description.",
    body: `<p>This page provides official documents and resources for download. Click any document below to download it.</p>

<h2>Available Documents</h2>
<p>Add each document as a <strong>Document download</strong> content block below — they will appear as styled download cards on the website.</p>`,
    blocks: [
      { id: "tpl-file-1", type: "file", url: "", label: "Replace with your document title" } as PageBlock,
    ],
  },
];
