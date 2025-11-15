/**
 * Questo file definisce i dati multilingua per il sito, inclusi i testi dell'interfaccia e i progetti.
 */

const APP_DATA = {
    // Lingua Italiana
    it: {
        ui: {
            // Testi dell'interfaccia
            language_name: "Italiano",
            change_language_label: "Cambia lingua",
            doc_title: "Portfolio Software - simdlldev",
            main_title: "Applicazioni e Software repo",
            byline_prefix: "di",
            public_projects_header: "Progetti Pubblici",
            loading_public: "Caricamento contenuti...",
            private_projects_header: "Progetti Privati",
            login_prompt: "Inserisci il nome del progetto e la chiave di cifratura (password) per accedere ai progetti privati.",
            private_key_placeholder: "Chiave di accesso / Password",
            project_name_placeholder: "Nome Progetto",
            login_button: "Accedi ai progetti privati",
            login_button_loading: "Decifratura in corso...",
            login_success: "Contenuti privati caricati con successo!",
            footer_rights: "Tutti i diritti riservati.",
            // Testi per le card dei progetti (default)
            default_button_text: "Apri Progetto",
            private_default_button_text: "Visualizza Dettagli Riservati",
            // Testi per il popup About
            about_title: "Informazioni sullo sviluppatore",
            about_description: "Ciao! Sono uno studente appassionato di informatica, sviluppo software, cybersecurity, tecnologia, Linux e opensource. Lavoro con python, bash, sviluppo web e applicazioni Flutter. Questo sito è una vetrina dei miei progetti personali. Sentiti libero di esplorare il mio codice su GitHub.<br>Nella sezione progetti pubblici troverai alcune delle mie creazioni open-source, mentre i progetti privati sono accessibili solo ai collaboratori.<br>Contattami pure via email per qualsiasi domanda o collaborazione!",
            about_github_button: "Profilo GitHub",
            about_email_button: "Contattami via Email"
        },
        projects: [
            {
                id: 1,
                title: "DB-Docs",
                short_description: "Documentazione didattica sui Database relazionali e SQL.",
                description: "Impara come è strutturato un Database relazionale (modello E-R), le best-practice per progettarlo e come codificarlo con SQL.",
                tags: ["Database", "Documentazione", "SQL"],
                link: "https://simdlldev.github.io/DB-Docs/web/main.html",
                button_text: "Apri DB-Docs"
            },
            {
                id: 2,
                title: "SQL Lab",
                short_description: "Una piattaforma per esercitarsi su SQL.",
                description: "Metti in pratica le tue conoscenze di SQL e MySQL su SQL Lab! Scopri un ambiente interattivo e incentrato sulla didattica per imparare a usare SQL.",
                tags: ["SQL", "Lab", "MySQL"],
                link: "https://simdlldev.github.io/DB-Docs/web/sql-web-demo/main.html",
                button_text: "Apri SQL Lab"
            },
            {
                id: 3,
                title: "USB Security",
                short_description: "Una utility per la sicurezza USB compatibile con i sistemi Linux.",
                description: "Proteggi le tue porte USB da attacchi avanzati come BadUSB su sistemi Linux grazie a USB Security.",
                tags: ["USB", "Security", "Linux"],
                link: "https://github.com/simdlldev/USB_Security",
                button_text: "Scopri USB Security"
            }
        ]
    },
    // Lingua Inglese
    en: {
        ui: {
            // UI Texts
            language_name: "English",
            change_language_label: "Change language",
            doc_title: "Software Portfolio - simdlldev",
            main_title: "Applications and Software repos",
            byline_prefix: "by",
            public_projects_header: "Public Projects",
            loading_public: "Loading content...",
            private_projects_header: "Private Projects",
            login_prompt: "Enter the project name and the encryption key (password) to access private projects.",
            project_name_placeholder: "Project Name",
            private_key_placeholder: "Access Key / Password",
            login_button: "Access Private Projects",
            login_button_loading: "Decrypting...",
            login_success: "Private content loaded successfully!",
            footer_rights: "All rights reserved.",
            // Project card defaults
            default_button_text: "Open Project",
            private_default_button_text: "View Private Details",
            // About popup texts
            about_title: "About the Developer",
            about_description: "Hi! I'm a passionate student of computer science, software development, cybersecurity, technology, Linux, and open source. I work with Python, Bash, web development, and Flutter applications. This site is a showcase of my personal projects. Feel free to explore my code on GitHub.<br>In the public projects section, you'll find some of my open-source creations, while private projects are accessible only to collaborators.<br>Feel free to contact me via email for any questions or collaborations!",
            about_github_button: "GitHub Profile",
            about_email_button: "Contact via Email"
        },
        projects: [
            {
                id: 1,
                title: "DB-Docs",
                short_description: "Educational documentation on relational databases and SQL.",
                description: "Learn how a relational database is structured (E-R model), best practices for designing it, and how to code it with SQL.",
                tags: ["Database", "Documentation", "SQL"],
                link: "https://simdlldev.github.io/DB-Docs/web/main.html",
                button_text: "Open DB-Docs"
            },
            {
                id: 2,
                title: "SQL Lab",
                short_description: "A platform to practice SQL.",
                description: "Practice your SQL and MySQL knowledge on SQL Lab! Discover an interactive and education-focused environment to learn SQL.",
                tags: ["SQL", "Lab", "MySQL"],
                link: "https://simdlldev.github.io/DB-Docs/web/sql-web-demo/main.html",
                button_text: "Open SQL Lab"
            },
            {
                id: 3,
                title: "USB Security",
                short_description: "A USB security utility compatible with Linux systems.",
                description: "Protect your USB ports from advanced attacks like BadUSB on Linux systems with USB Security.",
                tags: ["USB", "Security", "Linux"],
                link: "https://github.com/simdlldev/USB_Security",
                button_text: "Discover USB Security"
            }
        ]
    }
};