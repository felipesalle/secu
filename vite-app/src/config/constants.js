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

// --- Paleta Oficial de Colores Euro Cotton (Colores del Catálogo Físico + Excel) ---
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
    { name: "Salmón", hex: "#FF6B6B", border: "#D94D4D", isLight: false },
    { name: "Oxford", hex: "#59626A", border: "#3E464D", isLight: false },
    { name: "Perry", hex: "#00738C", border: "#00576A", isLight: false },
    { name: "Menta", hex: "#A2E8DD", border: "#78C9BC", isLight: true },
    { name: "Hueso", hex: "#F5F2EB", border: "#D6D0C2", isLight: true },
    { name: "Vino", hex: "#6B1D2F", border: "#4D1321", isLight: false },
    { name: "Rosa", hex: "#FFB6C1", border: "#E0939E", isLight: true },
    { name: "Militar", hex: "#4B5320", border: "#393F18", isLight: false },
    { name: "Botella", hex: "#1E4D2B", border: "#13341C", isLight: false }
];

export const GILDAN_COLOR_PALETTE = EURO_COTTON_COLOR_PALETTE;

// --- Catálogo Oficial de Clubes de la UEFA Champions League / Secundaria ---
export const CHAMPIONS_LEAGUE_CLUBS = [
    { id: 'aek_atenas', name: 'AEK Atenas', country: 'Grecia', logoUrl: 'https://crests.football-data.org/1031.png', shirtColorName: 'Negro', shirtColorHex: '#1A1A1A' },
    { id: 'arsenal', name: 'Arsenal FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/57.png', shirtColorName: 'Jaspe', shirtColorHex: '#B5B7B9' },
    { id: 'aston_villa', name: 'Aston Villa', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/58.png', shirtColorName: 'Oxford', shirtColorHex: '#59626A' },
    { id: 'atletico', name: 'Atlético de Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/78.png', shirtColorName: 'Marino', shirtColorHex: '#001A4D' },
    { id: 'barcelona', name: 'FC Barcelona', country: 'España', logoUrl: 'https://crests.football-data.org/81.png', shirtColorName: 'Rey', shirtColorHex: '#0055D4' },
    { id: 'bayern', name: 'Bayern München', country: 'Alemania', logoUrl: 'https://crests.football-data.org/5.png', shirtColorName: 'Perry', shirtColorHex: '#00738C' },
    { id: 'dortmund', name: 'Borussia Dortmund', country: 'Alemania', logoUrl: 'https://crests.football-data.org/4.png', shirtColorName: 'Turquesa', shirtColorHex: '#00A3E0' },
    { id: 'como_1907', name: 'Como 1907', country: 'Italia', logoUrl: 'https://crests.football-data.org/1057.png', shirtColorName: 'Aqua', shirtColorHex: '#00B5AD' },
    { id: 'feyenoord', name: 'Feyenoord', country: 'Países Bajos', logoUrl: 'https://crests.football-data.org/675.png', shirtColorName: 'Menta', shirtColorHex: '#A2E8DD' },
    { id: 'galatasaray', name: 'Galatasaray', country: 'Turquía', logoUrl: 'https://crests.football-data.org/610.png', shirtColorName: 'Bandera', shirtColorHex: '#008037' },
    { id: 'inter', name: 'Inter de Milán', country: 'Italia', logoUrl: 'https://crests.football-data.org/108.png', shirtColorName: 'Hueso', shirtColorHex: '#F5F2EB' },
    { id: 'leipzig', name: 'RB Leipzig', country: 'Alemania', logoUrl: 'https://crests.football-data.org/721.png', shirtColorName: 'Canario', shirtColorHex: '#FFE600' },
    { id: 'lille', name: 'Lille OSC', country: 'Francia', logoUrl: 'https://crests.football-data.org/521.png', shirtColorName: 'Naranja', shirtColorHex: '#FF5500' },
    { id: 'liverpool', name: 'Liverpool FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/64.png', shirtColorName: 'Rojo', shirtColorHex: '#D50000' },
    { id: 'man_city', name: 'Manchester City', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/65.png', shirtColorName: 'Salmón', shirtColorHex: '#FF6B6B' },
    { id: 'man_utd', name: 'Manchester United', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/66.png', shirtColorName: 'Vino', shirtColorHex: '#6B1D2F' },
    { id: 'psg', name: 'Paris Saint-Germain', country: 'Francia', logoUrl: 'https://crests.football-data.org/524.png', shirtColorName: 'Rosa', shirtColorHex: '#FFB6C1' },
    { id: 'real_madrid', name: 'Real Madrid', country: 'España', logoUrl: 'https://crests.football-data.org/86.png', shirtColorName: 'Militar', shirtColorHex: '#4B5320' },
    { id: 'sporting', name: 'Sporting CP', country: 'Portugal', logoUrl: 'https://crests.football-data.org/498.png', shirtColorName: 'Cherry', shirtColorHex: '#8B0021' },
    { id: 'villarreal', name: 'Villarreal CF', country: 'España', logoUrl: 'https://crests.football-data.org/94.png', shirtColorName: 'Botella', shirtColorHex: '#1E4D2B' },
    { id: 'juventus', name: 'Juventus', country: 'Italia', logoUrl: 'https://crests.football-data.org/109.png', shirtColorName: 'Negro', shirtColorHex: '#1A1A1A' },
    { id: 'ac_milan', name: 'AC Milan', country: 'Italia', logoUrl: 'https://crests.football-data.org/98.png', shirtColorName: 'Cherry', shirtColorHex: '#8B0021' },
    { id: 'chelsea', name: 'Chelsea FC', country: 'Inglaterra', logoUrl: 'https://crests.football-data.org/61.png', shirtColorName: 'Rey', shirtColorHex: '#0055D4' },
    { id: 'porto', name: 'FC Porto', country: 'Portugal', logoUrl: 'https://crests.football-data.org/503.png', shirtColorName: 'Turquesa', shirtColorHex: '#00A3E0' }
];

export const COUNTRY_CATALOG = CHAMPIONS_LEAGUE_CLUBS;

// --- Dataset Oficial Extraído del Excel del Usuario (20 Equipos Reales, 160+ Alumnos con Grado y Grupo) ---
export const REAL_EXCEL_DATASET = [
    {
        leagueName: 'Grupos A Varonil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'AEK Atenas',
                logoUrl: 'https://crests.football-data.org/1031.png',
                shirtColorName: 'Negro',
                shirtColorHex: '#1A1A1A',
                players: [
                    { name: 'ROGER MORALES GONZALEZ', gradeGroup: '3A' },
                    { name: 'VICTOR HUGO ORRICO PEÑA', gradeGroup: '3A' },
                    { name: 'HECTOR ZEFERINO NANGO ALVAREZ', gradeGroup: '3A' },
                    { name: 'ALEJANDRO MELCHOR ROVIROSA', gradeGroup: '2A' },
                    { name: 'SANTIAGO DOMINGUEZ HERNANDEZ', gradeGroup: '2A' },
                    { name: 'MAXIMILIANO AGUILAR AGUILAR', gradeGroup: '1A' },
                    { name: 'JOSE EMILIANO ESPINOSA MORALES', gradeGroup: '1A' },
                    { name: 'IAN ALEXANDER FLORES TRUJILLO', gradeGroup: '1A' },
                    { name: 'MATIAS EMILIANO HERNANDEZ ESPINOSA', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Arsenal FC',
                logoUrl: 'https://crests.football-data.org/57.png',
                shirtColorName: 'Jaspe',
                shirtColorHex: '#B5B7B9',
                players: [
                    { name: 'SEBASTIAN ZENTENO TEJADA', gradeGroup: '3A' },
                    { name: 'JUAN PABLO ALVAREZ OCHOA', gradeGroup: '3A' },
                    { name: 'BASTIAN ALESSANDRO ACEVEDO BARRERA', gradeGroup: '3A' },
                    { name: 'ITHAN FREDERICK RUIZ VELASCO', gradeGroup: '2A' },
                    { name: 'LUIS ADRIAN ROSADO CRUZ', gradeGroup: '2A' },
                    { name: 'DIEGO ALBERTO JULIAN PIMENTEL', gradeGroup: '1A' },
                    { name: 'ALBERTO ZAMUDIO OLIVARES', gradeGroup: '1A' },
                    { name: 'EDUARDO ESQUINCA CHACON', gradeGroup: '1A' },
                    { name: 'NICOLAS BERNARDO LOPEZ SANCHEZ', gradeGroup: '1A' }
                ]
            },
            {
                name: 'FC Barcelona',
                logoUrl: 'https://crests.football-data.org/81.png',
                shirtColorName: 'Rey',
                shirtColorHex: '#0055D4',
                players: [
                    { name: 'SANTIAGO ROMAN SOLIS', gradeGroup: '3A' },
                    { name: 'SANTIAGO CRUZ DIAZ', gradeGroup: '3A' },
                    { name: 'LUIS FERNANDO FIGUEROA DUQUE DE ESTRADA', gradeGroup: '2A' },
                    { name: 'JORGE AGUSTIN PEREZ MARTINEZ', gradeGroup: '2A' },
                    { name: 'DEREK ALEXANDER DIAZ VAZQUEZ', gradeGroup: '2A' },
                    { name: 'GAEL PEREZ NARCIA', gradeGroup: '1A' },
                    { name: 'DIEGO LEON LOPEZ', gradeGroup: '1A' },
                    { name: 'AARON ROMERO VELAZQUEZ', gradeGroup: '1A' },
                    { name: 'LUIS RODRIGO MARTINEZ NAJERA', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Bayern München',
                logoUrl: 'https://crests.football-data.org/5.png',
                shirtColorName: 'Perry',
                shirtColorHex: '#00738C',
                players: [
                    { name: 'CARLOS IVAN GOMEZ HERNANDEZ', gradeGroup: '3A' },
                    { name: 'ANGEL DAVID OCHOA CRUZ', gradeGroup: '3A' },
                    { name: 'ALAN RODOLFO SANTOS ALBORES', gradeGroup: '2A' },
                    { name: 'JOSE EMILIO CRUZ LOPEZ', gradeGroup: '2A' },
                    { name: 'JORGE EMILIANO CHANONA LOPEZ', gradeGroup: '2A' },
                    { name: 'ALENDRO MORALES DIAZ', gradeGroup: '1A' },
                    { name: 'DANIEL MONTALVO MORALES', gradeGroup: '1A' },
                    { name: 'CESAR MAURICIO BERNARD HERNANDEZ', gradeGroup: '1A' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos A Femenil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Aston Villa',
                logoUrl: 'https://crests.football-data.org/58.png',
                shirtColorName: 'Oxford',
                shirtColorHex: '#59626A',
                players: [
                    { name: 'DASHA AIMEE SOLANO CARBALLO', gradeGroup: '3A' },
                    { name: 'MARIA ALEXANDRA PEREZ VASQUEZ', gradeGroup: '1A' },
                    { name: 'DIANE PEREZ ZARATE', gradeGroup: '2A' },
                    { name: 'CAROLINA DURAN', gradeGroup: '3A' },
                    { name: 'ANDREA MAHR CORZO', gradeGroup: '2A' },
                    { name: 'KEYLA PABLO PABLO', gradeGroup: '3A' },
                    { name: 'ABRIL ARANTXA ROBLEDO RUIZ', gradeGroup: '1A' },
                    { name: 'CELINA MARIA DOMINGUEZ RIZO', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Atlético de Madrid',
                logoUrl: 'https://crests.football-data.org/78.png',
                shirtColorName: 'Marino',
                shirtColorHex: '#001A4D',
                players: [
                    { name: 'NAHOMI MONSERRAT', gradeGroup: '3A' },
                    { name: 'ARIANA GALINDO GUZMAN', gradeGroup: '1A' },
                    { name: 'RENATA ATZIMBA VELASCO OROZCO', gradeGroup: '3A' },
                    { name: 'VALERIA MONSERRAT SOTO RUIZ', gradeGroup: '1A' },
                    { name: 'CAELI ESTEFANIA GARCIA RANGEL', gradeGroup: '2A' },
                    { name: 'MARIA FERNANDA GUTIERREZ GUTIERREZ', gradeGroup: '2A' },
                    { name: 'SOFIA ANZUREZ MATUS', gradeGroup: '2A' }
                ]
            },
            {
                name: 'Borussia Dortmund',
                logoUrl: 'https://crests.football-data.org/4.png',
                shirtColorName: 'Turquesa',
                shirtColorHex: '#00A3E0',
                players: [
                    { name: 'ANA GORETTI GONZALEZ HERNANDEZ', gradeGroup: '3A' },
                    { name: 'ANA PAOLA CACERES NANGUSE', gradeGroup: '3A' },
                    { name: 'RENATA TOVILLA RUIZ', gradeGroup: '2A' },
                    { name: 'GRECIA SOPHIA ORTIZ COUTIÑO', gradeGroup: '2A' },
                    { name: 'XIMENA ANALISSE DIAZ IBARRA', gradeGroup: '2A' },
                    { name: 'MARIA JOSE CLEMENTE HERNANDEZ', gradeGroup: '1A' },
                    { name: 'ITATI CONCEPCION SALTOS ALBORES', gradeGroup: '1A' },
                    { name: 'ABIGAEL SANCHEZ GAMBOA', gradeGroup: '3A' }
                ]
            },
            {
                name: 'Como 1907',
                logoUrl: 'https://crests.football-data.org/1057.png',
                shirtColorName: 'Aqua',
                shirtColorHex: '#00B5AD',
                players: [
                    { name: 'DOMINGUEZ RINCON CAROL', gradeGroup: '3A' },
                    { name: 'DANIELA GUADALUPE OCHOA GOMEZ', gradeGroup: '1A' },
                    { name: 'VIVIAN MONSERRAT LLAVEN MINA', gradeGroup: '1A' },
                    { name: 'ANDREA BERMUDEZ BURGOS', gradeGroup: '2A' },
                    { name: 'DENISE HALLY RIOS PARKER', gradeGroup: '1A' },
                    { name: 'ROMINA VIVIAN DOMINGUEZ LOPEZ', gradeGroup: '3A' },
                    { name: 'MARIA FERNANDA JIMENEZ AVENDAÑO', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Feyenoord',
                logoUrl: 'https://crests.football-data.org/675.png',
                shirtColorName: 'Menta',
                shirtColorHex: '#A2E8DD',
                players: [
                    { name: 'MARIA MAGDALENA ALVAREZ TIRADO', gradeGroup: '3A' },
                    { name: 'ISSABELA SOFIA BAUTISTA MONTOYA', gradeGroup: '3A' },
                    { name: 'VICTORIA ZARATE RAMIREZ', gradeGroup: '1A' },
                    { name: 'ANA PAULA PEREZ SAMAYOA', gradeGroup: '1A' },
                    { name: 'ALEXANDRA ISABELLA RODRIGUEZ RAMIREZ', gradeGroup: '2A' },
                    { name: 'ALEXA VALENTINA MAGDALENO ROMAN', gradeGroup: '2A' },
                    { name: 'ROSA KAMILA SANCHO ESTRADA', gradeGroup: '3A' }
                ]
            },
            {
                name: 'Galatasaray',
                logoUrl: 'https://crests.football-data.org/610.png',
                shirtColorName: 'Bandera',
                shirtColorHex: '#008037',
                players: [
                    { name: 'SOFIA VICTORIA CAPETILLO ESPINOSA', gradeGroup: '3A' },
                    { name: 'NASHMA NICOLE AGUIRRE CHAVEZ', gradeGroup: '3A' },
                    { name: 'KARIME MAITE CHACON FARRERA', gradeGroup: '1A' },
                    { name: 'ANA LUCIA CONTRERAS GARCIA', gradeGroup: '1A' },
                    { name: 'KIMBERLY YATZIRI LOPEZ ZARAZUA', gradeGroup: '2A' },
                    { name: 'VALERIA ARANDA VALENZUELA', gradeGroup: '2A' },
                    { name: 'GRETTEL RODRIGUEZ', gradeGroup: '3A' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos B Varonil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Inter de Milán',
                logoUrl: 'https://crests.football-data.org/108.png',
                shirtColorName: 'Hueso',
                shirtColorHex: '#F5F2EB',
                players: [
                    { name: 'VICTOR MANUEL MAGDALENO AGUILAR', gradeGroup: '3B' },
                    { name: 'CRISTOPHER PEREZ VASQUEZ', gradeGroup: '3B' },
                    { name: 'YAMIL ARTURO CASTILLO CHAGOYA', gradeGroup: '2B' },
                    { name: 'PATRICIO RAMOS CAMPOS', gradeGroup: '2B' },
                    { name: 'IKER PEREZ MOLINA', gradeGroup: '1B' },
                    { name: 'MIGUEL ANIBAL MORALES SUAREZ', gradeGroup: '1B' },
                    { name: 'LEONARDO GAEL JIMENEZ VENTURA', gradeGroup: '1B' },
                    { name: 'MATEO HERNANDEZ PONCE', gradeGroup: '1B' }
                ]
            },
            {
                name: 'RB Leipzig',
                logoUrl: 'https://crests.football-data.org/721.png',
                shirtColorName: 'Canario',
                shirtColorHex: '#FFE600',
                players: [
                    { name: 'JOSE JACOB MOLINA GUILLEN', gradeGroup: '3B' },
                    { name: 'GABRIEL CONDE MONTEJO', gradeGroup: '3B' },
                    { name: 'FERNANDO MORALES DIAZ', gradeGroup: '2B' },
                    { name: 'JOSE MATIAS ESPINOSA SANCHEZ', gradeGroup: '2B' },
                    { name: 'MATIAS RUIZ MALO', gradeGroup: '2B' },
                    { name: 'GIBRAN ROMERO VELAZQUEZ', gradeGroup: '1B' },
                    { name: 'ERICK DELGADO ZENTENO', gradeGroup: '1B' },
                    { name: 'KENNETH ALEJANRO MUÑOZ NARCIA', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Manchester City',
                logoUrl: 'https://crests.football-data.org/65.png',
                shirtColorName: 'Salmón',
                shirtColorHex: '#FF6B6B',
                players: [
                    { name: 'SANTIAGO DIAZ GASTELUM', gradeGroup: '3B' },
                    { name: 'DANIEL MIGUEL GONZALEZ VARGAS', gradeGroup: '3B' },
                    { name: 'IVAN GORDILLO BALBUENA', gradeGroup: '3B' },
                    { name: 'LEONARDO TOPKE GORDILLO', gradeGroup: '2B' },
                    { name: 'MIGUEL ALFONSO PANIAGUA CASTELLANOS', gradeGroup: '2B' },
                    { name: 'JUAN PABLO DOMINGUEZ DAHMLOW', gradeGroup: '1B' },
                    { name: 'JUAN JOSE MOTA VELAZQUEZ', gradeGroup: '1B' },
                    { name: 'JOSE MIGUEL ORRICO PEÑA', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Manchester United',
                logoUrl: 'https://crests.football-data.org/66.png',
                shirtColorName: 'Vino',
                shirtColorHex: '#6B1D2F',
                players: [
                    { name: 'JOSE ALEJANDRO ORANTES DUARTE', gradeGroup: '3B' },
                    { name: 'JORGE ANTONIO CASTORENA LOPEZ', gradeGroup: '3B' },
                    { name: 'MATEO VALENCIA MARTINEZ', gradeGroup: '3B' },
                    { name: 'RODRIGO VAZQUEZ CUESTA', gradeGroup: '2B' },
                    { name: 'AXEL KAMIL GUTIERREZ ORDOÑEZ', gradeGroup: '2B' },
                    { name: 'DAVID ALEXANDER ALEGRIA VAZQUEZ', gradeGroup: '1B' },
                    { name: 'DAVID ZUÑIGA GRAJALES', gradeGroup: '1B' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos B Femenil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Lille OSC',
                logoUrl: 'https://crests.football-data.org/521.png',
                shirtColorName: 'Naranja',
                shirtColorHex: '#FF5500',
                players: [
                    { name: 'CONSTANZA CASTILLEJOS MORENO', gradeGroup: '3B' },
                    { name: 'TAHIRA JIMENEZ PATJANE', gradeGroup: '2B' },
                    { name: 'CAROLINA CHANONA MOLINA', gradeGroup: '2B' },
                    { name: 'LUNA MAYTE MARTINEZ COELLO', gradeGroup: '2B' },
                    { name: 'MARIA FERNANDA PALAFOX GUTIERREZ', gradeGroup: '3B' },
                    { name: 'STHEFANI GUILLEN COUTIÑO', gradeGroup: '1B' },
                    { name: 'KEYLIN GONZALEZ ALVARADO', gradeGroup: '1B' },
                    { name: 'XIMENA YONG MAZA', gradeGroup: '1B' },
                    { name: 'VANESSA BAUTISTA OLMOS', gradeGroup: '3B' },
                    { name: 'VANESSA ALVARADO LOZANO', gradeGroup: '3B' }
                ]
            },
            {
                name: 'Liverpool FC',
                logoUrl: 'https://crests.football-data.org/64.png',
                shirtColorName: 'Rojo',
                shirtColorHex: '#D50000',
                players: [
                    { name: 'DANNA SOFIA PASCACIO GARCIA', gradeGroup: '3B' },
                    { name: 'RENATA ESQUINCA NIVON', gradeGroup: '3B' },
                    { name: 'VALENTINA GORDILLO BALBUENA', gradeGroup: '1B' },
                    { name: 'ISABELLA ZARATE PIMENTEL', gradeGroup: '1B' },
                    { name: 'VICTORIA MALO AQUINO', gradeGroup: '1B' },
                    { name: 'MARIANA MENDOZA LOPEZ', gradeGroup: '3B' },
                    { name: 'SOPHIA NUÑEZ PEREZ', gradeGroup: '2B' },
                    { name: 'ROMINA JIMENEZ NANGO', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Paris Saint-Germain',
                logoUrl: 'https://crests.football-data.org/524.png',
                shirtColorName: 'Rosa',
                shirtColorHex: '#FFB6C1',
                players: [
                    { name: 'MIRANDA GORDILLO JUAREZ', gradeGroup: '3B' },
                    { name: 'CAMILA ESPINOSA URIBE', gradeGroup: '3B' },
                    { name: 'AMAYA MORA JIMENEZ', gradeGroup: '1B' },
                    { name: 'GENESIS ROSE DIAZ BULADACO', gradeGroup: '1B' },
                    { name: 'SABINA MORALES NUÑEZ', gradeGroup: '1B' },
                    { name: 'CAMILA ALEXA GALINDO ESCOBAR', gradeGroup: '1B' },
                    { name: 'VALENTINA ABARCA FLORES', gradeGroup: '2B' },
                    { name: 'GRETHEL VALDEZ JIMENEZ', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Real Madrid',
                logoUrl: 'https://crests.football-data.org/86.png',
                shirtColorName: 'Militar',
                shirtColorHex: '#4B5320',
                players: [
                    { name: 'CAMILA RUBI ESPINOSA MORALES', gradeGroup: '3B' },
                    { name: 'MARIA FENANDA GARCIA GARCIA', gradeGroup: '3B' },
                    { name: 'GUADALUPE SANCHEZ LAPARRA', gradeGroup: '1B' },
                    { name: 'ISABELLA ANZA TRUJILLO', gradeGroup: '1B' },
                    { name: 'MARIA JOSE NARCIA NUCAMENDI', gradeGroup: '1B' },
                    { name: 'IVANNA MARTINEZ LOPEZ', gradeGroup: '2B' },
                    { name: 'MONSERRAT DOMINGUEZ', gradeGroup: '1B' },
                    { name: 'DIANA VALENTINA MORALES GUTIERREZ', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Sporting CP',
                logoUrl: 'https://crests.football-data.org/498.png',
                shirtColorName: 'Cherry',
                shirtColorHex: '#8B0021',
                players: [
                    { name: 'MELISSA ROMERO VELASQUEZ', gradeGroup: '3B' },
                    { name: 'KARLA MARIA ZUART RODRIGUEZ', gradeGroup: '3B' },
                    { name: 'ELENA MARGARITA SANCHEZ SANCHEZ', gradeGroup: '3B' },
                    { name: 'FATIMA LILIANA ORTIZ RUIZ', gradeGroup: '2B' },
                    { name: 'RENATA LOPEZ AQUIAHUATL', gradeGroup: '2B' },
                    { name: 'MARIA JOSE ESPINOSA MONTES', gradeGroup: '1B' },
                    { name: 'XIMENA FONSECA TOLEDO', gradeGroup: '1B' },
                    { name: 'GRETTEL SOLIS AGUILAR', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Villarreal CF',
                logoUrl: 'https://crests.football-data.org/94.png',
                shirtColorName: 'Botella',
                shirtColorHex: '#1E4D2B',
                players: [
                    { name: 'HAMMIA GONZALEZ AKVARADO', gradeGroup: '3B' },
                    { name: 'CERSEI ADRIANAN RODRIGUEZ ESPINOSA', gradeGroup: '2B' },
                    { name: 'MARIA FOX AGUILAR', gradeGroup: '1B' },
                    { name: 'XIMENA RIVERA GALVAN', gradeGroup: '1B' },
                    { name: 'ALEXA ZOE COELLO LARA', gradeGroup: '3B' },
                    { name: 'EMILY SOPHIA JIMENEZ ESTRADA', gradeGroup: '2B' },
                    { name: 'NAOMI HISSEL NUCAMENDI PINEDA', gradeGroup: '1B' },
                    { name: 'ZOE GUADALUPE MORALES MEZA', gradeGroup: '3B' }
                ]
            }
        ]
    }
];

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
        if (teamNameLower.includes('aek')) candidateColorName = 'Negro';
        else if (teamNameLower.includes('arsenal')) candidateColorName = 'Jaspe';
        else if (teamNameLower.includes('aston villa')) candidateColorName = 'Oxford';
        else if (teamNameLower.includes('atlético') || teamNameLower.includes('atletico')) candidateColorName = 'Marino';
        else if (teamNameLower.includes('barcelona') || teamNameLower.includes('barça')) candidateColorName = 'Rey';
        else if (teamNameLower.includes('bayern') || teamNameLower.includes('munich')) candidateColorName = 'Perry';
        else if (teamNameLower.includes('dortmund') || teamNameLower.includes('borussia')) candidateColorName = 'Turquesa';
        else if (teamNameLower.includes('como')) candidateColorName = 'Aqua';
        else if (teamNameLower.includes('feyenoord')) candidateColorName = 'Menta';
        else if (teamNameLower.includes('galatasaray')) candidateColorName = 'Bandera';
        else if (teamNameLower.includes('inter')) candidateColorName = 'Hueso';
        else if (teamNameLower.includes('leipzig')) candidateColorName = 'Canario';
        else if (teamNameLower.includes('lille')) candidateColorName = 'Naranja';
        else if (teamNameLower.includes('liverpool')) candidateColorName = 'Rojo';
        else if (teamNameLower.includes('manchester city') || teamNameLower.includes('city')) candidateColorName = 'Salmón';
        else if (teamNameLower.includes('manchester united')) candidateColorName = 'Vino';
        else if (teamNameLower.includes('psg') || teamNameLower.includes('paris')) candidateColorName = 'Rosa';
        else if (teamNameLower.includes('real madrid') || teamNameLower.includes('madrid')) candidateColorName = 'Militar';
        else if (teamNameLower.includes('sporting')) candidateColorName = 'Cherry';
        else if (teamNameLower.includes('villarreal') || teamNameLower.includes('villareal')) candidateColorName = 'Botella';
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

// --- Helper para Parsear Alumnos con Nombre, Apellidos, Grado y Grupo ---
export const parsePlayerInputLine = (line) => {
    if (!line || !line.trim()) return null;
    const raw = line.trim();

    // 1. Si el usuario usó coma (ej: "Juan Pablo Aguirre Marti, 3 A" o "Juan Pablo Aguirre Marti, 3A")
    if (raw.includes(',')) {
        const parts = raw.split(',');
        const name = parts[0].trim();
        const rawGroup = parts.slice(1).join(',').trim();
        const gradeGroup = rawGroup.replace(/[\sº°\-_]/g, '').toUpperCase();
        return { name, gradeGroup };
    }

    // 2. Coincidencia por regex al final de la línea para patrones como "3 A", "3A", "1B", "2-A", "3ºA"
    const match = raw.match(/^(.*?)\s+([1-3][\sº°\-_]*[A-Fa-f])$/i);
    if (match) {
        const name = match[1].trim();
        const gradeGroup = match[2].replace(/[\sº°\-_]/g, '').toUpperCase();
        return { name, gradeGroup };
    }

    // 3. Fallback: sin grado/grupo detectado
    return { name: raw, gradeGroup: '' };
};

export const parseMultiLinePlayerInput = (text) => {
    if (!text) return [];
    const lines = text.split(/\r?\n/);
    return lines.map(line => parsePlayerInputLine(line)).filter(Boolean);
};

