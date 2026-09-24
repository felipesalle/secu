// --- Configuración y Constantes del Sistema Ligas La Salle ---

export const TELEGRAM_BOT_TOKEN = '8314025136:AAG3P1AoU1rExMIeTEsE_1YDxc-Vj3r9Tac';
export const TELEGRAM_CHAT_ID = '6740086';
export const APP_LEVEL_NAME = '🏫 SECUNDARIA';

export const sendTelegramNotification = async (message, userEmail) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn("Telegram bot token or chat ID not configured.");
        return;
    }
    try {
        const cleanEmail = userEmail || 'Usuario Administrador';
        const cleanMsg = typeof message === 'string' ? message.replace(/\*/g, '') : message;
        const fullMessage = `📌 [TORNEOS ${APP_LEVEL_NAME}]\n🔔 ACCIÓN EN LA APP:\n${cleanMsg}\n\n👤 Realizada por: ${cleanEmail}`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: fullMessage,
            }),
        });

        const data = await response.json();
        if (data.ok) {
            console.log("Notificación de Telegram enviada con éxito.");
        } else {
            console.error("Telegram API error:", data.description);
        }
    } catch (error) {
        console.error("Error de red enviando notificación a Telegram:", error);
    }
};

// --- Opciones de Días de Juego ---
export const dayOptions = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' }
];

// --- Paleta Oficial de Colores Euro Cotton (16 Colores Disponibles en Tienda) ---
export const EURO_COTTON_COLOR_PALETTE = [
    { name: "Jaspe", hex: "#B5B7B9", border: "#9E9E9E", isLight: true },
    { name: "Negro", hex: "#1A1A1A", border: "#000000", isLight: false },
    { name: "Marino", hex: "#001A4D", border: "#000F33", isLight: false },
    { name: "Rey", hex: "#0055D4", border: "#003EA6", isLight: false },
    { name: "Celeste", hex: "#4A90E2", border: "#2A70C2", isLight: true },
    { name: "Turquesa", hex: "#00A3E0", border: "#0082B3", isLight: false },
    { name: "Aqua", hex: "#00B5AD", border: "#008F88", isLight: true },
    { name: "Limón", hex: "#76D729", border: "#5DB01E", isLight: true },
    { name: "Bandera", hex: "#008037", border: "#005C27", isLight: false },
    { name: "Amarillo", hex: "#FFD100", border: "#D9B200", isLight: true },
    { name: "Canario", hex: "#FFE600", border: "#D9C400", isLight: true },
    { name: "Naranja", hex: "#FF5500", border: "#D94400", isLight: false },
    { name: "Rojo", hex: "#D50000", border: "#B00000", isLight: false },
    { name: "Cherry", hex: "#8B0021", border: "#6B0019", isLight: false },
    { name: "Heliconia", hex: "#E4007C", border: "#B80064", isLight: false },
    { name: "Salmón", hex: "#FF6B6B", border: "#D94D4D", isLight: false }
];

export const GILDAN_COLOR_PALETTE = EURO_COTTON_COLOR_PALETTE;

