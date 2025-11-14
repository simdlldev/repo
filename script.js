// Variabili globali per l'API Key e l'URL (lasciate vuote come richiesto)
const apiKey = ""; 
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// VARIABILI PER LA SEZIONE PRIVATA
const FIXED_SALT = new TextEncoder().encode("YourFixedSaltForProject");

// --- GESTIONE MULTILINGUA ---

let currentLanguage = 'it'; // Lingua di default

/**
 * Restituisce i dati per la lingua corrente con fallback all'inglese.
 * @param {'ui' | 'projects'} type - Il tipo di dati da ottenere.
 * @returns {Object | Array}
 */
function getTranslatedData(type) {
    const lang = currentLanguage;
    // Se la lingua corrente ha i dati, usali
    if (APP_DATA[lang] && APP_DATA[lang][type]) {
        return APP_DATA[lang][type];
    }
    // Altrimenti, usa l'inglese come fallback
    if (APP_DATA.en && APP_DATA.en[type]) {
        return APP_DATA.en[type];
    }
    // Come ultima risorsa, restituisci un oggetto/array vuoto per evitare errori
    return type === 'ui' ? {} : [];
}

/**
 * Aggiorna tutti i testi dell'interfaccia utente in base alla lingua corrente.
 */
function updateUIText() {
    const uiTexts = getTranslatedData('ui');
    
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        if (uiTexts[key]) {
            el.innerHTML = uiTexts[key];
        }
    });

    document.querySelectorAll('[data-translate-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-key-placeholder');
        if (uiTexts[key]) {
            el.placeholder = uiTexts[key];
        }
    });

    if (uiTexts.doc_title) {
        document.title = uiTexts.doc_title;
    }

    // Calcola e imposta la larghezza dinamica per il pulsante della lingua
    const langButton = document.getElementById('language-button');
    const langLabel = document.getElementById('language-label');
    if (langButton && langLabel) {
        // Misura la larghezza del testo dell'etichetta
        const textWidth = langLabel.scrollWidth;
        
        // Calcola la larghezza totale: padding iniziale (16px) + larghezza icona (24px) + margine (8px) + larghezza testo + padding finale (16px)
        const hoverWidth = 16 + 24 + 8 + textWidth + 8; 
        
        langButton.style.setProperty('--hover-width', `${hoverWidth}px`);
    }
}

/**
 * Imposta la lingua del sito, aggiorna l'interfaccia e salva la preferenza.
 * @param {string} lang - Codice della lingua (es. 'it', 'en').
 */
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Aggiorna l'attributo lang del tag <html> per l'accessibilità
    document.documentElement.lang = lang;

    // Aggiorna l'UI e i progetti
    updateUIText();
    displayPublicProjects();

    // Aggiorna lo stato attivo nel dropdown
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.querySelectorAll('a[data-lang]').forEach(el => {
            el.classList.remove('active');
            if (el.getAttribute('data-lang') === lang) {
                el.classList.add('active');
            }
        });
    }
}


// --- Funzioni Utilità ---

/**
 * Converte una stringa base64 in Uint8Array.
 * @param {string} base64
 * @returns {Uint8Array}
 */
function base64ToArrayBuffer(base64) {
    const safeBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    const binary_string = window.atob(safeBase64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

/**
 * Crea la card HTML per un progetto.
 * @param {Object} project
 * @param {boolean} isPrivate - Indica se la card è per un progetto privato.
 * @returns {string}
 */
function createProjectCard(project, isPrivate = false) {
    const uiTexts = getTranslatedData('ui');
    const shortDescription = project.short_description || project.description;
    
    const defaultButtonText = isPrivate ? uiTexts.private_default_button_text : uiTexts.default_button_text;
    const buttonText = project.button_text || defaultButtonText;
    
    const tagsHtml = project.tags.map(tag => 
        `<span class="inline-block ${isPrivate ? 'bg-pink-900/50 text-pink-300' : 'bg-violet-900/50 text-violet-300'} text-xs font-semibold px-3 py-1 rounded-full">${tag}</span>`
    ).join('');

    return `
        <div id="card-box" class="glass-card p-6 rounded-xl flex flex-col justify-between anim-fade-in-up">
            <div>
                <h3 class="text-xl font-rounded font-bold mb-2 ${isPrivate ? 'text-pink-300' : 'text-violet-300'}">${project.title}</h3>
                <p class="text-gray-400 text-sm mb-3">${shortDescription}</p>
                <p class="text-gray-100 mb-4">${project.description}</p>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
                ${tagsHtml}
            </div>
            <a href="${project.link}" target="_blank" class="text-sm font-semibold ${isPrivate ? 'text-pink-400 hover:text-pink-300' : 'text-violet-400 hover:text-violet-300'} transition">
                ${buttonText} &rarr;
            </a>
        </div>
    `;
}

/**
 * Deriva la chiave di cifratura dal password.
 * @param {string} password
 * @returns {Promise<CryptoKey>}
 */
async function deriveKey(password) {
    const passwordKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: FIXED_SALT, iterations: 100000, hash: "SHA-256" },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
    );
}

