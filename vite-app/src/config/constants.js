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

// --- Catálogo de 24 Clubes Oficiales de la UEFA Champions League para Secundaria ---
export const CHAMPIONS_LEAGUE_CLUBS = [
    { id: 'real_madrid', name: 'Real Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/86.png' },
    { id: 'barcelona', name: 'FC Barcelona', country: 'España', logoUrl: 'https://crests.football-data.org/81.png' },
    { id: 'bayern', name: 'Bayern München', country: 'Alemania', logoUrl: 'https://crests.football-data.org/5.png' },
    { id: 'man_city', name: 'Manchester City', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/65.png' },
    { id: 'liverpool', name: 'Liverpool FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/64.png' },
    { id: 'psg', name: 'Paris Saint-Germain', country: 'Francia', logoUrl: 'https://crests.football-data.org/524.png' },
    { id: 'juventus', name: 'Juventus', country: 'Italia', logoUrl: 'https://crests.football-data.org/109.png' },
    { id: 'ac_milan', name: 'AC Milan', country: 'Italia', logoUrl: 'https://crests.football-data.org/98.png' },
    { id: 'inter', name: 'Inter de Milán', country: 'Italia', logoUrl: 'https://crests.football-data.org/108.png' },
    { id: 'arsenal', name: 'Arsenal FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/57.png' },
    { id: 'chelsea', name: 'Chelsea FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/61.png' },
    { id: 'man_utd', name: 'Manchester United', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/66.png' },
    { id: 'atletico', name: 'Atlético de Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/78.png' },
    { id: 'dortmund', name: 'Borussia Dortmund', country: 'Alemania', logoUrl: 'https://crests.football-data.org/4.png' },
    { id: 'benfica', name: 'SL Benfica', country: 'Portugal', logoUrl: 'https://crests.football-data.org/1903.png' },
    { id: 'porto', name: 'FC Porto', country: 'Portugal', logoUrl: 'https://crests.football-data.org/503.png' },
    { id: 'ajax', name: 'Ajax Amsterdam', country: 'Países Bajos', logoUrl: 'https://crests.football-data.org/678.png' },
    { id: 'leverkusen', name: 'Bayer Leverkusen', country: 'Alemania', logoUrl: 'https://crests.football-data.org/3.png' },
    { id: 'napoli', name: 'SSC Napoli', country: 'Italia', logoUrl: 'https://crests.football-data.org/113.png' },
    { id: 'roma', name: 'AS Roma', country: 'Italia', logoUrl: 'https://crests.football-data.org/100.png' },
    { id: 'tottenham', name: 'Tottenham Hotspur', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/73.png' },
    { id: 'marseille', name: 'Olympique de Marsella', country: 'Francia', logoUrl: 'https://crests.football-data.org/516.png' },
    { id: 'sporting', name: 'Sporting CP', country: 'Portugal', logoUrl: 'https://crests.football-data.org/498.png' },
    { id: 'celtic', name: 'Celtic FC', country: 'Escocia', logoUrl: 'https://crests.football-data.org/373.png' }
];

export const COUNTRY_CATALOG = CHAMPIONS_LEAGUE_CLUBS;

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
