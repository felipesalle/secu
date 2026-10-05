import os
from reportlab.pdfgen import canvas

PAGE_WIDTH = 1224.0
PAGE_HEIGHT = 792.0

FONT_NAME = "Helvetica-Bold"

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

dummy_canvas = canvas.Canvas("dummy.pdf")

def compute_equal_font_size(lines, font_name=FONT_NAME, max_width=840.0, max_height=680.0):
    font_size = 380.0
    while font_size > 20.0:
        widths = [dummy_canvas.stringWidth(line, font_name, font_size) for line in lines]
        max_w = max(widths)
        
        leading = font_size * 0.92
        total_h = (len(lines) - 1) * leading + font_size * 0.8
        
        if max_w <= max_width and total_h <= max_height:
            return font_size
        font_size -= 1.0
    return 20.0

for item in TEAMS_CONFIG:
    sz = compute_equal_font_size(item["lines"])
    w1 = dummy_canvas.stringWidth(item["lines"][0], FONT_NAME, sz)
    w2 = dummy_canvas.stringWidth(item["lines"][1], FONT_NAME, sz)
    print(f"{item['team']:<22} | Lines: {item['lines']} | Equal FontSize: {sz:.1f} pt | Line1 Width: {w1:.1f} pt | Line2 Width: {w2:.1f} pt")

if os.path.exists("dummy.pdf"):
    os.remove("dummy.pdf")