/**
 * Tenta di decifrare i dati privati per un progetto specifico.
 * @param {string} projectName
 * @param {string} privateKey
 */
async function decryptData(projectName, privateKey) {
    const messageEl = document.getElementById('login-message');
    const loginButton = document.getElementById('login-button');
    const uiTexts = getTranslatedData('ui');

    messageEl.classList.add('hidden');
    loginButton.disabled = true;
    loginButton.textContent = uiTexts.login_button_loading || 'Decrypting...';

    try {
        const encryptedDataUrl = `${projectName}.bin`;
        const resp = await fetch(encryptedDataUrl, { cache: "no-cache" });
        if (!resp.ok) {
            if (resp.status === 404) {
                throw new Error(`Project '${projectName}' not found.`);
            }
            throw new Error(`Failed to load encrypted file (${resp.status})`);
        }
        
        const fileBuffer = await resp.arrayBuffer();
        const fileBytes = new Uint8Array(fileBuffer);
        if (fileBytes.byteLength <= 32) { // IV (16) + Auth Tag (16)
            throw new Error("Encrypted file is too short.");
        }

        const iv = fileBytes.slice(0, 16);
        const encryptedDataWithTag = fileBytes.slice(16);

        const derivedKey = await deriveKey(privateKey);
        const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, derivedKey, encryptedDataWithTag);
        const decryptedJson = new TextDecoder().decode(decryptedBuffer);

        let privateProjects;
        try {
            privateProjects = JSON.parse(decryptedJson);
        } catch (jsonError) {
            throw new Error("Failed to parse decrypted data: " + jsonError.message);
        }

        if (!Array.isArray(privateProjects)) {
            throw new Error("Decrypted data is not a valid project array.");
        }

        displayPrivateProjects(privateProjects);
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('private-content-container').classList.remove('hidden');

    } catch (error) {
        console.error("Decryption error:", error);
        const isAuthError = error && (error.name === 'OperationError' || /tag/.test(error.message));
        messageEl.textContent = isAuthError ? (uiTexts.login_error_auth || "Invalid key or corrupted data.") : (error.message || (uiTexts.login_error_generic || "An unknown error occurred."));
        messageEl.classList.remove('hidden');
        loginButton.disabled = false;
        loginButton.textContent = uiTexts.login_button || 'Access Private Projects';
    }
}

// --- Funzioni di Visualizzazione ---



/**

 * Applica un'animazione d'ingresso scaglionata agli elementi.

 * @param {string} selector - Il selettore CSS per gli elementi da animare.

 * @param {number} staggerMs - Il ritardo in millisecondi tra ogni animazione.

 */

function animateElements(selector, staggerMs = 50) {

    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) return;



    elements.forEach((el, i) => {

        el.style.transitionDelay = `${i * staggerMs}ms`;

    });



    // Aggiunge la classe di visibilità dopo un breve ritardo

    setTimeout(() => {

        elements.forEach(el => {

            el.classList.add('is-visible');

        });

    }, 50);



    // Calcola la durata massima dell'animazione per sapere quando rimuovere i ritardi

    // Durata della transizione più lunga (da CSS, es. opacity 0.6s) + ritardo dell'ultimo elemento

    const animationDuration = 600; // Corrisponde a 0.6s

    const maxDelay = (elements.length - 1) * staggerMs;

    const totalDuration = maxDelay + animationDuration;



    // Rimuovi il transition-delay dopo che tutte le animazioni sono terminate

    setTimeout(() => {

        elements.forEach(el => {

            el.style.transitionDelay = null;

        });

    }, totalDuration);

}





/**

 * Visualizza i progetti pubblici in base alla lingua corrente.
 */
