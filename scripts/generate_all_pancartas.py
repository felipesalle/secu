import os
import sys
import requests
from io import BytesIO
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import pymupdf  # PyMuPDF to convert PDF pages to preview PNGs for validation

# PDF Dimensions: 17 x 11 inches (Tabloid Landscape)
PAGE_WIDTH = 1224.0
PAGE_HEIGHT = 792.0
FONT_NAME = "Helvetica-Bold"

# Output directories
DIR_INDIVIDUAL = os.path.join(os.getcwd(), "pancartas_individuales")
PATH_GENERAL = os.path.join(os.getcwd(), "PANCARTAS_GENERAL_SECUNDARIA.pdf")
DIR_PREVIEWS = os.path.join(os.getcwd(), "pancartas_previews")

os.makedirs(DIR_INDIVIDUAL, exist_ok=True)
os.makedirs(DIR_PREVIEWS, exist_ok=True)

TEAMS_CONFIG = [
    {"filename": "PANCARTA_AEK_ATENAS.pdf", "team": "AEK Atenas", "lines": ["AEK", "ATENAS"], "logoUrl": "https://crests.football-data.org/1031.png"},
    {"filename": "PANCARTA_ARSENAL.pdf", "team": "Arsenal FC", "lines": ["ARSENAL", "FC"], "logoUrl": "https://crests.football-data.org/57.png"},
    {"filename": "PANCARTA_ASTON_VILLA.pdf", "team": "Aston Villa", "lines": ["ASTON", "VILLA"], "logoUrl": "https://crests.football-data.org/58.png"},
    {"filename": "PANCARTA_ATLETICO_MADRID.pdf", "team": "Atlético de Madrid", "lines": ["ATLÉTICO", "DE MADRID"], "logoUrl": "https://crests.football-data.org/78.png"},
    {"filename": "PANCARTA_FC_BARCELONA.pdf", "team": "FC Barcelona", "lines": ["FC", "BARCELONA"], "logoUrl": "https://crests.football-data.org/81.png"},
    {"filename": "PANCARTA_BAYERN_MUNCHEN.pdf", "team": "Bayern München", "lines": ["BAYERN", "MÜNCHEN"], "logoUrl": "https://crests.football-data.org/5.png"},
    {"filename": "PANCARTA_BORUSSIA_DORTMUND.pdf", "team": "Borussia Dortmund", "lines": ["BORUSSIA", "DORTMUND"], "logoUrl": "https://crests.football-data.org/4.png"},
    {"filename": "PANCARTA_CLUB_BRUGGE.pdf", "team": "Club Brugge KV", "lines": ["CLUB", "BRUGGE"], "logoUrl": "https://crests.football-data.org/548.png"},
    {"filename": "PANCARTA_COMO_1907.pdf", "team": "Como 1907", "lines": ["COMO", "1907"], "logoUrl": "https://crests.football-data.org/1057.png"},
    {"filename": "PANCARTA_FEYENOORD.pdf", "team": "Feyenoord", "lines": ["FEYE", "NOORD"], "logoUrl": "https://crests.football-data.org/675.png"},
    {"filename": "PANCARTA_GALATASARAY.pdf", "team": "Galatasaray", "lines": ["GALATA", "SARAY"], "logoUrl": "https://crests.football-data.org/610.png"},
    {"filename": "PANCARTA_INTER_MILAN.pdf", "team": "Inter de Milán", "lines": ["INTER DE", "MILÁN"], "logoUrl": "https://crests.football-data.org/108.png"},
    {"filename": "PANCARTA_JUVENTUS.pdf", "team": "Juventus FC", "lines": ["JUVENTUS", "FC"], "logoUrl": "https://crests.football-data.org/109.png"},
    {"filename": "PANCARTA_RB_LEIPZIG.pdf", "team": "RB Leipzig", "lines": ["RB", "LEIPZIG"], "logoUrl": "https://crests.football-data.org/721.png"},
    {"filename": "PANCARTA_LILLE_OSC.pdf", "team": "Lille OSC", "lines": ["LILLE", "OSC"], "logoUrl": "https://crests.football-data.org/521.png"},
    {"filename": "PANCARTA_LIVERPOOL.pdf", "team": "Liverpool FC", "lines": ["LIVERPOOL", "FC"], "logoUrl": "https://crests.football-data.org/64.png"},
    {"filename": "PANCARTA_MANCHESTER_CITY.pdf", "team": "Manchester City", "lines": ["MANCHESTER", "CITY"], "logoUrl": "https://crests.football-data.org/65.png"},
    {"filename": "PANCARTA_MANCHESTER_UNITED.pdf", "team": "Manchester United", "lines": ["MANCHESTER", "UNITED"], "logoUrl": "https://crests.football-data.org/66.png"},
    {"filename": "PANCARTA_PARIS_SAINT_GERMAIN.pdf", "team": "Paris Saint-Germain", "lines": ["PARIS", "SAINT-GERMAIN"], "logoUrl": "https://crests.football-data.org/524.png"},
    {"filename": "PANCARTA_REAL_MADRID.pdf", "team": "Real Madrid", "lines": ["REAL", "MADRID"], "logoUrl": "https://crests.football-data.org/86.png"},
    {"filename": "PANCARTA_SPORTING_CP.pdf", "team": "Sporting CP", "lines": ["SPORTING", "CP"], "logoUrl": "https://crests.football-data.org/498.png"},
    {"filename": "PANCARTA_VILLARREAL.pdf", "team": "Villarreal CF", "lines": ["VILLARREAL", "CF"], "logoUrl": "https://crests.football-data.org/94.png"}
]

# Cache downloaded images
image_cache = {}

