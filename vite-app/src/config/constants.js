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

// --- Paleta Oficial de Colores Gildan (41 colores, excluyendo Blanco) ---
export const GILDAN_COLOR_PALETTE = [
    { name: "Amarillo Brillante", hex: "#FFD700", border: "#E6C200", isLight: true },
    { name: "Oro", hex: "#FFA500", border: "#E69500", isLight: true },
    { name: "Naranja", hex: "#FF6600", border: "#E65C00", isLight: false },
    { name: "Naranja S.", hex: "#FF4500", border: "#E63E00", isLight: false },
    { name: "Naranja Jaspe", hex: "#FF7F50", border: "#E67248", isLight: false },
    { name: "Coral", hex: "#FF6F61", border: "#E66458", isLight: false },
    { name: "Azalea", hex: "#E42575", border: "#CD2169", isLight: false },
    { name: "Palo de Rosa", hex: "#E8ADAA", border: "#D19C99", isLight: true },
    { name: "Rosa Seguridad", hex: "#FF69B4", border: "#E65F02", isLight: true },
    { name: "Rosa Tropical", hex: "#E6399B", border: "#CF338C", isLight: false },
    { name: "Rojo", hex: "#D32F2F", border: "#B71C1C", isLight: false },
    { name: "Rojo Cereza", hex: "#990000", border: "#800000", isLight: false },
    { name: "Marrón", hex: "#6D4C41", border: "#5D4037", isLight: false },
    { name: "Chocolate", hex: "#3E2723", border: "#2C1B18", isLight: false },
    { name: "Púrpura", hex: "#4A148C", border: "#3B1070", isLight: false },
    { name: "Púrpura Jaspe", hex: "#7B1FA2", border: "#6A1B8E", isLight: false },
    { name: "Azul Claro", hex: "#81D4FA", border: "#4FC3F7", isLight: true },
    { name: "Azul Celeste", hex: "#29B6F6", border: "#0288D1", isLight: true },
    { name: "Royal Jaspe", hex: "#2979FF", border: "#1765E6", isLight: false },
    { name: "Royal", hex: "#1565C0", border: "#0D47A1", isLight: false },
    { name: "Azul Marino", hex: "#001E61", border: "#0A1442", isLight: false },
    { name: "Azul Marino Jaspe", hex: "#1A237E", border: "#121858", isLight: false },
    { name: "Turquesa", hex: "#00ACC1", border: "#00838F", isLight: false },
    { name: "Turquesa Antiguo", hex: "#00838F", border: "#006064", isLight: false },
    { name: "Jade", hex: "#00897B", border: "#00695C", isLight: false },
    { name: "Verde Pasto", hex: "#2E7D32", border: "#1B5E20", isLight: false },
    { name: "Verde Césped", hex: "#4CAF50", border: "#388E3C", isLight: false },
    { name: "Verde Irlandés", hex: "#00E676", border: "#00C853", isLight: true },
    { name: "Verde Neón", hex: "#76FF03", border: "#64DD17", isLight: true },
    { name: "Verde Seguridad", hex: "#CCFF00", border: "#B2E600", isLight: true },
    { name: "Limón", hex: "#CDDC39", border: "#AFB42B", isLight: true },
    { name: "Verde Militar", hex: "#4B5320", border: "#393F18", isLight: false },
    { name: "Bosque", hex: "#1B5E20", border: "#144718", isLight: false },
    { name: "Índigo", hex: "#3F51B5", border: "#303F9F", isLight: false },
    { name: "Arena", hex: "#E3DAC9", border: "#C7BCAB", isLight: true },
    { name: "Gris Jaspe", hex: "#BDBDBD", border: "#9E9E9E", isLight: true },
    { name: "Gris Jaspe RS", hex: "#9E9E9E", border: "#757575", isLight: false },
    { name: "Grafito Jaspe", hex: "#616161", border: "#424242", isLight: false },
    { name: "Jaspe Oscuro", hex: "#37474F", border: "#263238", isLight: false },
    { name: "Carbón", hex: "#212121", border: "#000000", isLight: false },
    { name: "Negro", hex: "#000000", border: "#000000", isLight: false }
];

