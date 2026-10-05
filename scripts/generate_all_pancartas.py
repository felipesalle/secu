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

os.makedirs(DIR_INDIVIDUAL, exist_ok=True)

TEAMS_CONFIG = [
    {"filename": "PANCARTA_AEK_ATENAS.pdf", "team": "AEK Atenas", "lines": ["AEK", "ATENAS"], "logoUrl": "https://crests.football-data.org/1031.png"},
    {"filename": "PANCARTA_ARSENAL.pdf", "team": "Arsenal FC", "lines": ["ARSENAL", "FC"], "logoUrl": "https://crests.football-data.org/57.png"},
    {"filename": "PANCARTA_ASTON_VILLA.pdf", "team": "Aston Villa", "lines": ["ASTON", "VILLA"], "logoUrl": "https://crests.football-data.org/58.png"},
    {"filename": "PANCARTA_ATLETICO_MADRID.pdf", "team": "Atlético de Madrid", "lines": ["ATLÉTICO DE", "MADRID"], "logoUrl": "https://crests.football-data.org/78.png"},
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
    {"filename": "PANCARTA_PARIS_SAINT_GERMAIN.pdf", "team": "Paris Saint-Germain", "lines": ["PARIS SAINT-", "GERMAIN"], "logoUrl": "https://crests.football-data.org/524.png"},
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
            # Convert RGBA to RGB with white background if needed or keep transparent
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

def compute_equal_font_size(c_dummy, lines, max_width=840.0, max_height=640.0):
    font_size = 380.0
    while font_size > 20.0:
        widths = [c_dummy.stringWidth(line, FONT_NAME, font_size) for line in lines]
        max_w = max(widths)
        
        # Line spacing / leading
        leading = font_size * 0.95
        total_h = (len(lines) - 1) * leading + font_size * 0.8
        
        if max_w <= max_width and total_h <= max_height:
            return font_size
        font_size -= 1.0
    return 20.0

def draw_banner_page(c, item, logo_reader):
    c.setPageSize((PAGE_WIDTH, PAGE_HEIGHT))
    
    # 1. Background (Pure White)
    c.setFillColorRGB(1, 1, 1)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # 2. Draw Escudo / Logo on Left side
    # Target Box: X in [60, 300], Y in [150, 642] (Centered vertically, ~240x480 max)
    if logo_reader:
        try:
            img_w, img_h = logo_reader.getSize()
            target_max_w = 230.0
            target_max_h = 360.0
            
            aspect = img_w / float(img_h)
            if target_max_w / target_max_h > aspect:
                draw_h = target_max_h
                draw_w = draw_h * aspect
            else:
                draw_w = target_max_w
                draw_h = draw_w / aspect
            
            # Position logo
            draw_x = 75.0 + (target_max_w - draw_w) / 2.0
            draw_y = (PAGE_HEIGHT - draw_h) / 2.0 + 30.0  # Slightly above middle
            
            c.drawImage(logo_reader, draw_x, draw_y, width=draw_w, height=draw_h, mask='auto')
        except Exception as err:
            print(f"Error drawing logo for {item['team']}: {err}")

    # 3. Compute Equal Font Size for both top & bottom lines
    font_size = compute_equal_font_size(c, item["lines"], max_width=830.0, max_height=650.0)
    leading = font_size * 0.92
    
    lines = item["lines"]
    num_lines = len(lines)
    
    # Calculate total block height to center vertically
    total_block_h = (num_lines - 1) * leading + font_size * 0.75
    start_y = (PAGE_HEIGHT + total_block_h) / 2.0 - font_size * 0.75
    
    # Left-align text at X = 320 pt (or X = 330 pt)
    start_x = 320.0
    
    c.setFillColorRGB(0, 0, 0)
    c.setFont(FONT_NAME, font_size)
    
    current_y = start_y
    for line in lines:
        c.drawString(start_x, current_y, line)
        current_y -= leading

def main():
    dummy_c = canvas.Canvas("scratch_dummy.pdf")
    
    print("--- Starting Banner Generation ---")
    
    # Create General Consolidated PDF
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
        print(f"   -> Saved individual PDF: {item['filename']}")

    c_general.save()
    print(f"\n✅ Saved Consolidated PDF: {PATH_GENERAL}")
    
    if os.path.exists("scratch_dummy.pdf"):
        os.remove("scratch_dummy.pdf")

if __name__ == "__main__":
    main()