def get_logo_image(url):
    if url in image_cache:
        return image_cache[url]
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            pil_img = Image.open(BytesIO(resp.content))
            if pil_img.mode in ('RGBA', 'LA') or (pil_img.mode == 'P' and 'transparency' in pil_img.info):
                alpha = pil_img.convert('RGBA')
                bg = Image.new('RGBA', alpha.size, (255, 255, 255, 255))
                bg.paste(alpha, mask=alpha)
                pil_img = bg.convert('RGB')
            img_reader = ImageReader(pil_img)
            image_cache[url] = img_reader
            return img_reader
    except Exception as e:
        print(f"Error fetching image {url}: {e}")
    return None

def compute_equal_font_size(c_dummy, line1, line2, x_line1=370.0, x_line2=280.0, margin_right=40.0):
    max_w1 = PAGE_WIDTH - margin_right - x_line1
    max_w2 = PAGE_WIDTH - margin_right - x_line2
    max_h = 320.0  # Max height per half
    
    font_size = 380.0
    while font_size > 20.0:
        w1 = c_dummy.stringWidth(line1, FONT_NAME, font_size)
        w2 = c_dummy.stringWidth(line2, FONT_NAME, font_size)
        
        # Approx cap height = 0.72 * font_size
        h = font_size * 0.72
        
        if w1 <= max_w1 and w2 <= max_w2 and h <= max_h:
            return font_size
        font_size -= 1.0
    return 20.0

def draw_banner_page(c, item, logo_reader):
    c.setPageSize((PAGE_WIDTH, PAGE_HEIGHT))
    
    # 1. Background (Pure White)
    c.setFillColorRGB(1, 1, 1)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # 2. Horizontal Divider Line (Middle of page, Y = 396 pt top-down, Y = 396 ReportLab coords)
    divider_y = 396.0
    c.setStrokeColorRGB(0.0, 0.584, 0.853)  # #0095DA cyan/blue
    c.setLineWidth(1.5)
    c.line(14.0, divider_y, PAGE_WIDTH - 14.0, divider_y)
    
    # 3. Draw Escudo / Logo in Top Half (Y from 396 to 792)
    # Bbox in Top Half: X in [70, 330], Y in [410, 765]
    if logo_reader:
        try:
            img_w, img_h = logo_reader.getSize()
            box_x = 70.0
            box_w = 260.0
            box_y = 410.0
            box_h = 355.0
            
            aspect = img_w / float(img_h)
            if box_w / box_h > aspect:
                draw_h = box_h
                draw_w = draw_h * aspect
            else:
                draw_w = box_w
                draw_h = draw_w / aspect
            
            draw_x = box_x + (box_w - draw_w) / 2.0
            draw_y = box_y + (box_h - draw_h) / 2.0
            
            c.drawImage(logo_reader, draw_x, draw_y, width=draw_w, height=draw_h, mask='auto')
        except Exception as err:
            print(f"Error drawing logo for {item['team']}: {err}")

    # 4. Text positioning
    line1, line2 = item["lines"][0], item["lines"][1]
    
    x_line1 = 370.0
    x_line2 = 280.0
    
    # Compute single font size used for BOTH line1 and line2
    font_size = compute_equal_font_size(c, line1, line2, x_line1=x_line1, x_line2=x_line2)
    
    c.setFillColorRGB(0, 0, 0)
    c.setFont(FONT_NAME, font_size)
    
    # Top Half baseline: centered in upper half (Y from 396 to 792)
    # Midpoint of upper half is Y = 594 pt. Baseline is offset by approx cap_height/2 = (font_size * 0.72) / 2
    y_line1_baseline = 594.0 - (font_size * 0.72 / 2.0) + (font_size * 0.1)
    
    # Bottom Half baseline: centered in lower half (Y from 0 to 396)
    # Midpoint of lower half is Y = 198 pt.
    y_line2_baseline = 198.0 - (font_size * 0.72 / 2.0) + (font_size * 0.1)
    
    # Draw Line 1 (Top right)
    c.drawString(x_line1, y_line1_baseline, line1)
    
    # Draw Line 2 (Bottom)
    c.drawString(x_line2, y_line2_baseline, line2)

def generate_preview_png(pdf_path, png_path):
    doc = pymupdf.open(pdf_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=150)
    pix.save(png_path)
    doc.close()

def main():
    dummy_c = canvas.Canvas("scratch_dummy.pdf")
    
    print("--- Starting Banner Generation (2-Half Divided Layout) ---")
    
    c_general = canvas.Canvas(PATH_GENERAL, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    
    count = 0
    for item in TEAMS_CONFIG:
        count += 1
        print(f"[{count}/{len(TEAMS_CONFIG)}] Processing: {item['team']}...")
        
        logo_reader = get_logo_image(item["logoUrl"])
        
        # 1. Render page in General PDF
        draw_banner_page(c_general, item, logo_reader)
        c_general.showPage()
        
        # 2. Render Individual PDF
        indiv_path = os.path.join(DIR_INDIVIDUAL, item["filename"])
        c_indiv = canvas.Canvas(indiv_path, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
        draw_banner_page(c_indiv, item, logo_reader)
        c_indiv.save()
        
        # 3. Generate Preview PNG
        preview_filename = item["filename"].replace(".pdf", ".png")
        preview_path = os.path.join(DIR_PREVIEWS, preview_filename)
        generate_preview_png(indiv_path, preview_path)
        print(f"   -> Saved individual PDF & preview PNG: {preview_filename}")

    c_general.save()
    print(f"\n[SUCCESS] Saved Consolidated PDF: {PATH_GENERAL}")
    
    if os.path.exists("scratch_dummy.pdf"):
        os.remove("scratch_dummy.pdf")

if __name__ == "__main__":
    main()