// --- Catálogo de 24 Clubes Oficiales de la UEFA Champions League para Secundaria (con Colores de Playera Gildan) ---
export const CHAMPIONS_LEAGUE_CLUBS = [
    { id: 'real_madrid', name: 'Real Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/86.png', shirtColorName: 'Azul Claro', shirtColorHex: '#81D4FA' },
    { id: 'barcelona', name: 'FC Barcelona', country: 'España', logoUrl: 'https://crests.football-data.org/81.png', shirtColorName: 'Royal', shirtColorHex: '#1565C0' },
    { id: 'bayern', name: 'Bayern München', country: 'Alemania', logoUrl: 'https://crests.football-data.org/5.png', shirtColorName: 'Rojo', shirtColorHex: '#D32F2F' },
    { id: 'man_city', name: 'Manchester City', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/65.png', shirtColorName: 'Azul Celeste', shirtColorHex: '#29B6F6' },
    { id: 'liverpool', name: 'Liverpool FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/64.png', shirtColorName: 'Rojo', shirtColorHex: '#D32F2F' },
    { id: 'psg', name: 'Paris Saint-Germain', country: 'Francia', logoUrl: 'https://crests.football-data.org/524.png', shirtColorName: 'Azul Marino', shirtColorHex: '#001E61' },
    { id: 'juventus', name: 'Juventus', country: 'Italia', logoUrl: 'https://crests.football-data.org/109.png', shirtColorName: 'Negro', shirtColorHex: '#000000' },
    { id: 'ac_milan', name: 'AC Milan', country: 'Italia', logoUrl: 'https://crests.football-data.org/98.png', shirtColorName: 'Rojo Cereza', shirtColorHex: '#990000' },
    { id: 'inter', name: 'Inter de Milán', country: 'Italia', logoUrl: 'https://crests.football-data.org/108.png', shirtColorName: 'Royal Jaspe', shirtColorHex: '#2979FF' },
    { id: 'arsenal', name: 'Arsenal FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/57.png', shirtColorName: 'Coral', shirtColorHex: '#FF6F61' },
    { id: 'chelsea', name: 'Chelsea FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/61.png', shirtColorName: 'Royal', shirtColorHex: '#1565C0' },
    { id: 'man_utd', name: 'Manchester United', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/66.png', shirtColorName: 'Rojo', shirtColorHex: '#D32F2F' },
    { id: 'atletico', name: 'Atlético de Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/78.png', shirtColorName: 'Naranja S.', shirtColorHex: '#FF4500' },
    { id: 'dortmund', name: 'Borussia Dortmund', country: 'Alemania', logoUrl: 'https://crests.football-data.org/4.png', shirtColorName: 'Amarillo Brillante', shirtColorHex: '#FFD700' },
    { id: 'benfica', name: 'SL Benfica', country: 'Portugal', logoUrl: 'https://crests.football-data.org/1903.png', shirtColorName: 'Azalea', shirtColorHex: '#E42575' },
    { id: 'porto', name: 'FC Porto', country: 'Portugal', logoUrl: 'https://crests.football-data.org/503.png', shirtColorName: 'Royal', shirtColorHex: '#1565C0' },
    { id: 'ajax', name: 'Ajax Amsterdam', country: 'Países Bajos', logoUrl: 'https://crests.football-data.org/678.png', shirtColorName: 'Rojo', shirtColorHex: '#D32F2F' },
    { id: 'leverkusen', name: 'Bayer Leverkusen', country: 'Alemania', logoUrl: 'https://crests.football-data.org/3.png', shirtColorName: 'Negro', shirtColorHex: '#000000' },
    { id: 'napoli', name: 'SSC Napoli', country: 'Italia', logoUrl: 'https://crests.football-data.org/113.png', shirtColorName: 'Azul Celeste', shirtColorHex: '#29B6F6' },
    { id: 'roma', name: 'AS Roma', country: 'Italia', logoUrl: 'https://crests.football-data.org/100.png', shirtColorName: 'Rojo Cereza', shirtColorHex: '#990000' },
    { id: 'tottenham', name: 'Tottenham Hotspur', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/73.png', shirtColorName: 'Azul Claro', shirtColorHex: '#81D4FA' },
    { id: 'marseille', name: 'Olympique de Marsella', country: 'Francia', logoUrl: 'https://crests.football-data.org/516.png', shirtColorName: 'Azul Celeste', shirtColorHex: '#29B6F6' },
    { id: 'sporting', name: 'Sporting CP', country: 'Portugal', logoUrl: 'https://crests.football-data.org/498.png', shirtColorName: 'Verde Césped', shirtColorHex: '#4CAF50' },
    { id: 'celtic', name: 'Celtic FC', country: 'Escocia', logoUrl: 'https://crests.football-data.org/373.png', shirtColorName: 'Verde Irlandés', shirtColorHex: '#00E676' }
];

export const COUNTRY_CATALOG = CHAMPIONS_LEAGUE_CLUBS;

// --- Funciones Ayudantes para Colores de Playera Gildan ---
export const getShirtColorObj = (colorNameOrObj) => {
    if (!colorNameOrObj) return GILDAN_COLOR_PALETTE[0];
    if (typeof colorNameOrObj === 'object' && colorNameOrObj.hex) return colorNameOrObj;
    const found = GILDAN_COLOR_PALETTE.find(c => c.name.toLowerCase() === String(colorNameOrObj).toLowerCase());
    return found || GILDAN_COLOR_PALETTE[0];
};

export const getUniqueDefaultShirtColor = (existingTeams = [], preferredColorName = null) => {
    const usedNames = existingTeams.map(t => t.shirtColorName || (t.shirtColor && t.shirtColor.name)).filter(Boolean);
    if (preferredColorName && !usedNames.includes(preferredColorName)) {
        const found = GILDAN_COLOR_PALETTE.find(c => c.name.toLowerCase() === preferredColorName.toLowerCase());
        if (found) return found;
    }
    const unused = GILDAN_COLOR_PALETTE.find(c => !usedNames.includes(c.name));
    return unused || GILDAN_COLOR_PALETTE[0];
};

export const getTeamShirtColor = (team, allTeams = []) => {
    if (!team) return GILDAN_COLOR_PALETTE[0];
    
    // 1. Si el equipo ya tiene shirtColorName guardado en Firestore
    if (team.shirtColorName) {
        const found = GILDAN_COLOR_PALETTE.find(c => c.name.toLowerCase() === team.shirtColorName.toLowerCase());
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

    // Mapeo directo por palabra clave para Champions League
    if (!candidateColorName) {
        if (teamNameLower.includes('real madrid') || teamNameLower.includes('madrid')) candidateColorName = 'Azul Claro';
        else if (teamNameLower.includes('barcelona') || teamNameLower.includes('barça')) candidateColorName = 'Royal';
        else if (teamNameLower.includes('bayern') || teamNameLower.includes('munich')) candidateColorName = 'Rojo';
        else if (teamNameLower.includes('paris') || teamNameLower.includes('psg')) candidateColorName = 'Azul Marino';
        else if (teamNameLower.includes('manchester city') || teamNameLower.includes('city')) candidateColorName = 'Azul Celeste';
        else if (teamNameLower.includes('inter')) candidateColorName = 'Royal Jaspe';
        else if (teamNameLower.includes('milan')) candidateColorName = 'Rojo Cereza';
        else if (teamNameLower.includes('dortmund') || teamNameLower.includes('borussia')) candidateColorName = 'Amarillo Brillante';
        else if (teamNameLower.includes('arsenal')) candidateColorName = 'Coral';
        else if (teamNameLower.includes('atlético') || teamNameLower.includes('atletico')) candidateColorName = 'Naranja S.';
        else if (teamNameLower.includes('juventus') || teamNameLower.includes('juve')) candidateColorName = 'Negro';
        else if (teamNameLower.includes('benfica')) candidateColorName = 'Azalea';
        else if (teamNameLower.includes('porto')) candidateColorName = 'Royal';
    }

    // Comprobar colores utilizados en la misma liga
    const leagueTeams = (allTeams || []).filter(t => t.leagueId === team.leagueId);
    const usedColorNames = leagueTeams
        .filter(t => t.id !== team.id && t.shirtColorName)
        .map(t => t.shirtColorName);

    // Si el color representativo está libre en la liga, asignarlo
    if (candidateColorName && !usedColorNames.includes(candidateColorName)) {
        const found = GILDAN_COLOR_PALETTE.find(c => c.name.toLowerCase() === candidateColorName.toLowerCase());
        if (found) return found;
    }

    // Si no, buscar un color no usado en la liga
    const unusedColor = GILDAN_COLOR_PALETTE.find(c => !usedColorNames.includes(c.name));
    if (unusedColor) return unusedColor;

    // Fallback por índice
    const teamIndex = leagueTeams.findIndex(t => t.id === team.id);
    const fallbackIdx = (teamIndex >= 0 ? teamIndex : 0) % GILDAN_COLOR_PALETTE.length;
    return GILDAN_COLOR_PALETTE[fallbackIdx];
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