function displayPublicProjects() {
    const projects = getTranslatedData('projects');
    const loadingEl = document.getElementById('loading-public');
    const container = document.getElementById('public-content-container');

    if (loadingEl) loadingEl.classList.add('hidden');

    if (!projects || projects.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500">No public projects found for the selected language.</p>`;
        return;
    }

    container.innerHTML = projects.map(p => createProjectCard(p, false)).join('');
    animateElements('#public-content-container .glass-card');
}

/**
 * Visualizza i progetti privati dopo la decifratura.
 * @param {Array<Object>} projects
 */
function displayPrivateProjects(projects) {
    const container = document.getElementById('private-content-container');
    if (projects.length === 0) {
         container.innerHTML = '<p class="col-span-full text-center text-gray-400">Nessun progetto privato trovato.</p>';
         return;
    }
    container.innerHTML = projects.map(p => createProjectCard(p, true)).join('');

    animateElements('#private-content-container .glass-card');

}



// --- Inizializzazione e Event Listeners ---



/**

 * Popola dinamicamente il menu a tendina delle lingue.

 */

function populateLanguageDropdown() {

    const dropdown = document.getElementById('language-dropdown');

    if (!dropdown) return;



    const languages = Object.keys(APP_DATA);

    dropdown.innerHTML = languages.map(lang => {

        const langName = APP_DATA[lang].ui.language_name || lang.toUpperCase();

        return `<a href="#" data-lang="${lang}">${langName}</a>`;

    }).join('');



    // Aggiungi event listener ai nuovi elementi

    dropdown.querySelectorAll('a[data-lang]').forEach(el => {

        el.addEventListener('click', (e) => {

            e.preventDefault();

            const selectedLang = el.getAttribute('data-lang');

            setLanguage(selectedLang);

            dropdown.classList.remove('show'); // Chiudi il menu dopo la selezione

        });

    });

}





document.addEventListener('DOMContentLoaded', () => {

    // Imposta la lingua iniziale

    const savedLang = localStorage.getItem('preferredLanguage');

    const browserLang = navigator.language.split('-')[0];

    const initialLang = savedLang || (APP_DATA[browserLang] ? browserLang : 'en');

    

    // Popola il menu a tendina e imposta la lingua (che chiamerà displayPublicProjects)

    populateLanguageDropdown();

    setLanguage(initialLang);



    // Anima gli elementi statici della pagina

    animateElements('.anim-slide-in-left, .anim-fade-in-up', 150);



    // Gestione del menu a tendina

    const langButton = document.getElementById('language-button');

    const langDropdown = document.getElementById('language-dropdown');



    langButton.addEventListener('click', (e) => {

        e.stopPropagation(); // Impedisce al click di raggiungere subito il window listener

        langDropdown.classList.toggle('show');

    });



    // Chiudi il menu se si clicca altrove

    window.addEventListener('click', () => {

        if (langDropdown.classList.contains('show')) {

            langDropdown.classList.remove('show');

        }

    });



    // Aggiungi listener per il login
    const loginButton = document.getElementById('login-button');
    const projectNameInput = document.getElementById('project-name');
    const privateKeyInput = document.getElementById('private-key');

    const handleLogin = () => {
        const projectName = projectNameInput.value.trim();
        const key = privateKeyInput.value.trim();
        const messageEl = document.getElementById('login-message');

        if (projectName && key) {
            decryptData(projectName, key);
        } else {
            messageEl.textContent = uiTexts.login_error_missing_fields || "Please enter both Project Name and Access Key.";
            messageEl.classList.remove('hidden');
        }
    };

    loginButton.addEventListener('click', handleLogin);

    projectNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });

    privateKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });

    // Imposta l'anno corrente nel footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Gestione Popup About ---
    const aboutTrigger = document.getElementById('about-trigger');
    const aboutOverlay = document.getElementById('about-overlay');
    const aboutCloseButton = document.getElementById('about-close-button');

    if (aboutTrigger && aboutOverlay && aboutCloseButton) {
        aboutTrigger.addEventListener('click', () => {
            aboutOverlay.classList.remove('is-closed');
        });

        aboutCloseButton.addEventListener('click', () => {
            aboutOverlay.classList.add('is-closed');
        });

        aboutOverlay.addEventListener('click', (e) => {
            // Chiudi solo se si clicca sull'overlay e non sul popup stesso
            if (e.target === aboutOverlay) {
                aboutOverlay.classList.add('is-closed');
            }
        });
    }
});