// --- Catálogo de 24 Clubes Oficiales de la UEFA Champions League (con Colores Euro Cotton) ---
export const CHAMPIONS_LEAGUE_CLUBS = [
    { id: 'real_madrid', name: 'Real Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/86.png', shirtColorName: 'Celeste', shirtColorHex: '#4A90E2' },
    { id: 'barcelona', name: 'FC Barcelona', country: 'España', logoUrl: 'https://crests.football-data.org/81.png', shirtColorName: 'Rey', shirtColorHex: '#0055D4' },
    { id: 'bayern', name: 'Bayern München', country: 'Alemania', logoUrl: 'https://crests.football-data.org/5.png', shirtColorName: 'Rojo', shirtColorHex: '#D50000' },
    { id: 'man_city', name: 'Manchester City', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/65.png', shirtColorName: 'Celeste', shirtColorHex: '#4A90E2' },
    { id: 'liverpool', name: 'Liverpool FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/64.png', shirtColorName: 'Rojo', shirtColorHex: '#D50000' },
    { id: 'psg', name: 'Paris Saint-Germain', country: 'Francia', logoUrl: 'https://crests.football-data.org/524.png', shirtColorName: 'Marino', shirtColorHex: '#001A4D' },
    { id: 'juventus', name: 'Juventus', country: 'Italia', logoUrl: 'https://crests.football-data.org/109.png', shirtColorName: 'Negro', shirtColorHex: '#1A1A1A' },
    { id: 'ac_milan', name: 'AC Milan', country: 'Italia', logoUrl: 'https://crests.football-data.org/98.png', shirtColorName: 'Cherry', shirtColorHex: '#8B0021' },
    { id: 'inter', name: 'Inter de Milán', country: 'Italia', logoUrl: 'https://crests.football-data.org/108.png', shirtColorName: 'Rey', shirtColorHex: '#0055D4' },
    { id: 'arsenal', name: 'Arsenal FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/57.png', shirtColorName: 'Salmón', shirtColorHex: '#FF6B6B' },
    { id: 'chelsea', name: 'Chelsea FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/61.png', shirtColorName: 'Rey', shirtColorHex: '#0055D4' },
    { id: 'man_utd', name: 'Manchester United', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/66.png', shirtColorName: 'Rojo', shirtColorHex: '#D50000' },
    { id: 'atletico', name: 'Atlético de Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/78.png', shirtColorName: 'Naranja', shirtColorHex: '#FF5500' },
    { id: 'dortmund', name: 'Borussia Dortmund', country: 'Alemania', logoUrl: 'https://crests.football-data.org/4.png', shirtColorName: 'Amarillo', shirtColorHex: '#FFD100' },
    { id: 'benfica', name: 'SL Benfica', country: 'Portugal', logoUrl: 'https://crests.football-data.org/1903.png', shirtColorName: 'Heliconia', shirtColorHex: '#E4007C' },
    { id: 'porto', name: 'FC Porto', country: 'Portugal', logoUrl: 'https://crests.football-data.org/503.png', shirtColorName: 'Turquesa', shirtColorHex: '#00A3E0' },
    { id: 'ajax', name: 'Ajax Amsterdam', country: 'Países Bajos', logoUrl: 'https://crests.football-data.org/678.png', shirtColorName: 'Canario', shirtColorHex: '#FFE600' },
    { id: 'leverkusen', name: 'Bayer Leverkusen', country: 'Alemania', logoUrl: 'https://crests.football-data.org/3.png', shirtColorName: 'Negro', shirtColorHex: '#1A1A1A' },
    { id: 'napoli', name: 'SSC Napoli', country: 'Italia', logoUrl: 'https://crests.football-data.org/113.png', shirtColorName: 'Aqua', shirtColorHex: '#00B5AD' },
    { id: 'roma', name: 'AS Roma', country: 'Italia', logoUrl: 'https://crests.football-data.org/100.png', shirtColorName: 'Cherry', shirtColorHex: '#8B0021' },
    { id: 'tottenham', name: 'Tottenham Hotspur', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/73.png', shirtColorName: 'Jaspe', shirtColorHex: '#B5B7B9' },
    { id: 'marseille', name: 'Olympique de Marsella', country: 'Francia', logoUrl: 'https://crests.football-data.org/516.png', shirtColorName: 'Celeste', shirtColorHex: '#4A90E2' },
    { id: 'sporting', name: 'Sporting CP', country: 'Portugal', logoUrl: 'https://crests.football-data.org/498.png', shirtColorName: 'Bandera', shirtColorHex: '#008037' },
    { id: 'celtic', name: 'Celtic FC', country: 'Escocia', logoUrl: 'https://crests.football-data.org/373.png', shirtColorName: 'Limón', shirtColorHex: '#76D729' }
];

export const COUNTRY_CATALOG = CHAMPIONS_LEAGUE_CLUBS;

// --- Funciones Ayudantes para Colores de Playera Euro Cotton ---
export const getShirtColorObj = (colorNameOrObj) => {
    if (!colorNameOrObj) return EURO_COTTON_COLOR_PALETTE[0];
    if (typeof colorNameOrObj === 'object' && colorNameOrObj.hex) return colorNameOrObj;
    const found = EURO_COTTON_COLOR_PALETTE.find(c => c.name.toLowerCase() === String(colorNameOrObj).toLowerCase());
    return found || EURO_COTTON_COLOR_PALETTE[0];
};

export const getUniqueDefaultShirtColor = (existingTeams = [], preferredColorName = null) => {
    const usedNames = existingTeams.map(t => t.shirtColorName || (t.shirtColor && t.shirtColor.name)).filter(Boolean);
    if (preferredColorName && !usedNames.includes(preferredColorName)) {
        const found = EURO_COTTON_COLOR_PALETTE.find(c => c.name.toLowerCase() === preferredColorName.toLowerCase());
        if (found) return found;
    }
    const unused = EURO_COTTON_COLOR_PALETTE.find(c => !usedNames.includes(c.name));
    return unused || EURO_COTTON_COLOR_PALETTE[0];
};

export const getTeamShirtColor = (team, allTeams = []) => {
    if (!team) return EURO_COTTON_COLOR_PALETTE[0];
    
    // 1. Si el equipo ya tiene shirtColorName guardado en Firestore
    if (team.shirtColorName) {
        const found = EURO_COTTON_COLOR_PALETTE.find(c => c.name.toLowerCase() === team.shirtColorName.toLowerCase());
        if (found) return found;
    }

    // 2. Coincidencia por nombre de equipo Champions League
    let candidateColorName = null;
    const teamNameLower = (team.name || '').toLowerCase().trim();

    CHAMPIONS_LEAGUE_CLUBS.forEach(club => {
        const cName = club.name.toLowerCase();
        if (cName && (teamNameLower.includes(cName) || cName.includes(teamNameLower))) {
            if (!candidateColorName) candidateColorName = club.shirtColorName;
        }
    });

    // Mapeo directo por palabra clave para Champions League con Euro Cotton
    if (!candidateColorName) {
        if (teamNameLower.includes('real madrid') || teamNameLower.includes('madrid')) candidateColorName = 'Celeste';
        else if (teamNameLower.includes('barcelona') || teamNameLower.includes('barça')) candidateColorName = 'Rey';
        else if (teamNameLower.includes('bayern') || teamNameLower.includes('munich')) candidateColorName = 'Rojo';
        else if (teamNameLower.includes('paris') || teamNameLower.includes('psg')) candidateColorName = 'Marino';
        else if (teamNameLower.includes('manchester city') || teamNameLower.includes('city')) candidateColorName = 'Celeste';
        else if (teamNameLower.includes('inter')) candidateColorName = 'Rey';
        else if (teamNameLower.includes('milan')) candidateColorName = 'Cherry';
        else if (teamNameLower.includes('dortmund') || teamNameLower.includes('borussia')) candidateColorName = 'Amarillo';
        else if (teamNameLower.includes('arsenal')) candidateColorName = 'Salmón';
        else if (teamNameLower.includes('atlético') || teamNameLower.includes('atletico')) candidateColorName = 'Naranja';
        else if (teamNameLower.includes('juventus') || teamNameLower.includes('juve')) candidateColorName = 'Negro';
        else if (teamNameLower.includes('benfica')) candidateColorName = 'Heliconia';
        else if (teamNameLower.includes('porto')) candidateColorName = 'Turquesa';
    }

    // Comprobar colores utilizados en la misma liga
    const leagueTeams = (allTeams || []).filter(t => t.leagueId === team.leagueId);
    const usedColorNames = leagueTeams
        .filter(t => t.id !== team.id && t.shirtColorName)
        .map(t => t.shirtColorName);

    // Si el color representativo está libre en la liga, asignarlo
    if (candidateColorName && !usedColorNames.includes(candidateColorName)) {
        const found = EURO_COTTON_COLOR_PALETTE.find(c => c.name.toLowerCase() === candidateColorName.toLowerCase());
        if (found) return found;
    }

    // Si no, buscar un color no usado en la liga
    const unusedColor = EURO_COTTON_COLOR_PALETTE.find(c => !usedColorNames.includes(c.name));
    if (unusedColor) return unusedColor;

    // Fallback por índice
    const teamIndex = leagueTeams.findIndex(t => t.id === team.id);
    const fallbackIdx = (teamIndex >= 0 ? teamIndex : 0) % EURO_COTTON_COLOR_PALETTE.length;
    return EURO_COTTON_COLOR_PALETTE[fallbackIdx];
};

export const getSportScoringInfo = (sport) => {
    switch (sport) {
        case 'Básquetbol':
            return { unit: 'Puntos', unitShort: 'pts', leaderTitle: 'Máximo Anotador', emoji: '🏀' };
        case 'Tocho':
            return { unit: 'Touchdowns', unitShort: 'TDs', leaderTitle: 'Máximo Anotador TD', emoji: '🏈' };
        case 'Voleibol':
            return { unit: 'Puntos', unitShort: 'pts', leaderTitle: 'Máximo Anotador', emoji: '🏐', noScorers: true };
        case 'Fútbol':
        default:
            return { unit: 'Goles', unitShort: 'goles', leaderTitle: 'Máximo Goleador', emoji: '⚽' };
    }
};

export const leagueSortOrder = [
    'grupos a varonil',
    'grupos a femenil',
    'grupos b varonil',
    'grupos b femenil'
];

export const getLeagueSortIndex = (name) => {
    if (!name) return 99;
    const lower = name.toLowerCase().trim();
    const idx = leagueSortOrder.findIndex(pattern => lower.includes(pattern) || pattern.includes(lower));
    return idx !== -1 ? idx : 99;
};

export const sortLeagues = (a, b) => {
    const indexA = getLeagueSortIndex(a?.name);
    const indexB = getLeagueSortIndex(b?.name);
    if (indexA !== indexB) return indexA - indexB;
    return (a?.name || '').localeCompare(b?.name || '');
};
