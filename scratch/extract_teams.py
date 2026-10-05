import re
import json

with open('vite-app/src/config/constants.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match REAL_EXCEL_DATASET
# Let's find team names and logoUrls
pattern = r"name:\s*'([^']+)',\s*logoUrl:\s*'([^']+)'"
matches = re.findall(pattern, text)

print(f"Total teams matched: {len(matches)}")
teams_list = []
for name, logo in matches:
    if name not in [t['name'] for t in teams_list]:
        teams_list.append({'name': name, 'logoUrl': logo})

for idx, t in enumerate(teams_list, 1):
    print(f"{idx}. {t['name']} => {t['logoUrl']}")
