"""
KAFU Digital Platform — PDF Manual Generator
Generates two PDFs using ReportLab Platypus:
  1. kafu-training-manual.pdf     (CMS + Staff Portal)
  2. kafu-comprehensive-manual.pdf (Sysadmin + Website User Guide)
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate

# ── Brand Colours ──────────────────────────────────────────────────────────
GREEN     = HexColor('#1A5C38')
GREEN_MID = HexColor('#2d7a52')
GREEN_LT  = HexColor('#e8f5ee')
GOLD      = HexColor('#C9A227')
GOLD_LT   = HexColor('#fdf8e7')
NAVY      = HexColor('#1e293b')
GRAY      = HexColor('#64748b')
LGRAY     = HexColor('#f8fafc')
BORDER    = HexColor('#e2e8f0')
RED       = HexColor('#dc2626')
BLUE      = HexColor('#2563eb')
BLUE_LT   = HexColor('#eff6ff')
AMBER     = HexColor('#d97706')
AMBER_LT  = HexColor('#fffbeb')
DARK_RED  = HexColor('#991b1b')

W, H = A4   # 595.27 x 841.89 pts

# ── Paths ──────────────────────────────────────────────────────────────────
BASE = '/home/runner/workspace'
SS   = os.path.join(BASE, 'screenshots')

def img(name, width=14*cm, height=None):
    """Return an Image flowable if file exists, else a placeholder paragraph."""
    path = os.path.join(SS, name)
    if not os.path.exists(path):
        return Paragraph(f'[Screenshot: {name}]', caption_style())
    try:
        if height:
            return Image(path, width=width, height=height)
        # preserve aspect ratio
        from PIL import Image as PILImg
        with PILImg.open(path) as im:
            w_px, h_px = im.size
        aspect = h_px / w_px
        return Image(path, width=width, height=width * aspect)
    except Exception:
        return Image(path, width=width)

# ── Style Helpers ──────────────────────────────────────────────────────────
def styles():
    s = getSampleStyleSheet()

    def add(name, **kw):
        if name not in s:
            s.add(ParagraphStyle(name=name, **kw))
        return s[name]

    add('CoverTitle',   fontName='Helvetica-Bold',   fontSize=32, textColor=white,    alignment=TA_CENTER, leading=40, spaceAfter=8)
    add('CoverSub',     fontName='Helvetica',         fontSize=15, textColor=HexColor('#cccccc'), alignment=TA_CENTER, spaceAfter=6)
    add('CoverMotto',   fontName='Helvetica-Oblique', fontSize=13, textColor=GOLD,    alignment=TA_CENTER, spaceAfter=30)
    add('CoverBadge',   fontName='Helvetica-Bold',    fontSize=10, textColor=white,   alignment=TA_CENTER, spaceAfter=20, backColor=GOLD)
    add('CoverMeta',    fontName='Helvetica',         fontSize=10, textColor=HexColor('#9ca3af'), alignment=TA_CENTER, spaceAfter=4)

    add('PartLabel',    fontName='Helvetica',         fontSize=11, textColor=HexColor('#86efac'), spaceAfter=4)
    add('PartTitle',    fontName='Helvetica-Bold',    fontSize=26, textColor=white,   spaceAfter=8, leading=32)
    add('PartDesc',     fontName='Helvetica',         fontSize=13, textColor=HexColor('#d1fae5'), spaceAfter=0)

    add('H1',           fontName='Helvetica-Bold',    fontSize=18, textColor=GREEN,   spaceBefore=24, spaceAfter=8, borderPadding=(0,0,4,0))
    add('H2',           fontName='Helvetica-Bold',    fontSize=14, textColor=GREEN_MID, spaceBefore=18, spaceAfter=6, leftIndent=0, borderColor=GOLD, borderPadding=(0,0,0,10), borderLeftWidth=3)
    add('H3',           fontName='Helvetica-Bold',    fontSize=12, textColor=NAVY,    spaceBefore=12, spaceAfter=4)
    add('Body',         fontName='Helvetica',         fontSize=10, textColor=NAVY,    leading=15,  spaceAfter=6)
    add('BodyJ',        fontName='Helvetica',         fontSize=10, textColor=NAVY,    leading=15,  spaceAfter=6, alignment=TA_JUSTIFY)
    add('BulletItem',   fontName='Helvetica',         fontSize=10, textColor=NAVY,    leading=14,  spaceAfter=3, leftIndent=14, bulletIndent=4)
    add('Caption',      fontName='Helvetica-Oblique', fontSize=9,  textColor=GRAY,    spaceAfter=12, alignment=TA_CENTER)
    add('Code',         fontName='Courier',           fontSize=9,  textColor=HexColor('#1e293b'), leading=13, backColor=HexColor('#f1f5f9'), spaceAfter=6, leftIndent=8, rightIndent=8, borderPadding=6)
    add('CodeDark',     fontName='Courier',           fontSize=9,  textColor=HexColor('#e2e8f0'), leading=13, backColor=HexColor('#0f172a'), spaceAfter=6, leftIndent=8, rightIndent=8, borderPadding=6)
    add('TOCEntry',     fontName='Helvetica',         fontSize=11, textColor=NAVY,    spaceAfter=4, leading=16)
    add('TOCGroup',     fontName='Helvetica-Bold',    fontSize=10, textColor=GRAY,    spaceBefore=14, spaceAfter=4, textTransform='uppercase')
    add('StepNum',      fontName='Helvetica-Bold',    fontSize=11, textColor=white,   alignment=TA_CENTER)
    add('StepText',     fontName='Helvetica',         fontSize=10, textColor=NAVY,    leading=14, spaceAfter=4)
    add('StepHead',     fontName='Helvetica-Bold',    fontSize=10, textColor=NAVY,    spaceAfter=2)
    add('TableHead',    fontName='Helvetica-Bold',    fontSize=9,  textColor=white)
    add('TableCell',    fontName='Helvetica',         fontSize=9,  textColor=NAVY,    leading=13)
    add('TableCellB',   fontName='Helvetica-Bold',    fontSize=9,  textColor=NAVY,    leading=13)
    add('BoxHead',      fontName='Helvetica-Bold',    fontSize=9,  textColor=GREEN,   spaceAfter=3, textTransform='uppercase')
    add('BoxBody',      fontName='Helvetica',         fontSize=10, textColor=NAVY,    leading=14)
    add('Footer',       fontName='Helvetica',         fontSize=8,  textColor=GRAY,    alignment=TA_CENTER)

    return s

def caption_style():
    s = styles()
    return s['Caption']

# ── Custom Flowables ────────────────────────────────────────────────────────
class ColorBar(Flowable):
    """Horizontal full-width colour bar."""
    def __init__(self, color, height=3):
        super().__init__()
        self.color = color
        self.bar_h = height
        self.width = W - 4*cm
        self.height = height

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(0, 0, self.width, self.bar_h, fill=1, stroke=0)


class PartBanner(Flowable):
    """Full-width green banner for part headings."""
    def __init__(self, part_label, title, description='', page_width=W):
        super().__init__()
        self.part_label  = part_label
        self.title       = title
        self.description = description
        self.width       = page_width - 4*cm
        self.height      = 90 if description else 70

    def draw(self):
        c = self.canv
        # Green background
        c.setFillColor(GREEN)
        c.rect(-1*cm, -8, self.width + 2*cm, self.height + 8, fill=1, stroke=0)
        # Gold accent strip
        c.setFillColor(GOLD)
        c.rect(-1*cm, self.height - 4, self.width + 2*cm, 4, fill=1, stroke=0)
        # Part label
        c.setFillColor(HexColor('#86efac'))
        c.setFont('Helvetica', 10)
        c.drawString(0, self.height - 24, self.part_label.upper())
        # Title
        c.setFillColor(white)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(0, self.height - 50, self.title)
        # Description
        if self.description:
            c.setFillColor(HexColor('#d1fae5'))
            c.setFont('Helvetica', 11)
            c.drawString(0, self.height - 68, self.description)


class CalloutBox(Flowable):
    """Coloured callout box with icon label."""
    TYPES = {
        'tip':    (HexColor('#10b981'), HexColor('#f0fdf4'), 'TIP'),
        'warn':   (AMBER,              AMBER_LT,             'WARNING'),
        'info':   (BLUE,               BLUE_LT,              'NOTE'),
        'danger': (RED,                HexColor('#fef2f2'),  'IMPORTANT'),
        'note':   (GREEN,              GREEN_LT,             'NOTE'),
    }

    def __init__(self, text, kind='info', available_width=None):
        super().__init__()
        self.text  = text
        self.kind  = kind
        self.avail = available_width or (W - 4*cm)
        border_c, bg_c, _ = self.TYPES.get(kind, self.TYPES['info'])
        self.border_c = border_c
        self.bg_c     = bg_c
        self.height   = 52

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        border_c, bg_c, label = self.TYPES.get(self.kind, self.TYPES['info'])
        # Background
        c.setFillColor(bg_c)
        c.roundRect(0, 0, self.width, self.height, 4, fill=1, stroke=0)
        # Left border
        c.setFillColor(border_c)
        c.rect(0, 0, 4, self.height, fill=1, stroke=0)
        # Label
        c.setFillColor(border_c)
        c.setFont('Helvetica-Bold', 8)
        c.drawString(12, self.height - 16, label)
        # Text
        c.setFillColor(NAVY)
        c.setFont('Helvetica', 9.5)
        # Simple text wrapping
        words = self.text.split()
        line, lines = '', []
        max_w = self.width - 24
        for w in words:
            test = (line + ' ' + w).strip()
            if c.stringWidth(test, 'Helvetica', 9.5) < max_w:
                line = test
            else:
                lines.append(line)
                line = w
        if line:
            lines.append(line)
        y = self.height - 30
        for l in lines[:3]:
            c.drawString(12, y, l)
            y -= 14


# ── Page numbering ─────────────────────────────────────────────────────────
def make_page_template(doc, show_footer=True):
    def on_page(canvas, doc):
        canvas.saveState()
        if show_footer and doc.page > 2:
            canvas.setFillColor(GRAY)
            canvas.setFont('Helvetica', 8)
            canvas.drawString(2*cm, 1.2*cm, 'Kaimosi Friends University — KAFU Digital Platform Manual')
            canvas.drawRightString(W - 2*cm, 1.2*cm, f'Page {doc.page}')
            canvas.setStrokeColor(BORDER)
            canvas.setLineWidth(0.5)
            canvas.line(2*cm, 1.5*cm, W - 2*cm, 1.5*cm)
        canvas.restoreState()
    return on_page


# ── Table helper ───────────────────────────────────────────────────────────
def make_table(rows, col_widths=None, header=True):
    s = styles()
    data = []
    for i, row in enumerate(rows):
        styled = []
        for j, cell in enumerate(row):
            if i == 0 and header:
                styled.append(Paragraph(str(cell), s['TableHead']))
            else:
                if j == 0:
                    styled.append(Paragraph(str(cell), s['TableCellB']))
                else:
                    styled.append(Paragraph(str(cell), s['TableCell']))
        data.append(styled)

    avail = W - 4*cm
    if col_widths is None:
        n = len(rows[0])
        col_widths = [avail / n] * n

    t = Table(data, colWidths=col_widths, repeatRows=1 if header else 0)
    style = [
        ('BACKGROUND', (0,0), (-1,0), GREEN),
        ('TEXTCOLOR',  (0,0), (-1,0), white),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, LGRAY]),
        ('GRID',       (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',     (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING',(0,0),(-1,-1), 6),
        ('LEFTPADDING',(0,0),(-1,-1), 8),
        ('RIGHTPADDING',(0,0),(-1,-1), 8),
        ('LINEBELOW',  (0,0), (-1,0), 1.5, GOLD),
    ]
    t.setStyle(TableStyle(style))
    return t


# ── Step helper ────────────────────────────────────────────────────────────
def make_steps(steps_data):
    """steps_data: list of (title, description) tuples"""
    s = styles()
    result = []
    for i, (title, desc) in enumerate(steps_data, 1):
        circle_data = [[Paragraph(str(i), s['StepNum'])]]
        circle = Table(circle_data, colWidths=[0.7*cm], rowHeights=[0.7*cm])
        circle.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), GREEN),
            ('ALIGN',      (0,0), (0,0), 'CENTER'),
            ('VALIGN',     (0,0), (0,0), 'MIDDLE'),
            ('TOPPADDING', (0,0), (0,0), 2),
            ('BOTTOMPADDING',(0,0),(0,0), 2),
        ]))
        text_col = [
            Paragraph(title, s['StepHead']),
            Paragraph(desc, s['StepText']),
        ]
        row_data = [[circle, text_col]]
        row_tbl = Table(row_data, colWidths=[1*cm, W - 4*cm - 1*cm])
        row_tbl.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        result.append(row_tbl)
    return result


# ── Screenshot helper ──────────────────────────────────────────────────────
def screenshot_block(filename, caption):
    s = styles()
    path = os.path.join(SS, filename)
    result = []
    if os.path.exists(path):
        try:
            from PIL import Image as PILImg
            with PILImg.open(path) as im:
                w_px, h_px = im.size
            avail_w = W - 4*cm
            aspect = h_px / w_px
            img_h = min(avail_w * aspect, 10*cm)
            img_obj = Image(path, width=avail_w, height=img_h)
            # Box around screenshot
            tbl = Table([[img_obj]], colWidths=[avail_w])
            tbl.setStyle(TableStyle([
                ('BOX',        (0,0), (-1,-1), 1, BORDER),
                ('BACKGROUND', (0,0), (-1,-1), white),
            ]))
            result.append(tbl)
        except Exception as e:
            result.append(Paragraph(f'[Image: {filename}]', s['Caption']))
    result.append(Paragraph(caption, s['Caption']))
    return result


# ── Cover Page ─────────────────────────────────────────────────────────────
def cover_page(title, subtitle, parts, version='1.0', date='June 2026', confidential=False):
    s = styles()
    flowables = []

    # Full green background table
    inner = []
    inner.append(Spacer(1, 2*cm))
    # Seal / Logo circle
    seal_tbl = Table([[Paragraph('<b>K</b>', ParagraphStyle('seal',
        fontName='Helvetica-Bold', fontSize=40, textColor=GOLD, alignment=TA_CENTER))]],
        colWidths=[3.5*cm], rowHeights=[3.5*cm])
    seal_tbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,0), HexColor('#14472b')),
        ('ALIGN',         (0,0), (0,0), 'CENTER'),
        ('VALIGN',        (0,0), (0,0), 'MIDDLE'),
        ('ROUNDEDCORNERS',[50]),
    ]))
    inner.append(Table([[seal_tbl]], colWidths=[W - 4*cm]))
    inner[-1].setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER')]))
    inner.append(Spacer(1, 0.4*cm))
    inner.append(Paragraph('KAIMOSI FRIENDS UNIVERSITY', ParagraphStyle('cu',
        fontName='Helvetica-Bold', fontSize=12, textColor=white, alignment=TA_CENTER, tracking=3)))
    inner.append(Paragraph('Spring of Knowledge', ParagraphStyle('cm',
        fontName='Helvetica-Oblique', fontSize=12, textColor=GOLD, alignment=TA_CENTER, spaceAfter=30)))

    badge_bg = Table([[Paragraph(
        '<b>COMPREHENSIVE TECHNICAL MANUAL</b>' if 'Comprehensive' in title else '<b>PRELIMINARY TRAINING MANUAL</b>',
        ParagraphStyle('badge', fontName='Helvetica-Bold', fontSize=10, textColor=white, alignment=TA_CENTER))]],
        colWidths=[8*cm], rowHeights=[0.7*cm])
    badge_bg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GOLD),
        ('ALIGN',      (0,0), (-1,-1), 'CENTER'),
        ('VALIGN',     (0,0), (-1,-1), 'MIDDLE'),
        ('ROUNDEDCORNERS', [12]),
    ]))
    inner.append(Table([[badge_bg]], colWidths=[W - 4*cm]))
    inner[-1].setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER')]))
    inner.append(Spacer(1, 0.5*cm))
    inner.append(Paragraph(title, ParagraphStyle('ct',
        fontName='Helvetica-Bold', fontSize=28, textColor=white, alignment=TA_CENTER, leading=36, spaceAfter=10)))
    inner.append(Paragraph(subtitle, ParagraphStyle('cs',
        fontName='Helvetica', fontSize=14, textColor=HexColor('#cccccc'), alignment=TA_CENTER, spaceAfter=30)))

    # Part boxes
    part_cells = []
    for pnum, ptitle in parts:
        part_cells.append(Table([
            [Paragraph(pnum, ParagraphStyle('pn', fontName='Helvetica', fontSize=9, textColor=GOLD))],
            [Paragraph(ptitle, ParagraphStyle('pt', fontName='Helvetica-Bold', fontSize=12, textColor=white))],
        ], colWidths=[5*cm], rowHeights=[0.5*cm, 0.7*cm]))
    if part_cells:
        parts_tbl = Table([part_cells], colWidths=[5*cm]*len(part_cells))
        parts_tbl.setStyle(TableStyle([
            ('BOX',        (0,0), (-1,-1), 1, HexColor('#2d7a52')),
            ('INNERGRID',  (0,0), (-1,-1), 1, HexColor('#2d7a52')),
            ('VALIGN',     (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING',(0,0),(-1,-1), 8),
            ('LEFTPADDING',(0,0),(-1,-1), 10),
        ]))
        inner.append(parts_tbl)
        inner.append(Spacer(1, 0.8*cm))

    # Rule
    inner.append(HRFlowable(width='100%', thickness=1, color=HexColor('#2d7a52'), spaceAfter=12))
    meta = f'ICT Directorate  |  Version {version}  |  {date}'
    if confidential:
        meta += '  |  CONFIDENTIAL'
    inner.append(Paragraph(meta, ParagraphStyle('meta',
        fontName='Helvetica', fontSize=10, textColor=HexColor('#9ca3af'), alignment=TA_CENTER)))

    # Wrap everything in green background
    cover_tbl = Table([[inner]], colWidths=[W - 4*cm])
    cover_tbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), GREEN),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 50),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))
    flowables.append(cover_tbl)
    flowables.append(PageBreak())
    return flowables


# ── Status badge helper ─────────────────────────────────────────────────────
STATUS = {
    'draft':       ('#f1f5f9', '#475569'),
    'submitted':   ('#ccfbf1', '#0f766e'),
    'under_review':('#fef9c3', '#a16207'),
    'approved':    ('#dcfce7', '#15803d'),
    'scheduled':   ('#f3e8ff', '#7c3aed'),
    'published':   ('#d1fae5', '#065f46'),
    'unpublished': ('#ffedd5', '#c2410c'),
    'archived':    ('#f8fafc', '#64748b'),
}

def status_cell(label, key):
    bg, fg = STATUS.get(key, ('#f1f5f9', '#475569'))
    t = Table([[Paragraph(f'<b>{label}</b>',
        ParagraphStyle('sb', fontName='Helvetica-Bold', fontSize=8,
                       textColor=HexColor(fg), alignment=TA_CENTER))]],
        colWidths=[2.2*cm], rowHeights=[0.55*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), HexColor(bg)),
        ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
        ('ROUNDEDCORNERS',[8]),
        ('TOPPADDING',    (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    return t


# ═══════════════════════════════════════════════════════════════════════════
# TRAINING MANUAL  (CMS + Staff Portal)
# ═══════════════════════════════════════════════════════════════════════════
def build_training_manual(out_path):
    s = styles()
    story = []

    # ── Cover ────────────────────────────────────────────────────────────
    story += cover_page(
        title='Digital Systems User Guide',
        subtitle='CMS Administration  |  Staff Account Updater Portal',
        parts=[('PART A', 'CMS Administration'), ('PART B', 'Staff Portal')],
        confidential=False,
    )

    # ── TOC ──────────────────────────────────────────────────────────────
    story.append(Paragraph('Table of Contents', s['H1']))
    story.append(HRFlowable(width='100%', thickness=2, color=GOLD, spaceAfter=12))

    toc_entries = [
        ('INTRODUCTION', [
            ('1.', 'System Overview & Who Uses What'),
            ('2.', 'System URLs & Access Requirements'),
            ('3.', 'User Roles & Permissions'),
        ]),
        ('PART A — CMS ADMINISTRATION', [
            ('4.', 'Logging In to the CMS'),
            ('5.', 'Dashboard Overview'),
            ('6.', 'Content Library'),
            ('7.', 'Content Workflow & Statuses'),
            ('8.', 'Content Editor'),
            ('9.', 'Review Queue'),
            ('10.', 'Media Library'),
            ('11.', 'Research Office Module'),
            ('12.', 'International Office Module'),
            ('13.', 'Institutional Repository'),
            ('14.', 'Academic Profiles & Staff Management'),
            ('15.', 'Governance Module'),
            ('16.', 'Academic Structure'),
            ('17.', 'Admissions Management'),
            ('18.', 'Site Controls'),
            ('19.', 'Navigation Manager'),
            ('20.', 'Redirects'),
            ('21.', 'Content Health'),
            ('22.', 'Workflow Console'),
            ('23.', 'User Management'),
            ('24.', 'Taxonomy Manager'),
            ('25.', 'Audit Log'),
            ('26.', 'Settings & Branding'),
        ]),
        ('PART B — STAFF PORTAL', [
            ('27.', 'Getting Access & First Login'),
            ('28.', 'Onboarding Steps'),
            ('29.', 'Profile Editor Sections'),
            ('30.', 'Submitting Your Profile for Review'),
            ('31.', 'Understanding Review Status'),
            ('32.', 'Reviewer: Approving & Returning Submissions'),
        ]),
        ('APPENDIX', [
            ('A.', 'Quick-Reference Tips & Best Practices'),
            ('B.', 'Support Contacts'),
        ]),
    ]
    for group, items in toc_entries:
        story.append(Paragraph(group, s['TOCGroup']))
        for num, text in items:
            row = Table([[
                Paragraph(f'<b>{num}</b>', ParagraphStyle('tn', fontName='Helvetica-Bold', fontSize=10.5, textColor=GOLD)),
                Paragraph(text, ParagraphStyle('te', fontName='Helvetica', fontSize=10.5, textColor=NAVY)),
            ]], colWidths=[0.8*cm, W - 4*cm - 0.8*cm])
            row.setStyle(TableStyle([
                ('LINEBELOW', (0,0), (-1,-1), 0.4, BORDER),
                ('VALIGN',    (0,0), (-1,-1), 'MIDDLE'),
                ('TOPPADDING',(0,0), (-1,-1), 5),
                ('BOTTOMPADDING',(0,0),(-1,-1), 5),
            ]))
            story.append(row)
    story.append(PageBreak())

    # ═══ INTRODUCTION ═════════════════════════════════════════════════════
    story.append(Paragraph('1. System Overview', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'Kaimosi Friends University operates three integrated digital systems that together power the official '
        'university website at <b>www.kafu.ac.ke</b>.', s['Body']))

    story += screenshot_block('site-homepage.jpg',
        'Figure 1.1 — The KAFU public website. All content displayed here is managed through the CMS Administration system.')

    sys_table = make_table([
        ['System', 'Who Uses It', 'Purpose'],
        ['CMS Administration', 'Communications, ICT, Reviewers, Admins',
         'Create, edit, approve and publish all website content — news, events, programmes, research, staff profiles, and site configuration.'],
        ['Staff Account Updater Portal', 'All academic and administrative staff',
         'Update personal academic profile information for display on the university website.'],
        ['KAFU Website (Public)', 'General public, students, staff',
         'The live website. Displays all approved and published content. No editing happens here.'],
    ], col_widths=[3.5*cm, 4*cm, 6.5*cm])
    story.append(sys_table)
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('2. System URLs & Access Requirements', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    url_tbl = make_table([
        ['System', 'URL', 'Access'],
        ['KAFU Website', 'www.kafu.ac.ke', 'Public — no login required'],
        ['CMS Administration', 'cms.kafu.ac.ke', 'Authorised staff — contact ICT (ict@kafu.ac.ke)'],
        ['Staff Portal', 'portal-update.kafu.ac.ke', 'All permanent & contract staff — contact ICT'],
    ], col_widths=[4*cm, 5*cm, 5*cm])
    story.append(url_tbl)

    story.append(Paragraph('3. User Roles & Permissions', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    roles_tbl = make_table([
        ['Role', 'Label', 'What They Can Do'],
        ['Super Admin', 'super_admin',
         'Full access to everything — all content, all settings, user management, site configuration. Typically 1–2 people in ICT.'],
        ['ICT Admin', 'ict_admin',
         'Same as Super Admin. Handles technical configuration, site controls, user accounts, and all content modules.'],
        ['Communications Admin', 'communications_admin',
         'Creates and edits all content. Manages media, news, events, research. Cannot access system settings or user management.'],
        ['Reviewer', 'reviewer',
         'Reviews submitted content in the Review Queue. Can approve or request revisions. Cannot create content or change settings.'],
    ], col_widths=[3.5*cm, 4*cm, 6.5*cm])
    story.append(roles_tbl)

    # ═══ PART A BANNER ════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(PartBanner('Part A', 'CMS Administration Manual',
        'For authorised staff creating and managing university website content.'))
    story.append(Spacer(1, 0.5*cm))

    # ─── 4. CMS LOGIN ─────────────────────────────────────────────────────
    story.append(Paragraph('4. Logging In to the CMS', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('cms-login.jpg', 'Figure 4.1 — CMS Administration login screen at cms.kafu.ac.ke')
    story += make_steps([
        ('Navigate to the CMS URL', 'Open your browser and go to cms.kafu.ac.ke. You will see the CMS Administration sign-in page with the KAFU logo.'),
        ('Enter your institutional email', 'Type your KAFU email address in the format you@kafu.ac.ke. This is the same email registered with ICT when your account was created.'),
        ('Enter your password', 'Type your password. If you have forgotten it, click "Forgot password?" to receive a reset link by email.'),
        ('Click Sign In', 'You will be taken to the Dashboard. The sidebar on the left shows your available modules based on your role.'),
    ])
    story.append(CalloutBox(
        'TIP — If you see "Invalid credentials", double-check that Caps Lock is not on. If the problem persists, ask an Admin to reset your password via User Management.',
        'tip'))
    story.append(Spacer(1, 0.3*cm))

    # ─── 5. DASHBOARD ─────────────────────────────────────────────────────
    story.append(Paragraph('5. Dashboard Overview', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'After logging in, the Dashboard provides an at-a-glance view of the CMS health and pending work. '
        'It contains four key widgets:', s['Body']))
    dash_tbl = make_table([
        ['Widget', 'What It Shows'],
        ['Content Health', 'A ring-gauge score (0–100) indicating overall website content quality. Below it are alerts for stale, expired, or overdue content items.'],
        ['Workflow Pipeline', 'A count of content items at each workflow stage: Draft, Submitted, Under Review, Approved, Scheduled, Published.'],
        ['Site Operations', 'Quick-action buttons for the most common tasks: New Content, View Published, Manage Media, Review Queue, Navigation Manager, Redirects.'],
        ['Recent Activity', 'A log of the latest content changes across the system — who edited what and when.'],
    ], col_widths=[4*cm, 10*cm])
    story.append(dash_tbl)

    # ─── 6. CONTENT LIBRARY ───────────────────────────────────────────────
    story.append(Paragraph('6. Content Library', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'The Content Library is the central list of all website content items. Access it from the sidebar under <b>Content</b>. '
        'Use the filter bar at the top to narrow by Type, Status, or keyword search.', s['Body']))
    lib_tbl = make_table([
        ['Column', 'Meaning'],
        ['Title', 'The name of the content item. Click to open the editor.'],
        ['Type', 'The content category (News, Event, Announcement, Opportunity, Programme, Staff Profile, Page, Document).'],
        ['Status', 'Current workflow stage — see Section 7 for full explanation.'],
        ['Author', 'Who created the item.'],
        ['Modified', 'When it was last edited.'],
        ['Actions', 'Edit, Preview, Publish, Archive buttons.'],
    ], col_widths=[3.5*cm, 10.5*cm])
    story.append(lib_tbl)

    # ─── 7. WORKFLOW ──────────────────────────────────────────────────────
    story.append(Paragraph('7. Content Workflow & Statuses', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'Every piece of content goes through a defined lifecycle before appearing on the public website. '
        'Understanding these stages is essential for all CMS users.', s['Body']))

    # Workflow diagram row
    stages = [
        ('Draft', 'draft'), ('Submitted', 'submitted'), ('Under Review', 'under_review'),
        ('Approved', 'approved'), ('Scheduled', 'scheduled'), ('Published', 'published'),
        ('Unpublished', 'unpublished'), ('Archived', 'archived'),
    ]
    arrow = Paragraph('→', ParagraphStyle('arr', fontName='Helvetica-Bold', fontSize=14, textColor=GRAY, alignment=TA_CENTER))
    flow_cells = []
    for i, (label, key) in enumerate(stages):
        flow_cells.append(status_cell(label, key))
        if i < len(stages) - 1:
            flow_cells.append(arrow)
    # Split into two rows of 4+arrows
    row1 = flow_cells[:8]   # Draft→Submitted→Under Review→Approved
    row2 = flow_cells[8:]   # Scheduled→Published→Unpublished→Archived
    widths1 = ([2.4*cm, 0.5*cm] * 4)[:len(row1)]
    widths2 = ([2.4*cm, 0.5*cm] * 4)[:len(row2)]
    for row_data, row_widths in [(row1, widths1), (row2, widths2)]:
        tbl = Table([row_data], colWidths=row_widths)
        tbl.setStyle(TableStyle([
            ('ALIGN',  (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BACKGROUND', (0,0), (-1,-1), LGRAY),
            ('BOX',    (0,0), (-1,-1), 0.5, BORDER),
            ('TOPPADDING',    (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(tbl)
        story.append(Spacer(1, 0.15*cm))

    wf_tbl = make_table([
        ['Status', 'What It Means', 'Who Acts Next'],
        ['Draft',       'Content is being written. Not visible to public.',                                   'Author — continues editing, then submits'],
        ['Submitted',   'Author has marked it ready for review.',                                              'Reviewer — moves to Under Review'],
        ['Under Review','A Reviewer is actively checking the content.',                                        'Reviewer — Approves or Requests Revision'],
        ['Approved',    'Ready to go live. Admin can publish immediately or schedule.',                         'Admin — publishes or schedules'],
        ['Scheduled',   'Set to publish automatically on a future date and time.',                             'System — auto-publishes at set time'],
        ['Published',   'Visible to the public on www.kafu.ac.ke.',                                           'Admin — can unpublish or archive'],
        ['Unpublished', 'Temporarily removed from public view. Content is preserved.',                         'Admin — can re-publish or archive'],
        ['Archived',    'Permanently removed from the website. Still stored in CMS for records.',              'Admin only'],
    ], col_widths=[2.8*cm, 5.8*cm, 5.4*cm])
    story.append(wf_tbl)

    # ─── 8. CONTENT EDITOR ────────────────────────────────────────────────
    story.append(Paragraph('8. Content Editor', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'The Content Editor opens when you click an item in the Content Library or click <b>New Content</b>. '
        'Key panels:', s['Body']))
    ed_tbl = make_table([
        ['Panel / Field', 'Description'],
        ['Title', 'The heading displayed on the website.'],
        ['Slug', 'Auto-generated URL-friendly identifier. Edit only if needed.'],
        ['Type', 'Content category — determines where content appears on the website.'],
        ['Body', 'The main text. Supports rich-text formatting.'],
        ['Featured Image', 'Thumbnail image selected from the Media Library.'],
        ['Summary / Excerpt', 'Short description shown in listing pages (max ~200 characters).'],
        ['Published At', 'Set a date/time for automatic publishing. Leave blank to publish immediately.'],
        ['Expiry Date', 'After this date, content is flagged as expired on the Content Health dashboard.'],
        ['SEO Title', 'Title shown in search engine results. Defaults to main Title if blank.'],
        ['Meta Description', 'Short summary for search results. Aim for 120–160 characters.'],
        ['Revision History', 'Every save creates a revision. You can restore any previous version.'],
    ], col_widths=[3.5*cm, 10.5*cm])
    story.append(ed_tbl)
    story.append(CalloutBox(
        'BEST PRACTICE — Always click "Save Draft" frequently while writing. Only click "Submit for Review" when the content is fully complete. Once submitted, the author cannot edit until a Reviewer returns it.',
        'tip'))

    # ─── 9–26 condensed ───────────────────────────────────────────────────
    story.append(Paragraph('9. Review Queue', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'The Review Queue collects all content items with status Submitted or Under Review. '
        'Available to all CMS roles. Items are listed oldest-first so nothing is forgotten.', s['Body']))
    story += make_steps([
        ('Open the Review Queue', 'Click Review Queue in the left sidebar.'),
        ('Claim an item', 'Click "Start Review" on any Submitted item. Its status changes to Under Review.'),
        ('Read the content carefully', 'Check accuracy, grammar, policy compliance, appropriate imagery, and SEO quality. Use Preview to see the live appearance.'),
        ('Approve or Request Revision', 'Click Approve to move to Approved status. Click "Request Revision", enter feedback, and the author is notified.'),
    ])

    story.append(Paragraph('10. Media Library', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('Stores all images, PDFs, and documents. Drag-and-drop upload. All media is reusable across content items.', s['Body']))
    media_tbl = make_table([
        ['Type', 'Recommended Size', 'Max File Size'],
        ['Hero / Banner images', '1920 × 800 px', '2 MB'],
        ['News / Event thumbnails', '1200 × 630 px', '1 MB'],
        ['Staff profile photos', '400 × 400 px (square)', '500 KB'],
        ['Gallery photos', '1600 × 1200 px', '3 MB'],
        ['Documents (PDF)', '—', '20 MB'],
    ], col_widths=[5*cm, 5*cm, 4*cm])
    story.append(media_tbl)

    for num, heading, body in [
        ('11.', 'Research Office Module', 'Manages research information at /research: Themes, Projects, Publications, Grants, Partners. All items have full CRUD via the CMS sidebar under Research Office.'),
        ('12.', 'International Office Module', 'Manages /international: Partnerships and Exchange Programmes. Access via International Office in sidebar.'),
        ('13.', 'Institutional Repository', 'Stores academic theses, dissertations, and reports. All Records view + Pending Review queue for items awaiting approval.'),
        ('14.', 'Academic Profiles & Staff Management', 'Staff Profiles editor, Staff Content shortcut, Submission Review queue (staff portal submissions), and Staff Accounts management. All under Academic Profiles in sidebar.'),
        ('15.', 'Governance Module', 'Manages University Council, VC Office, Management Board, Directorates, Departments, Strategic Plan, Policies & Regulations, Service Charter. Admin-only access.'),
        ('16.', 'Academic Structure', 'Schools & Faculties and Programmes catalogue. Add or edit the five schools (SESS, SBE, SCIT, SOS, SHS) and all 38+ degree programmes.'),
        ('17.', 'Admissions Management', 'Document Uploads, Fees & Payments tables, Postgraduate Programmes information, Eligibility Settings (minimum requirements per programme category).'),
        ('18.', 'Site Controls', 'Homepage Manager, Emergency Banner (site-wide urgent notices), Announcement Bar (scrolling ticker), Maintenance Mode, Social Media Links, Footer Text.'),
        ('19.', 'Navigation Manager', 'Controls all website menus in real time. Three tabs: Primary Navigation (mega-menu editor), Utility Navigation (top bar links), Footer Navigation (link columns). Changes take effect immediately on save.'),
        ('20.', 'Redirects', 'Create URL redirect rules (301 permanent / 302 temporary). Set source path, destination URL, and active toggle. Use 301 for renamed pages to preserve search rankings.'),
        ('21.', 'Content Health', 'Health score (0–100) with issue cards for: missing SEO descriptions, missing images, stale content (6+ months not updated), and expired content. Review monthly; aim for score above 75.'),
        ('22.', 'Workflow Console', 'Unified view of ALL content items at every workflow stage. Useful for identifying content stuck in any stage and for bulk management.'),
        ('23.', 'User Management', 'Create, edit, deactivate CMS accounts. Admin-only. Set role (Super Admin, ICT Admin, Communications Admin, Reviewer). New users receive a temporary password they change on first login.'),
        ('24.', 'Taxonomy Manager', 'Controls tags and categories for classifying content. Add/edit/delete terms for School, Programme Level, Research Theme, News Category, Event Type.'),
        ('25.', 'Audit Log', 'Records every action in the CMS — who did what and when. Use to investigate accidental deletions or monitor user activity for governance. Admin-only.'),
        ('26.', 'Settings & Branding', 'Site Name, Logo, Favicon, Brand Colours, Contact Email. Also contains the Permissions Matrix for fine-grained role-action control. Admin-only.'),
    ]:
        story.append(Paragraph(f'{num} {heading}', s['H1']))
        story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=6))
        story.append(Paragraph(body, s['Body']))

    # ═══ PART B BANNER ════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(PartBanner('Part B', 'Staff Account Updater Portal',
        'For all KAFU academic and administrative staff managing their academic profiles.'))
    story.append(Spacer(1, 0.5*cm))

    # ─── 27. GETTING ACCESS ───────────────────────────────────────────────
    story.append(Paragraph('27. Getting Access & First Login', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('staff-login.jpg', 'Figure 27.1 — Staff Account Updater Portal login screen')
    story += make_steps([
        ('Contact ICT', 'Email ict@kafu.ac.ke with your full name, staff ID, department, and institutional email address.'),
        ('Receive your credentials', 'ICT will create your account and send you a temporary password by email.'),
        ('Log in', 'Go to the Staff Portal URL, enter your institutional email and the temporary password, then follow the onboarding steps.'),
    ])

    # ─── 28. ONBOARDING ───────────────────────────────────────────────────
    story.append(Paragraph('28. Onboarding Steps (First-Time Login)', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('Two mandatory steps must be completed before accessing your profile:', s['Body']))
    story += make_steps([
        ('Change Password', 'Replace your temporary password with a secure personal password (minimum 8 characters).'),
        ('Accept Data Policy', 'Read and accept the University\'s data processing policy (v1.0). Required by Kenya\'s Data Protection Act 2019.'),
        ('Start Editing', 'You are taken to your Profile Editor dashboard.'),
    ])
    story.append(CalloutBox(
        'You cannot skip the onboarding steps. Both the password change and policy acceptance are mandatory.',
        'note'))

    # ─── 29. PROFILE EDITOR ───────────────────────────────────────────────
    story.append(Paragraph('29. Profile Editor Sections', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'The Profile Editor has <b>seven tabs</b>. Fill in each tab and click <b>Save Section</b> before moving to the next. '
        'A completeness percentage is shown for each section. The system requires minimum overall completeness before submission.',
        s['Body']))

    tabs = [
        ('Personal', 'Full Name, Title, Designation, Department, School, Profile Photo (square headshot), Academic Identifiers (ORCID, Google Scholar, Scopus).'),
        ('Biography', 'Short Biography (max 300 characters for event introductions), Full Biography (300–600 words, third person), Research Interests (comma-separated).'),
        ('Qualifications', 'Academic degrees and professional certifications. Add as many as you have — Degree, Institution, Year Awarded.'),
        ('Teaching', 'Courses currently taught: Course Name, Course Code, Programme/Level, Semester.'),
        ('Research', 'Publications (journal articles, books, conference papers), Ongoing Projects, Grants, and PhD/MSc Student Supervision.'),
        ('Contact', 'Office Location, Office Phone, Institutional Email (pre-filled), Alternate Email, Office Hours (consultation availability).'),
        ('Uploads', 'CV (PDF — used for CV pre-fill feature), Certificate Copies (internal verification), Other Documents.'),
    ]
    for i, (tab, desc) in enumerate(tabs, 1):
        story.append(Paragraph(f'Tab {i} — {tab}', s['H2']))
        story.append(Paragraph(desc, s['Body']))

    story.append(CalloutBox(
        'TIP — After uploading your CV (PDF), click "Pre-fill from CV". The system extracts qualifications, publications, and bio automatically. Review each suggestion carefully before accepting.',
        'tip'))

    # ─── 30. SUBMITTING ───────────────────────────────────────────────────
    story.append(Paragraph('30. Submitting Your Profile for Review', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += make_steps([
        ('Check completeness', 'Review the completeness indicators at the top. All sections should be at least partially complete.'),
        ('Save all sections', 'Make sure you clicked "Save Section" in every tab. Unsaved changes are not included in the submission.'),
        ('Click Submit for Review', 'A confirmation dialogue appears with a consent statement.'),
        ('Confirm submission', 'Click "Confirm & Submit". Status changes to Submitted and the CMS Review Team is notified.'),
    ])
    story.append(CalloutBox('You cannot edit your profile while it is under review. Wait for reviewer feedback.', 'note'))

    # ─── 31. REVIEW STATUS ────────────────────────────────────────────────
    story.append(Paragraph('31. Understanding Your Review Status', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    rs_tbl = make_table([
        ['Status', 'What It Means', 'What You Should Do'],
        ['Draft',             'Still editing. Not submitted.',                                              'Continue filling in sections, then submit when ready.'],
        ['Submitted',         'Sent to review team. Awaiting assignment.',                                  'Wait. Review processed within 3–5 working days.'],
        ['Under Review',      'Reviewer is actively checking your submission.',                             'Wait. You may be contacted by email for quick questions.'],
        ['Revision Requested','Reviewer found issues and returned submission with feedback.',               'Read reviewer notes. Make changes and resubmit.'],
        ['Approved',          'Profile approved. Will be published to the website shortly.',                'No action needed. Profile live within 24 hours.'],
    ], col_widths=[3*cm, 5.5*cm, 5.5*cm])
    story.append(rs_tbl)

    # ─── 32. REVIEWER GUIDE ───────────────────────────────────────────────
    story.append(Paragraph('32. Reviewer: Approving & Returning Submissions', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('Staff profile submissions appear in the CMS under <b>Academic Profiles → Submission Review</b>.', s['Body']))
    story += make_steps([
        ('Open Submission Review queue', 'Navigate to Academic Profiles → Submission Review. Listed by staff member, submission date, and department.'),
        ('Open a submission', 'Side-by-side comparison: current live profile (left) vs proposed changes (right). Changes are highlighted.'),
        ('Review each section', 'Check: factual accuracy, professional tone, appropriate profile photo, valid URLs, no personal contact details outside the Contact section.'),
        ('Approve or Request Revision', 'Approve: profile published to website. Request Revision: enter specific feedback notes and click "Send Back". Staff member is notified.'),
    ])
    story.append(CalloutBox(
        'PRIVACY — Do not approve profiles containing personal information not explicitly consented for public display (e.g. personal home address or mobile number). Only institutional contacts are appropriate.',
        'warn'))

    # ─── APPENDIX ─────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph('A. Quick-Reference Tips & Best Practices', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    tips = [
        ('CMS Writing', [
            'News titles should be specific: "KAFU Launches New MSc Data Science Programme" — not "New Programme".',
            'Always add a featured image to news and event items.',
            'Write meta descriptions for every published page (140–160 characters).',
            'Set expiry dates on time-sensitive content so Content Health flags them after they pass.',
        ]),
        ('CMS Workflow', [
            'The Review Queue should never have items sitting for more than 5 working days.',
            'Do not publish directly from Draft — always go through the review workflow.',
            'Use the Workflow Console weekly to identify items stuck at any stage.',
        ]),
        ('Staff Portal', [
            'Profile photo: clear professional headshot, square, plain background, minimum 400×400px.',
            'Write your Full Biography in third person: "Dr. Wanjiku is a specialist in..." not "I am..."',
            'Add your ORCID iD — it links your profile to your full publication record automatically.',
            'Update your profile at least once a year or when you gain a new qualification.',
        ]),
    ]
    for group, items in tips:
        story.append(Paragraph(group, s['H2']))
        for item in items:
            story.append(Paragraph(f'• {item}', s['BulletItem']))

    story.append(Paragraph('B. Support Contacts', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    contacts_tbl = make_table([
        ['Issue', 'Contact', 'How'],
        ['Cannot log in / forgotten password', 'ICT Directorate', 'ict@kafu.ac.ke or visit ICT offices at SCIT Block'],
        ['New user account request', 'ICT Directorate', 'Email ict@kafu.ac.ke with staff details and required role'],
        ['Content corrections on live website', 'Communications Office', 'communications@kafu.ac.ke'],
        ['Incorrect information on staff profile', 'Human Resources', 'hr@kafu.ac.ke — include staff name and specific error'],
        ['Technical errors or system crashes', 'ICT Directorate', 'ict@kafu.ac.ke with screenshot of error message'],
    ], col_widths=[4.5*cm, 4*cm, 5.5*cm])
    story.append(contacts_tbl)

    # ── Footer ────────────────────────────────────────────────────────────
    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width='100%', thickness=1, color=BORDER))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        '<b>KAIMOSI FRIENDS UNIVERSITY</b> — Spring of Knowledge<br/>'
        'KAFU Digital Systems Training Manual v1.0 | ICT Directorate | June 2026<br/>'
        'P.O Box 385–50309, Kaimosi, Kenya | ict@kafu.ac.ke | +254 777 373 633',
        ParagraphStyle('foot', fontName='Helvetica', fontSize=9, textColor=GRAY, alignment=TA_CENTER, leading=14)))

    # ── Build PDF ─────────────────────────────────────────────────────────
    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2.5*cm,
        title='KAFU Digital Systems Training Manual',
        author='ICT Directorate, Kaimosi Friends University',
        subject='CMS & Staff Portal Training Manual',
    )
    doc.build(story, onFirstPage=make_page_template(doc, show_footer=False),
              onLaterPages=make_page_template(doc))
    print(f'Training manual: {os.path.getsize(out_path):,} bytes')


# ═══════════════════════════════════════════════════════════════════════════
# COMPREHENSIVE MANUAL (Sysadmin + Website User)
# ═══════════════════════════════════════════════════════════════════════════
def build_comprehensive_manual(out_path):
    s = styles()
    story = []

    story += cover_page(
        title='KAFU Digital Platform\nAdministration & User Guide',
        subtitle='System Administration Manual  |  Website User Manual',
        parts=[('PART I', 'System Administration'), ('PART II', 'Website User Guide')],
        confidential=True,
    )

    # ── TOC ──────────────────────────────────────────────────────────────
    story.append(Paragraph('Table of Contents', s['H1']))
    story.append(HRFlowable(width='100%', thickness=2, color=GOLD, spaceAfter=12))
    toc2 = [
        ('PART I — SYSTEM ADMINISTRATION', [
            ('1.', 'System Architecture Overview'),
            ('2.', 'Server & Hosting Requirements'),
            ('3.', 'Initial Server Setup'),
            ('4.', 'Environment Configuration (.env)'),
            ('5.', 'Database Administration'),
            ('6.', 'API Server Administration'),
            ('7.', 'CMS User Account Administration'),
            ('8.', 'Scheduled Tasks & Cron Jobs'),
            ('9.', 'Monitoring, Logs & Troubleshooting'),
            ('10.', 'Security Hardening Checklist'),
            ('11.', 'Maintenance Procedures'),
            ('12.', 'Full Deployment Checklist'),
        ]),
        ('PART II — WEBSITE USER GUIDE', [
            ('13.', 'Introduction to the KAFU Website'),
            ('14.', 'Navigating the Website'),
            ('15.', 'Homepage'),
            ('16.', 'About KAFU'),
            ('17.', 'Academics — Schools & Programmes'),
            ('18.', 'Admissions'),
            ('19.', 'News, Events & Announcements'),
            ('20.', 'Research & Innovation'),
            ('21.', 'Staff Directory'),
            ('22.', 'Contact & Campuses'),
            ('23.', 'Student Services & Digital Portals'),
            ('24.', 'Accessibility & Browser Support'),
        ]),
        ('APPENDIX', [
            ('A.', 'Glossary of Terms'),
            ('B.', 'Key Contacts Reference'),
        ]),
    ]
    for group, items in toc2:
        story.append(Paragraph(group, s['TOCGroup']))
        for num, text in items:
            row = Table([[
                Paragraph(f'<b>{num}</b>', ParagraphStyle('tn2', fontName='Helvetica-Bold', fontSize=10.5, textColor=GOLD)),
                Paragraph(text, ParagraphStyle('te2', fontName='Helvetica', fontSize=10.5, textColor=NAVY)),
            ]], colWidths=[0.8*cm, W - 4*cm - 0.8*cm])
            row.setStyle(TableStyle([
                ('LINEBELOW', (0,0),(-1,-1), 0.4, BORDER),
                ('VALIGN',   (0,0),(-1,-1), 'MIDDLE'),
                ('TOPPADDING',(0,0),(-1,-1), 5),
                ('BOTTOMPADDING',(0,0),(-1,-1), 5),
            ]))
            story.append(row)
    story.append(PageBreak())

    # ═══ PART I ══════════════════════════════════════════════════════════
    story.append(PartBanner('Part I', 'System Administration Manual',
        'For ICT Directorate staff responsible for deploying and maintaining the platform.'))
    story.append(Spacer(1, 0.4*cm))

    # 1. Architecture
    story.append(Paragraph('1. System Architecture Overview', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph(
        'The KAFU Digital Platform is a multi-component web application comprising four independently deployable units.', s['Body']))
    arch_tbl = make_table([
        ['Component', 'Technology', 'Version', 'Deploy Path'],
        ['Public Website', 'React + Vite + TypeScript', 'React 18, Vite 5', 'www.kafu.ac.ke'],
        ['CMS Administration', 'React + Vite + TypeScript', 'React 18, Vite 5', 'cms.kafu.ac.ke'],
        ['Staff Portal', 'React + Vite + TypeScript', 'React 18, Vite 5', 'portal-update.kafu.ac.ke'],
        ['Backend API', 'Laravel + PHP', 'Laravel 11, PHP 8.2', 'api.kafu.ac.ke'],
        ['Database', 'MySQL / MariaDB', 'MySQL 8.0+', 'Local to API server'],
        ['Authentication', 'Laravel Sanctum', '4.x', 'Token-based, per-app'],
    ], col_widths=[3.5*cm, 4*cm, 3.5*cm, 3*cm])
    story.append(arch_tbl)
    story.append(CalloutBox(
        'NOTE — All three React applications are Single Page Applications (SPAs) built to static files. They make API calls to the Laravel backend. The web server only serves static HTML/JS/CSS for the frontends.',
        'info'))

    # 2. Server Requirements
    story.append(Paragraph('2. Server & Hosting Requirements', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    req_tbl = make_table([
        ['Requirement', 'Specification'],
        ['PHP',             'Version 8.2 or higher with extensions: mysql, mbstring, xml, curl, zip, gd, intl, fileinfo'],
        ['Database',        'MySQL 8.0+ or MariaDB 10.6+'],
        ['Web Server',      'Apache 2.4+ with mod_rewrite, mod_proxy, mod_headers enabled'],
        ['Node.js',         'Version 18+ (for building frontend React applications)'],
        ['pnpm',            'Version 8.x (monorepo package manager)'],
        ['Composer',        'Version 2.x (PHP package manager)'],
        ['RAM',             '2 GB minimum — 4 GB recommended'],
        ['Disk Space',      '10 GB minimum (for uploads, logs, and codebase)'],
        ['SSL Certificate', 'Required for all subdomains — Let\'s Encrypt (free) or purchased certificate'],
    ], col_widths=[4*cm, 10*cm])
    story.append(req_tbl)

    # 3. Initial Setup
    story.append(Paragraph('3. Initial Server Setup', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('<b>3a. Backend API Installation (Laravel)</b>', s['H2']))
    story += make_steps([
        ('Upload the API files', 'Upload contents of artifacts/kafu-api/ to /var/www/kafu-api/ on the server. Exclude: .git/, node_modules/, database/database.sqlite'),
        ('Install PHP dependencies', 'Run: composer install --no-dev --optimize-autoloader'),
        ('Configure environment', 'Run: cp .env.example .env   then edit .env with all production values (see Section 4).'),
        ('Generate application key', 'Run: php artisan key:generate   — this encrypts sessions and tokens. Run ONCE per installation.'),
        ('Set file permissions', 'chmod -R 755 /var/www/kafu-api && chmod -R 775 storage/ && chown -R www-data:www-data /var/www/kafu-api'),
        ('Run database migrations', 'Run: php artisan migrate --seed   — creates all tables and populates initial data.'),
        ('Create storage symlink', 'Run: php artisan storage:link   — allows uploaded files to be publicly accessible.'),
        ('Cache for production', 'Run: php artisan config:cache && php artisan route:cache && php artisan view:cache'),
    ])

    story.append(Paragraph('<b>3b. Building & Deploying Frontend Applications</b>', s['H2']))
    story.append(Paragraph('Run from the monorepo root directory:', s['Body']))
    story.append(Paragraph('1. Install all dependencies:  pnpm install', s['Code']))
    story.append(Paragraph('2. Build Public Website (then upload dist/ to www.kafu.ac.ke):',  s['Body']))
    story.append(Paragraph('echo "VITE_API_URL=https://api.kafu.ac.ke" > artifacts/kafu-foundation/.env.production\npnpm --filter @workspace/kafu-foundation run build', s['Code']))
    story.append(Paragraph('3. Build CMS Admin (then upload dist/ to cms.kafu.ac.ke):', s['Body']))
    story.append(Paragraph('pnpm --filter @workspace/kafu-cms run build', s['Code']))
    story.append(Paragraph('4. Build Staff Portal (then upload dist/ to portal-update.kafu.ac.ke):', s['Body']))
    story.append(Paragraph('pnpm --filter @workspace/kafu-staff run build', s['Code']))
    story.append(Paragraph('<b>Apache .htaccess for each React SPA (required for client-side routing):</b>', s['H3']))
    story.append(Paragraph(
        'RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [QSA,L]',
        s['Code']))

    # 4. Env Config
    story.append(Paragraph('4. Environment Configuration (.env)', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(CalloutBox('IMPORTANT — Never commit the .env file to version control. It contains database passwords and the application encryption key.', 'danger'))
    env_tbl = make_table([
        ['Setting', 'Development Value', 'Production Value'],
        ['APP_ENV',                'local',       'production'],
        ['APP_DEBUG',              'true',        'false — CRITICAL for security'],
        ['DB_CONNECTION',          'sqlite',      'mysql or mariadb'],
        ['SESSION_SECURE_COOKIE',  'false',       'true — requires HTTPS'],
        ['LOG_LEVEL',              'debug',       'warning'],
        ['APP_URL',                'http://localhost', 'https://api.kafu.ac.ke'],
    ], col_widths=[4*cm, 4*cm, 6*cm])
    story.append(env_tbl)

    # 5. Database
    story.append(Paragraph('5. Database Administration', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    db_tbl = make_table([
        ['Command', 'Purpose', 'When to Use'],
        ['php artisan migrate', 'Creates/updates all database tables', 'After initial setup or updates with new migrations'],
        ['php artisan migrate --seed', 'Migrates + runs all seeders', 'Initial installation ONLY — will overwrite existing data'],
        ['php artisan migrate:rollback', 'Reverses the last batch of migrations', 'To undo the most recent schema change'],
        ['php artisan migrate:status', 'Shows which migrations have been run', 'Diagnostics'],
        ['php artisan db:seed --class=X', 'Runs a specific seeder', 'Resetting specific configuration defaults'],
    ], col_widths=[5*cm, 4.5*cm, 4.5*cm])
    story.append(db_tbl)
    story.append(CalloutBox('DANGER — NEVER run "php artisan migrate:fresh" or "migrate:fresh --seed" on the production database. These drop ALL existing data. Always take a backup first.', 'danger'))
    story.append(Paragraph('<b>Database Backup (run regularly):</b>', s['H3']))
    story.append(Paragraph('mysqldump -u kafu_db_user -p kafu_website > backup_$(date +%Y%m%d).sql', s['Code']))

    # 6. API Admin
    story.append(Paragraph('6. API Server Administration', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    artisan_tbl = make_table([
        ['Command', 'Purpose'],
        ['php artisan config:cache', 'Cache config files — run after any .env change'],
        ['php artisan route:cache', 'Cache route list — speeds up routing in production'],
        ['php artisan cache:clear', 'Clear application cache'],
        ['php artisan queue:work', 'Process background jobs (email notifications)'],
        ['php artisan schedule:run', 'Run scheduled tasks (called by cron every minute)'],
        ['php artisan route:list', 'Show all registered API routes with HTTP methods'],
        ['php artisan tinker', 'Interactive PHP shell — admin use only'],
    ], col_widths=[6*cm, 8*cm])
    story.append(artisan_tbl)
    story.append(Paragraph('<b>API Endpoint Reference:</b>', s['H3']))
    api_tbl = make_table([
        ['Prefix', 'Purpose', 'Authentication'],
        ['GET /api/stats', 'University statistics', 'Public'],
        ['GET /api/news, /api/events', 'Published content listings', 'Public'],
        ['GET /api/navigation', 'CMS-managed navigation menus', 'Public'],
        ['POST /api/cms/login', 'CMS admin authentication', 'Public (rate-limited: 5/min)'],
        ['/api/admin/*', 'CMS content management (full CRUD)', 'Sanctum token (CMS role)'],
        ['POST /api/staff/login', 'Staff portal authentication', 'Public (rate-limited)'],
        ['/api/staff/*', 'Staff profile management', 'Sanctum token (staff role)'],
        ['/api/reviewer/*', 'Content review actions', 'Sanctum token (reviewer role)'],
    ], col_widths=[4.5*cm, 5.5*cm, 4*cm])
    story.append(api_tbl)

    # 7. User Admin
    story.append(Paragraph('7. CMS User Account Administration', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('<b>Default Seeded Accounts — Change all passwords immediately before go-live:</b>', s['H3']))
    users_tbl = make_table([
        ['Email', 'Default Password', 'Role'],
        ['super@kafu.ac.ke',    'password', 'Super Admin'],
        ['ict@kafu.ac.ke',      'password', 'ICT Admin'],
        ['comms@kafu.ac.ke',    'password', 'Communications Admin'],
        ['reviewer@kafu.ac.ke', 'password', 'Reviewer'],
        ['john.doe@kafu.ac.ke', 'password', 'Staff User (portal)'],
    ], col_widths=[6*cm, 4*cm, 4*cm])
    story.append(users_tbl)
    story.append(CalloutBox('SECURITY — All seeded accounts use "password". Change EVERY account password before going live.', 'danger'))

    # 8. Cron
    story.append(Paragraph('8. Scheduled Tasks & Cron Jobs', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('Only ONE cron entry is needed. Laravel handles all scheduling internally:', s['Body']))
    story.append(Paragraph('* * * * * php /var/www/kafu-api/artisan schedule:run >> /dev/null 2>&1', s['Code']))
    cron_tbl = make_table([
        ['Scheduled Task', 'Frequency', 'Purpose'],
        ['Publish Scheduled Content', 'Every minute', 'Auto-publishes items whose published_at datetime has passed'],
        ['Expire Content', 'Hourly', 'Marks content as expired when expiry_date is passed'],
        ['Prune Sanctum Tokens', 'Daily', 'Removes expired API authentication tokens'],
        ['Database Backup', 'Weekly (Sun 02:00)', 'Auto-backup if configured'],
    ], col_widths=[5*cm, 3.5*cm, 5.5*cm])
    story.append(cron_tbl)

    # 9. Monitoring
    story.append(Paragraph('9. Monitoring, Logs & Troubleshooting', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    log_tbl = make_table([
        ['Log', 'Path', 'Contents'],
        ['Laravel Application Log', 'storage/logs/laravel.log', 'PHP errors, exceptions, custom messages'],
        ['Apache Access Log', '/var/log/apache2/access.log', 'All HTTP requests to the API'],
        ['Apache Error Log', '/var/log/apache2/error.log', 'PHP fatal errors, config issues'],
        ['CMS Audit Log', 'Database: audit_logs table', 'All CMS user actions (also in CMS Admin UI)'],
    ], col_widths=[4*cm, 5*cm, 5*cm])
    story.append(log_tbl)
    story.append(Paragraph('<b>Common Issues & Solutions:</b>', s['H3']))
    issues_tbl = make_table([
        ['Symptom', 'Likely Cause', 'Solution'],
        ['API returns 500 error', 'PHP exception or missing config', 'Check storage/logs/laravel.log. Set APP_DEBUG=true temporarily to see error details.'],
        ['Website shows blank screen', 'React JS error or missing API', 'Open browser developer tools → Console. Check VITE_API_URL is correct.'],
        ['API returns 403 Forbidden', 'File permissions or Apache config', 'chmod -R 755 /var/www/kafu-api && chmod -R 775 storage/. Check AllowOverride All.'],
        ['Uploaded files not showing', 'Missing storage symlink', 'Run: php artisan storage:link'],
        ['Changes not reflected', 'Cached config or routes', 'Run: php artisan config:clear && route:clear && cache:clear'],
        ['Database connection refused', 'Wrong credentials in .env', 'Check DB_HOST, DB_USERNAME, DB_PASSWORD. Test: mysql -u kafu_db_user -p kafu_website'],
    ], col_widths=[3.5*cm, 4*cm, 6.5*cm])
    story.append(issues_tbl)

    # 10. Security
    story.append(Paragraph('10. Security Hardening Checklist', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    security_items = [
        'Change all default seeded passwords before going live',
        'Set APP_DEBUG=false in production',
        'Ensure APP_ENV=production',
        'Enable HTTPS on all subdomains (SSL certificate installed)',
        'Set SESSION_SECURE_COOKIE=true once HTTPS is live',
        'Configure CORS to only allow the three known frontend origins',
        'Set PHP upload limits: upload_max_filesize=20M, post_max_size=25M',
        'Disable PHP error display in production (display_errors = Off in php.ini)',
        'Keep Laravel, PHP, and all Composer packages up to date',
        'Block direct access to .env, .git/, and storage/ via Apache rules',
        'Use a dedicated MySQL user with only necessary database privileges (not root)',
        'Configure rate limiting on authentication endpoints (already set in Laravel)',
        'Enable Apache mod_headers and set security headers: X-Frame-Options, X-XSS-Protection, HSTS',
        'Review the CMS Audit Log monthly for unusual activity',
        'Take and test weekly database backups stored off-server',
    ]
    for item in security_items:
        story.append(Paragraph(f'☐  {item}', s['BulletItem']))

    # 11. Maintenance
    story.append(Paragraph('11. Maintenance Procedures', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story.append(Paragraph('<b>Applying System Updates:</b>', s['H3']))
    story += make_steps([
        ('Take a full backup', 'Database dump + storage files. Never update without a restorable backup.'),
        ('Enable maintenance mode', 'In CMS → Site Controls → Maintenance Mode, or run: php artisan down'),
        ('Pull the latest code', 'git pull origin main in the project directory'),
        ('Update PHP dependencies', 'composer install --no-dev --optimize-autoloader'),
        ('Run database migrations', 'php artisan migrate (never migrate:fresh on production)'),
        ('Rebuild frontends', 'Rebuild and re-upload all three React apps'),
        ('Clear and re-cache', 'php artisan config:cache && route:cache && cache:clear'),
        ('Disable maintenance mode & verify', 'Test all three frontends and key API endpoints before announcing system is back.'),
    ])

    # 12. Deployment Checklist
    story.append(Paragraph('12. Full Deployment Checklist', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    checklist_sections = [
        ('Infrastructure', [
            'DNS records configured: A records for www, api, cms, portal-update all pointing to server IP',
            'SSL certificates installed and auto-renewing on all subdomains',
            'Apache virtualhost configured for each subdomain',
            'PHP 8.2+ installed with all required extensions',
            'MySQL/MariaDB running and accessible',
        ]),
        ('Backend API', [
            'Files uploaded (excluding .git, node_modules, .env)',
            'composer install --no-dev completed successfully',
            '.env configured with production values (not development defaults)',
            'php artisan key:generate run — APP_KEY is set',
            'Database created and credentials in .env are correct',
            'php artisan migrate --seed completed — all tables exist',
            'php artisan storage:link run — symlink created',
            'File permissions set: storage/ and bootstrap/cache/ are writable by www-data',
            'php artisan config:cache && route:cache run',
            'Cron job added for scheduler',
            'API health check: https://api.kafu.ac.ke/api/stats returns JSON (not HTML)',
        ]),
        ('Frontend Applications', [
            'Public website built with VITE_API_URL=https://api.kafu.ac.ke and uploaded',
            'CMS admin built and uploaded',
            'Staff portal built and uploaded',
            '.htaccess catch-all rules in place for all three SPAs',
            'www.kafu.ac.ke homepage loads correctly',
            'cms.kafu.ac.ke login page loads correctly',
            'portal-update.kafu.ac.ke login page loads correctly',
        ]),
        ('Security & Go-Live', [
            'All seeded default passwords changed',
            'APP_DEBUG=false confirmed',
            'HTTPS enforced — HTTP redirects to HTTPS on all subdomains',
            'CORS configured to allow only the three known origins',
            'Content reviewed by Communications — homepage and About page are accurate',
            'Smoke test: create news item in CMS → verify it appears on www.kafu.ac.ke/news',
            'Smoke test: staff login to portal → update a field → submit → verify in CMS review queue',
        ]),
    ]
    for section, items in checklist_sections:
        story.append(Paragraph(section, s['H2']))
        for item in items:
            story.append(Paragraph(f'☐  {item}', s['BulletItem']))

    # ═══ PART II ══════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(PartBanner('Part II', 'Website User Manual',
        'A complete guide to navigating www.kafu.ac.ke for students, staff, and the public.'))
    story.append(Spacer(1, 0.4*cm))

    # 13. Intro
    story.append(Paragraph('13. Introduction to the KAFU Website', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-homepage.jpg',
        'Figure 13.1 — The KAFU website homepage at www.kafu.ac.ke. The navigation bar provides access to all major sections.')
    story.append(Paragraph(
        'The Kaimosi Friends University website is the official digital home of the university, providing comprehensive information '
        'about academic programmes, admissions, research, staff, news, and services.', s['Body']))

    # 14. Navigation
    story.append(Paragraph('14. Navigating the Website', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    nav_tbl = make_table([
        ['Navigation Area', 'Contents'],
        ['Utility Bar (top strip)', 'Contact info (phone, email) + Student Portal, E-Learning, Info@kafu.ac.ke quick links'],
        ['Main Navigation', 'Logo (returns to homepage) + Home, About, Academics, Departments, Admissions, Students, News, Media, Research, Directorates, Contact'],
        ['Action Buttons', 'Search icon (magnifying glass) and gold "Apply Now" button (goes to admissions application)'],
    ], col_widths=[4.5*cm, 9.5*cm])
    story.append(nav_tbl)
    story.append(Paragraph(
        'Items with a dropdown arrow (▾) open mega-menu panels when clicked or hovered. '
        'The Search icon opens a full-text search across all content types.', s['Body']))

    # 15. Homepage
    story.append(Paragraph('15. Homepage', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    home_tbl = make_table([
        ['Section', 'What It Shows'],
        ['Hero Slideshow', 'Rotating banner featuring key messages from university leadership'],
        ['Admissions Banner', 'Current application status and countdown timers to key deadlines'],
        ['Programme Discovery', 'Quick filter to find programmes by school and level'],
        ['Schools & Faculties', 'Cards for each of the five schools linking to their detail pages'],
        ['Latest News & Events', 'Four most recent published news articles and upcoming events'],
        ['Opportunities', 'Current scholarships, job vacancies, tenders, and partnerships'],
        ['Digital Services Hub', 'Quick links to Student Portal, E-Learning, Staff Portal, Library'],
    ], col_widths=[4.5*cm, 9.5*cm])
    story.append(home_tbl)

    # 16. About
    story.append(Paragraph('16. About KAFU', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-about.jpg', 'Figure 16.1 — The About KAFU page with campus imagery and institutional history.')
    about_tbl = make_table([
        ['About Sub-page', 'What to Find', 'URL'],
        ['About KAFU', 'History, mission, vision, and core values', '/about'],
        ['Vice-Chancellor', 'Profile and message from the VC', '/about/vice-chancellor'],
        ['Management Board', 'University Management committee members', '/about/management'],
        ['University Council', 'Council members and governance structure', '/about/council'],
        ['Strategic Plan', 'Current strategic plan document', '/about/strategic-plan'],
        ['Policies & Regulations', 'University policies and regulations', '/about/policies'],
        ['Service Charter', 'Service delivery standards', '/about/service-charter'],
    ], col_widths=[4*cm, 6*cm, 4*cm])
    story.append(about_tbl)

    # 17. Academics
    story.append(Paragraph('17. Academics — Schools & Programmes', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-programmes.jpg',
        'Figure 17.1 — The Programmes catalogue with 39 programmes, search, school and level filters, and a compare function.')
    story += screenshot_block('site-schools.jpg',
        'Figure 17.2 — The Schools page listing all five academic schools and the ODeL Directorate.')
    schools_tbl = make_table([
        ['Code', 'School Name', 'Key Disciplines'],
        ['SESS', 'School of Education & Social Sciences', 'Education, Curriculum Studies, Criminology, Psychology'],
        ['SBE',  'School of Business & Economics', 'Commerce, Business Administration, Finance, Economics'],
        ['SCIT', 'School of Computing & Information Technology', 'Computer Science, Information Technology, Data Science'],
        ['SOS',  'School of Science', 'Biology, Chemistry, Physics, Environmental Science'],
        ['SHS',  'School of Health Sciences', 'Nursing, Public Health, Nutrition, Medical Sciences'],
    ], col_widths=[1.5*cm, 5.5*cm, 7*cm])
    story.append(schools_tbl)
    story.append(Paragraph('<b>Finding a Programme:</b>', s['H3']))
    story += make_steps([
        ('Go to Programmes', 'Click Academics → All Programmes or go to /programmes.'),
        ('Search or filter', 'Type a keyword or use the School, Level, and Mode dropdowns.'),
        ('View details', 'Click "View Details" to see description, duration, entry requirements, and fees.'),
        ('Compare', 'Click "Compare" on up to 3 programmes then visit /programmes/compare to see them side by side.'),
        ('Apply', 'Click the gold "Apply" button to go to the online application portal.'),
    ])

    # 18. Admissions
    story.append(Paragraph('18. Admissions', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-admissions.jpg',
        'Figure 18.1 — The Admissions page with deadline countdown timers and application pathways.')
    adm_tbl = make_table([
        ['Pathway', 'Who It Is For'],
        ['KUCCPS (Government)', 'KCSE students placed through the Joint Admissions Board via KUCCPS'],
        ['Module II (Self-Sponsored)', 'Self-sponsored undergraduate applicants not placed through KUCCPS'],
        ['Postgraduate', 'First-degree holders applying for Masters or PhD programmes'],
        ['International Students', 'Students from outside Kenya — see /international/study'],
        ['KUCCPS Verification', 'Verify your KUCCPS placement status at KAFU — /kuccps-verify'],
    ], col_widths=[5*cm, 9*cm])
    story.append(adm_tbl)
    story.append(CalloutBox(
        'TIP — Always check the Admissions page for the most current deadline dates — they change each academic year. Use the Eligibility Checker at /admissions/eligibility to check programme requirements.',
        'tip'))

    # 19. News & Events
    story.append(Paragraph('19. News, Events & Announcements', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-news.jpg',
        'Figure 19.1 — The News page with category filter buttons. The top article is featured prominently.')
    story += screenshot_block('site-events.jpg',
        'Figure 19.2 — The Events Calendar with Upcoming/Past toggle and event type filters.')
    story.append(Paragraph(
        '<b>News (/news):</b> Use category filter buttons (Research, Institutional, Academic, etc.) and keyword search. '
        '<b>Events (/events):</b> Toggle Upcoming/Past, filter by type, click any event for full details. '
        '<b>Announcements (/announcements):</b> Official notices — exam timetables, fee notices, policy updates. '
        '<b>Opportunities (/opportunities):</b> Scholarships, vacancies, tenders, and partnerships.', s['Body']))

    # 20. Research
    story.append(Paragraph('20. Research & Innovation', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-research.jpg',
        'Figure 20.1 — The Research & Innovation page showing key statistics and focus areas.')
    res_tbl = make_table([
        ['Sub-section', 'What to Find', 'URL'],
        ['Research Overview', 'Statistics, themes, and featured research achievements', '/research'],
        ['Research Projects', 'Active and completed projects with principal investigators', '/research/projects'],
        ['Publications', 'Searchable catalogue of papers, books, and conference proceedings', '/research/publications'],
        ['Partnerships', 'International and local research collaborations', '/research/partnerships'],
        ['KAFU Journal', 'University peer-reviewed academic journal', '/research/journal'],
    ], col_widths=[4*cm, 6.5*cm, 3.5*cm])
    story.append(res_tbl)

    # 21. Staff Directory
    story.append(Paragraph('21. Staff Directory', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-staff.jpg',
        'Figure 21.1 — The Staff Directory showing 57 academic staff with search, school filter, rank filter, and research theme tags.')
    story += make_steps([
        ('Use the search box', 'Type a name, role (e.g. "Professor"), or specialisation (e.g. "Machine Learning").'),
        ('Filter by school', 'Use the "All Schools" dropdown to see only staff in a specific school.'),
        ('Filter by rank', 'Use the "All Ranks" dropdown for Professor, Senior Lecturer, Lecturer, etc.'),
        ('Browse research themes', 'Click any tag (e.g. "Artificial Intelligence") to filter by research specialisation.'),
        ('Open a profile', 'Click any staff card to see their full academic profile with bio, qualifications, publications, and contact details.'),
    ])

    # 22. Contact
    story.append(Paragraph('22. Contact & Campuses', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    story += screenshot_block('site-contact.jpg',
        'Figure 22.1 — The Contact & Campuses page with key numbers, email, location, and an interactive map.')
    cont_tbl = make_table([
        ['Channel', 'Details', 'Hours'],
        ['Main Switchboard', '+254 777 373 633', 'Mon–Fri, 8:00 AM – 5:00 PM'],
        ['General Enquiries', 'info@kafu.ac.ke', 'Response within 2 business days'],
        ['Main Campus', 'Kaimosi, Vihiga County — P.O. Box 27–50309', '—'],
        ['ICT Support', 'ict@kafu.ac.ke', 'Mon–Fri, 8:00 AM – 5:00 PM'],
        ['Admissions Office', 'admissions@kafu.ac.ke', 'Mon–Fri, 8:00 AM – 5:00 PM'],
    ], col_widths=[4*cm, 5.5*cm, 4.5*cm])
    story.append(cont_tbl)

    # 23. Student Services
    story.append(Paragraph('23. Student Services & Digital Portals', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    stu_tbl = make_table([
        ['Service', 'Purpose', 'How to Access'],
        ['Student Portal', 'Academic records, registration, fee payments, exam results, timetables', 'portal.kafu.ac.ke — student number and password'],
        ['E-Learning Platform', 'Course materials, assignments, online lectures, discussion forums', 'elearning.kafu.ac.ke — student email and password'],
        ['Library Catalogue', 'Search physical and digital library resources, reserve books', 'Students → Library or library.kafu.ac.ke'],
        ['Student Services', 'Counselling, health services, clubs, accommodation, welfare', '/student-services'],
        ['International Students', 'Visa guidance, housing, orientation, support', '/international'],
    ], col_widths=[3.5*cm, 6*cm, 4.5*cm])
    story.append(stu_tbl)
    story.append(CalloutBox(
        'IMPORTANT — The website at www.kafu.ac.ke is an information website only. To access your student records, register for units, pay fees, or download results, log in to the Student Portal at portal.kafu.ac.ke.',
        'info'))

    # 24. Accessibility
    story.append(Paragraph('24. Accessibility & Browser Support', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    browser_tbl = make_table([
        ['Browser', 'Minimum Version', 'Support'],
        ['Google Chrome', 'Version 90+', 'Full support — recommended'],
        ['Mozilla Firefox', 'Version 88+', 'Full support'],
        ['Microsoft Edge', 'Version 90+', 'Full support'],
        ['Safari (macOS/iOS)', 'Version 14+', 'Full support'],
        ['Chrome (Android)', 'Latest', 'Full support — mobile responsive'],
        ['Internet Explorer', 'Any version', 'Not supported'],
    ], col_widths=[4.5*cm, 4*cm, 5.5*cm])
    story.append(browser_tbl)

    # ─── Appendix ─────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph('A. Glossary of Terms', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    glossary = [
        ('API', 'Application Programming Interface — the backend system the three React frontends call to fetch and update content.'),
        ('Artisan', 'Laravel\'s command-line tool used by ICT to run migrations, clear caches, and manage the application from the server terminal.'),
        ('CMS', 'Content Management System — the administration interface (cms.kafu.ac.ke) used by authorised staff to create and manage website content.'),
        ('Composer', 'PHP package manager — used to install and update the Laravel API\'s dependencies.'),
        ('CORS', 'Cross-Origin Resource Sharing — a browser security mechanism. Must be configured on the API to allow the React frontends to make requests.'),
        ('Migration', 'A version-controlled database schema change. Running "php artisan migrate" applies all pending schema changes.'),
        ('Monorepo', 'A single code repository containing all four applications. Managed with pnpm workspaces.'),
        ('Sanctum', 'Laravel\'s API authentication system. Issues tokens to CMS and staff portal users when they log in.'),
        ('SPA', 'Single Page Application — a web app where navigation happens in the browser without full page reloads.'),
        ('KUCCPS', 'Kenya Universities and Colleges Central Placement Service — places students in universities after KCSE.'),
        ('ORCID', 'Open Researcher and Contributor ID — a unique identifier for academic researchers.'),
    ]
    glos_tbl = make_table(
        [['Term', 'Definition']] + [[t, d] for t, d in glossary],
        col_widths=[2.5*cm, 11.5*cm])
    story.append(glos_tbl)

    story.append(Paragraph('B. Key Contacts Reference', s['H1']))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=8))
    kc_tbl = make_table([
        ['Department', 'Email', 'Purpose'],
        ['ICT Directorate', 'ict@kafu.ac.ke', 'System access, technical issues, CMS and staff portal accounts'],
        ['Communications', 'communications@kafu.ac.ke', 'Website content corrections, news & media enquiries'],
        ['Admissions Office', 'admissions@kafu.ac.ke', 'Application queries, entry requirements, deadlines'],
        ['Human Resources', 'hr@kafu.ac.ke', 'Staff profile corrections, employment verification'],
        ['Research Office', 'research@kafu.ac.ke', 'Research publications, grants, partnerships'],
        ['International Office', 'international@kafu.ac.ke', 'International student enquiries, exchange programmes'],
        ['General Enquiries', 'info@kafu.ac.ke', 'General questions not covered above'],
    ], col_widths=[4*cm, 5*cm, 5*cm])
    story.append(kc_tbl)

    # Footer
    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width='100%', thickness=1, color=BORDER))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        '<b>KAIMOSI FRIENDS UNIVERSITY</b> — Spring of Knowledge<br/>'
        'KAFU Digital Platform — Comprehensive Administration & User Manual v1.0 | ICT Directorate | June 2026<br/>'
        'P.O. Box 385–50309, Kaimosi, Kenya | ict@kafu.ac.ke | +254 777 373 633<br/>'
        '<i>CONFIDENTIAL — For internal use by KAFU staff only.</i>',
        ParagraphStyle('foot2', fontName='Helvetica', fontSize=9, textColor=GRAY, alignment=TA_CENTER, leading=14)))

    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2.5*cm,
        title='KAFU Digital Platform — Comprehensive Manual',
        author='ICT Directorate, Kaimosi Friends University',
        subject='System Administration & Website User Guide',
    )
    doc.build(story, onFirstPage=make_page_template(doc, show_footer=False),
              onLaterPages=make_page_template(doc))
    print(f'Comprehensive manual: {os.path.getsize(out_path):,} bytes')


# ── Run ────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    os.makedirs('docs', exist_ok=True)
    print('Building Training Manual (CMS + Staff Portal)...')
    build_training_manual('docs/kafu-training-manual.pdf')
    print('Building Comprehensive Manual (Sysadmin + Website User Guide)...')
    build_comprehensive_manual('docs/kafu-comprehensive-manual.pdf')
    print('All PDFs generated successfully.')
