document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       SHETIMITRA DASHBOARD.JS
       ========================================================= */

    /* ---------------------------------------------------------
       ELEMENTS
    --------------------------------------------------------- */

    const body = document.body;

    const pageLoader = document.getElementById("pageLoader");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileNav =
        document.getElementById("mobileNav");

    const notificationButton =
        document.getElementById("notificationButton");

    const profileButton =
        document.getElementById("profileButton");

    const languageSelector =
        document.getElementById("languageSelector");

    const cameraModal =
        document.getElementById("cameraModal");

    const cameraVideo =
        document.getElementById("cameraVideo");

    const cameraCanvas =
        document.getElementById("cameraCanvas");

    const cameraMessage =
        document.getElementById("cameraMessage");

    const closeCamera =
        document.getElementById("closeCamera");

    const closeCameraBottom =
        document.getElementById("closeCameraBottom");

    const switchCameraButton =
        document.getElementById("switchCameraButton");

    const captureButton =
        document.getElementById("captureButton");

    const capturedArea =
        document.getElementById("capturedArea");

    const capturedImage =
        document.getElementById("capturedImage");

    const analyseButton =
        document.getElementById("analyseButton");

    const toast =
        document.getElementById("toast");

    const toastIcon =
        document.getElementById("toastIcon");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");


    /* ---------------------------------------------------------
       PAGE LOADER
    --------------------------------------------------------- */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("hidden");
                pageLoader.style.display = "none";
            }

        }, 400);

    });


    /* ---------------------------------------------------------
       TOAST SYSTEM
    --------------------------------------------------------- */

    let toastTimer;

    function showToast(title, message, icon = "✓") {

        if (!toast) return;

        clearTimeout(toastTimer);

        toastIcon.textContent = icon;
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add("active");

        toastTimer = setTimeout(() => {
            toast.classList.remove("active");
        }, 3200);
    }


    /* ---------------------------------------------------------
       MOBILE MENU
    --------------------------------------------------------- */

    if (mobileMenuButton && mobileNav) {

        mobileMenuButton.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.toggle("active");

            mobileMenuButton.textContent =
                isOpen ? "×" : "☰";

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    }


    /* Close mobile menu after clicking a link */

    document
        .querySelectorAll(".mobile-nav a")
        .forEach(link => {

            link.addEventListener("click", () => {

                mobileNav?.classList.remove("active");

                if (mobileMenuButton) {
                    mobileMenuButton.textContent = "☰";
                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

        });


    /* ---------------------------------------------------------
       NAVBAR SCROLL EFFECT
    --------------------------------------------------------- */

    const navbar =
        document.querySelector(".navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    updateNavbar();


    /* ---------------------------------------------------------
       ACTIVE NAVIGATION
    --------------------------------------------------------- */

    const navLinks =
        document.querySelectorAll(
            ".desktop-nav .nav-link, .mobile-nav .nav-link"
        );

    const sections = [
        document.getElementById("home"),
        document.getElementById("scan"),
        document.getElementById("crops"),
        document.getElementById("monitoring"),
        document.getElementById("history")
    ].filter(Boolean);


    function setActiveSection(id) {

        navLinks.forEach(link => {

            const href =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${id}`
            );

        });

    }


    if ("IntersectionObserver" in window) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {
                            setActiveSection(entry.target.id);
                        }

                    });

                },
                {
                    root: null,
                    threshold: 0.25,
                    rootMargin: "-90px 0px -45% 0px"
                }
            );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* ---------------------------------------------------------
       CAMERA SYSTEM
    --------------------------------------------------------- */

    let cameraStream = null;

    let currentFacingMode = "user";


    function setCameraMessage(message) {

        if (cameraMessage) {
            cameraMessage.textContent = message;
        }

    }


    async function startCamera() {

        if (!cameraVideo) return;

        try {

            if (!navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia) {

                setCameraMessage(
                    "Camera is not supported by this browser."
                );

                showToast(
                    "Camera unavailable",
                    "Your browser does not support camera access.",
                    "!"
                );

                return;
            }


            /* Stop previous stream */

            stopCamera();


            setCameraMessage(
                "Starting camera..."
            );


            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: currentFacingMode,
                        width: {
                            ideal: 1280
                        },
                        height: {
                            ideal: 720
                        }
                    },
                    audio: false
                });


            cameraVideo.srcObject =
                cameraStream;


            await cameraVideo.play();


            setCameraMessage(
                "Position the crop clearly inside the frame."
            );


        } catch (error) {

            console.error(
                "Camera error:",
                error
            );

            setCameraMessage(
                "Camera permission was not available."
            );

            showToast(
                "Camera access needed",
                "Please allow camera permission and try again.",
                "!"
            );

        }

    }


    function stopCamera() {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(track => track.stop());

            cameraStream = null;

        }

        if (cameraVideo) {
            cameraVideo.srcObject = null;
        }

    }


    function openCamera() {

        if (!cameraModal) return;

        cameraModal.classList.add("active");

        cameraModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";


        /* Reset previous capture */

        if (capturedArea) {
            capturedArea.classList.remove("active");
        }

        if (capturedImage) {
            capturedImage.src = "";
        }


        startCamera();

    }


    function closeCameraModal() {

        if (!cameraModal) return;

        cameraModal.classList.remove("active");

        cameraModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        stopCamera();

    }


    /* Open camera from all scan buttons */

    const scanButtons = [

        document.getElementById("heroScanButton"),

        document.getElementById("promoScanButton"),

        document.getElementById("finalScanButton")

    ].filter(Boolean);


    scanButtons.forEach(button => {

        button.addEventListener(
            "click",
            openCamera
        );

    });


    /* Close camera */

    closeCamera?.addEventListener(
        "click",
        closeCameraModal
    );

    closeCameraBottom?.addEventListener(
        "click",
        closeCameraModal
    );


    /* Click backdrop to close */

    document
        .querySelector(".camera-backdrop")
        ?.addEventListener(
            "click",
            closeCameraModal
        );


    /* ESC key */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                cameraModal?.classList.contains("active")
            ) {

                closeCameraModal();

            }

        }
    );


    /* ---------------------------------------------------------
       SWITCH CAMERA
    --------------------------------------------------------- */

    switchCameraButton?.addEventListener(
        "click",
        async () => {

            currentFacingMode =
                currentFacingMode === "environment"
                    ? "user"
                    : "environment";


            setCameraMessage(
                "Switching camera..."
            );

            await startCamera();

        }
    );


    /* ---------------------------------------------------------
       CAPTURE PHOTO
    --------------------------------------------------------- */

    captureButton?.addEventListener(
        "click",
        () => {

            if (!cameraVideo ||
                !cameraCanvas) return;


            if (
                !cameraStream ||
                cameraVideo.readyState < 2
            ) {

                showToast(
                    "Camera not ready",
                    "Please wait for the camera preview.",
                    "!"
                );

                return;

            }


            const width =
                cameraVideo.videoWidth;

            const height =
                cameraVideo.videoHeight;


            if (!width || !height) {

                showToast(
                    "Capture failed",
                    "The camera image is not ready yet.",
                    "!"
                );

                return;

            }


            cameraCanvas.width = width;
            cameraCanvas.height = height;


            const context =
                cameraCanvas.getContext("2d");


            context.drawImage(
                cameraVideo,
                0,
                0,
                width,
                height
            );


            const imageData =
                cameraCanvas.toDataURL(
                    "image/jpeg",
                    0.9
                );


            capturedImage.src =
                imageData;


            capturedArea.classList.add(
                "active"
            );


            setCameraMessage(
                "Photo captured successfully."
            );


            showToast(
                "Crop photo captured",
                "Your crop image is ready to analyse.",
                "📷"
            );

        }
    );


    /* ---------------------------------------------------------
       DEMO ANALYSIS
    --------------------------------------------------------- */

    analyseButton?.addEventListener(
        "click",
        () => {

            /*
             * IMPORTANT:
             * This is only a frontend demonstration.
             * It does NOT claim to detect a real crop disease.
             */

            showToast(
                "Demo analysis complete",
                "The image is ready for connection to your Django analysis system.",
                "🌱"
            );

        }
    );


    /* ---------------------------------------------------------
       NOTIFICATION BUTTON
    --------------------------------------------------------- */

    notificationButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Farm notifications",
                "No new alerts right now. Your demo farm looks stable.",
                "🔔"
            );

        }
    );


    /* ---------------------------------------------------------
       PROFILE BUTTON
    --------------------------------------------------------- */

    profileButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Farmer profile",
                "Profile management can be connected to your Django account system.",
                "👤"
            );

        }
    );


    /* ---------------------------------------------------------
       ADD CROP
    --------------------------------------------------------- */

    const addCropButtons = [

        document.getElementById("addCropButton"),

        document.getElementById("addCropButtonSecondary")

    ].filter(Boolean);


    addCropButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (addCropButton) {
                    addCropButton.addEventListener("click", function () {
                        window.location.href = "/add-crop/";
                    });
                }

                if (addCropButtonSecondary) {
                    addCropButtonSecondary.addEventListener("click", function () {
                        window.location.href = "/add-crop/";
                    });
                }

            }
        );

    });


    /* ---------------------------------------------------------
       CROP DETAILS
    --------------------------------------------------------- */

    const cropCards =
        document.querySelectorAll(
            ".crop-card"
        );


    cropCards.forEach(card => {

        const detailButton =
            card.querySelector(
                ".crop-scan-button"
            );

        const cropName =
            card.querySelector("h3")
                ?.textContent
                .trim() || "Crop";


        detailButton?.addEventListener(
            "click",
            () => {

                showToast(
                    `${cropName} details`,
                    "Detailed crop records can be connected to your Django database.",
                    "🌿"
                );

            }
        );


        const moreButton =
            card.querySelector(
                ".crop-more"
            );


        moreButton?.addEventListener(
            "click",
            () => {

                showToast(
                    `${cropName} options`,
                    "Crop edit and management actions can be added here.",
                    "⋮"
                );

            }
        );

    });


    /* ---------------------------------------------------------
       HISTORY BUTTON
    --------------------------------------------------------- */

    document
        .getElementById("viewHistoryButton")
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "Scan history",
                    "You are already viewing the recent scan history.",
                    "📋"
                );

            }
        );


    /* ---------------------------------------------------------
       ONLINE / OFFLINE STATUS
       --------------------------------------------------------- */

    /*
     * This only detects the browser connection state.
     * It does NOT implement a complete offline system.
     */

    function updateConnectionStatus() {

        if (navigator.onLine) {

            showToast(
                "Connection restored",
                "ShetiMitra is back online.",
                "✓"
            );

        } else {

            showToast(
                "You're offline",
                "Some online features may not be available.",
                "📡"
            );

        }

    }


    window.addEventListener(
        "online",
        updateConnectionStatus
    );

    window.addEventListener(
        "offline",
        updateConnectionStatus
    );


    /* ---------------------------------------------------------
       THEME TOGGLE
    --------------------------------------------------------- */

    const themeButton =
        document.createElement("button");


    themeButton.id = "themeToggle";
    themeButton.type = "button";
    themeButton.className =
        "icon-button theme-toggle";

    themeButton.setAttribute(
        "aria-label",
        "Toggle dark mode"
    );


    /* Put theme button before notification */

    if (notificationButton) {

        notificationButton.parentNode.insertBefore(
            themeButton,
            notificationButton
        );

    }


    function updateThemeIcon() {

        const isDark =
            body.classList.contains(
                "dark-theme"
            );

        themeButton.textContent =
            isDark ? "☀️" : "🌙";

        themeButton.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

    }


    const savedTheme =
        localStorage.getItem(
            "shetiMitraTheme"
        );


    if (savedTheme === "dark") {

        body.classList.add(
            "dark-theme"
        );

    }


    updateThemeIcon();


    themeButton.addEventListener(
        "click",
        () => {

            const isDark =
                body.classList.toggle(
                    "dark-theme"
                );


            localStorage.setItem(
                "shetiMitraTheme",
                isDark
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();


            showToast(
                isDark
                    ? "Dark mode enabled"
                    : "Light mode enabled",
                isDark
                    ? "ShetiMitra switched to dark mode."
                    : "ShetiMitra switched to light mode.",
                isDark ? "🌙" : "☀️"
            );

        }
    );


    /* ---------------------------------------------------------
       MULTILINGUAL SYSTEM
    --------------------------------------------------------- */

    const translations = {

        en: {

            nav_home: "Home",
            nav_crops: "My Crops",
            nav_scan: "Scan Crop",
            nav_monitoring: "Monitoring",
            nav_history: "History",

            hero_badge: "SMART FARMING PLATFORM",
            hero_title_1: "Healthier Crops.",
            hero_title_2: "Better Harvests.",
            hero_description:
                "Monitor your crops, identify health risks early, and make smarter farming decisions with ShetiMitra.",

            scan_crop: "Scan My Crop",
            view_crops: "View My Crops",

            trust_early: "Early Detection",
            trust_monitor: "Crop Monitoring",
            trust_languages: "Multiple Languages"

        },


        mr: {

            nav_home: "मुख्यपृष्ठ",
            nav_crops: "माझी पिके",
            nav_scan: "पीक स्कॅन करा",
            nav_monitoring: "निरीक्षण",
            nav_history: "इतिहास",

            hero_badge: "स्मार्ट शेती प्लॅटफॉर्म",
            hero_title_1: "निरोगी पिके.",
            hero_title_2: "चांगले उत्पादन.",
            hero_description:
                "तुमच्या पिकांचे निरीक्षण करा, आरोग्याशी संबंधित धोके लवकर ओळखा आणि ShetiMitra च्या मदतीने अधिक चांगले शेती निर्णय घ्या.",

            scan_crop: "माझे पीक स्कॅन करा",
            view_crops: "माझी पिके पहा",

            trust_early: "लवकर शोध",
            trust_monitor: "पीक निरीक्षण",
            trust_languages: "अनेक भाषा"

        },


        hi: {

            nav_home: "होम",
            nav_crops: "मेरी फसलें",
            nav_scan: "फसल स्कैन करें",
            nav_monitoring: "निगरानी",
            nav_history: "इतिहास",

            hero_badge: "स्मार्ट खेती प्लेटफ़ॉर्म",
            hero_title_1: "स्वस्थ फसलें.",
            hero_title_2: "बेहतर उपज.",
            hero_description:
                "अपनी फसलों की निगरानी करें, स्वास्थ्य संबंधी जोखिमों को जल्दी पहचानें और ShetiMitra की मदद से बेहतर खेती के निर्णय लें।",

            scan_crop: "मेरी फसल स्कैन करें",
            view_crops: "मेरी फसलें देखें",

            trust_early: "जल्दी पहचान",
            trust_monitor: "फसल निगरानी",
            trust_languages: "कई भाषाएँ"

        }

    };


    /*
     * Additional text translations.
     * These are matched using CSS selectors rather
     * than changing your HTML structure.
     */

    const extraTranslations = {

        en: {

            ".card-label": "FARM OVERVIEW",
            ".dashboard-card-head h3": "Crop Health",
            ".health-status": "Healthy",
            ".health-score-info span": "Farm Health",
            ".health-score-info strong": "Looking Good",
            ".health-score-info small": "Updated today",

            ".mini-stat:nth-child(1) small": "Active Crops",
            ".mini-stat:nth-child(2) small": "Scans",
            ".mini-stat:nth-child(3) small": "Soil Status",
            ".mini-stat:nth-child(4) small": "Weather",

            ".demo-label": "SAMPLE FARM DATA",

            ".section-heading .section-eyebrow":
                "HOW IT HELPS",

            ".section-heading h2":
                "Everything your crop needs, in one place.",

            ".section-heading p":
                "ShetiMitra brings crop monitoring, scanning and farm insights together in one simple platform.",

            ".feature-one h3":
                "Scan Your Crop",

            ".feature-one p":
                "Take a picture of your crop and keep a digital record of its health.",

            ".feature-two h3":
                "Track Your Crops",

            ".feature-two p":
                "Keep all your crops organized and monitor their condition throughout the season.",

            ".feature-three h3":
                "Spot Risks Early",

            ".feature-three p":
                "Understand possible crop risks before they become bigger problems.",

            ".feature-four h3":
                "Farm Insights",

            ".feature-four p":
                "View useful information about your crops and make informed farming decisions.",

            ".scan-promo-content .section-eyebrow":
                "QUICK SCAN",

            ".scan-promo-content h2":
                "See what your crop is telling you.",

            ".scan-promo-content p":
                "Capture a clear image of your crop and keep its health information organized in your ShetiMitra dashboard.",

            ".scanner-points div:nth-child(1)":
                "✓ Simple crop scanning",

            ".scanner-points div:nth-child(2)":
                "✓ Digital health records",

            ".scanner-points div:nth-child(3)":
                "✓ Easy-to-understand insights",

            "#promoScanButton":
                "📷 Start Crop Scan",

            ".crops-section .section-eyebrow":
                "MY FARM",

            ".crops-section h2":
                "Your crops, at a glance.",

            "#addCropButton":
                "+ Add Crop",

            ".crop-cotton .crop-image-label":
                "🌿 Cotton Field",

            ".crop-soybean .crop-image-label":
                "🌱 Soybean Field",

            ".crop-cotton + .crop-health-pill":
                "● Healthy",

            ".risk-content .section-eyebrow":
                "FARM MONITORING",

            ".risk-content h2":
                "Stay ahead of crop risks.",

            ".risk-content > p":
                "Monitor important crop indicators and understand where your farm may need attention.",

            ".history-section .section-eyebrow":
                "ACTIVITY",

            ".history-section h2":
                "Recent scan history.",

            "#viewHistoryButton":
                "View All →",

            ".why-content .section-eyebrow":
                "WHY SHETIMITRA",

            ".why-content h2":
                "Farming decisions made a little easier.",

            ".why-content > p":
                "Built around the everyday needs of farmers, ShetiMitra helps organize crop information and makes important farm signals easier to understand.",

            ".final-cta .section-eyebrow":
                "READY TO CHECK YOUR CROP?",

            ".final-cta h2":
                "Give your crops the attention they deserve.",

            ".final-cta p":
                "Start a crop scan and keep your farm health organized.",

            "#finalScanButton":
                "📷 Scan My Crop",

            ".footer-container > p":
                "Helping farmers understand, monitor and care for their crops."

        },


        mr: {

            ".card-label":
                "शेताचा आढावा",

            ".dashboard-card-head h3":
                "पिकांचे आरोग्य",

            ".health-status":
                "● निरोगी",

            ".health-score-info span":
                "शेताचे आरोग्य",

            ".health-score-info strong":
                "स्थिती चांगली आहे",

            ".health-score-info small":
                "आज अपडेट केले",

            ".mini-stat:nth-child(1) small":
                "सक्रिय पिके",

            ".mini-stat:nth-child(2) small":
                "स्कॅन",

            ".mini-stat:nth-child(3) small":
                "मातीची स्थिती",

            ".mini-stat:nth-child(4) small":
                "हवामान",

            ".demo-label":
                "नमुना शेत डेटा",

            ".section-heading .section-eyebrow":
                "हे कसे मदत करते",

            ".section-heading h2":
                "तुमच्या पिकाला आवश्यक सर्व काही, एकाच ठिकाणी.",

            ".section-heading p":
                "ShetiMitra मध्ये पीक निरीक्षण, स्कॅनिंग आणि शेतीविषयक माहिती एका सोप्या प्लॅटफॉर्मवर उपलब्ध आहे.",

            ".feature-one h3":
                "तुमचे पीक स्कॅन करा",

            ".feature-one p":
                "तुमच्या पिकाचा फोटो घ्या आणि त्याच्या आरोग्याची डिजिटल नोंद ठेवा.",

            ".feature-two h3":
                "तुमच्या पिकांचा मागोवा घ्या",

            ".feature-two p":
                "तुमची सर्व पिके व्यवस्थित ठेवा आणि संपूर्ण हंगामात त्यांची स्थिती तपासा.",

            ".feature-three h3":
                "धोके लवकर ओळखा",

            ".feature-three p":
                "मोठी समस्या होण्यापूर्वी पिकांशी संबंधित संभाव्य धोके समजून घ्या.",

            ".feature-four h3":
                "शेतीविषयक माहिती",

            ".feature-four p":
                "तुमच्या पिकांबद्दल उपयुक्त माहिती पहा आणि योग्य शेती निर्णय घ्या.",

            ".scan-promo-content .section-eyebrow":
                "त्वरित स्कॅन",

            ".scan-promo-content h2":
                "तुमचे पीक काय सांगत आहे ते जाणून घ्या.",

            ".scan-promo-content p":
                "तुमच्या पिकाचा स्पष्ट फोटो घ्या आणि त्याच्या आरोग्याची माहिती ShetiMitra डॅशबोर्डमध्ये व्यवस्थित ठेवा.",

            ".scanner-points div:nth-child(1)":
                "✓ सोपे पीक स्कॅनिंग",

            ".scanner-points div:nth-child(2)":
                "✓ डिजिटल आरोग्य नोंदी",

            ".scanner-points div:nth-child(3)":
                "✓ समजण्यास सोपी माहिती",

            "#promoScanButton":
                "📷 पीक स्कॅन करा",

            ".crops-section .section-eyebrow":
                "माझे शेत",

            ".crops-section h2":
                "तुमची पिके, एका नजरेत.",

            "#addCropButton":
                "+ पीक जोडा",

            ".crop-cotton .crop-image-label":
                "🌿 कापसाचे शेत",

            ".crop-soybean .crop-image-label":
                "🌱 सोयाबीनचे शेत",

            ".risk-content .section-eyebrow":
                "शेती निरीक्षण",

            ".risk-content h2":
                "पिकांच्या धोक्यांवर आधीच लक्ष ठेवा.",

            ".history-section .section-eyebrow":
                "क्रियाकलाप",

            ".history-section h2":
                "अलीकडील स्कॅन इतिहास.",

            "#viewHistoryButton":
                "सर्व पहा →",

            ".why-content .section-eyebrow":
                "SHETIMITRA का?",

            ".why-content h2":
                "शेतीचे निर्णय थोडे सोपे झाले.",

            ".final-cta .section-eyebrow":
                "तुमचे पीक तपासण्यासाठी तयार आहात?",

            ".final-cta h2":
                "तुमच्या पिकांना आवश्यक काळजी द्या.",

            ".final-cta p":
                "पीक स्कॅन सुरू करा आणि तुमच्या शेताचे आरोग्य व्यवस्थित ठेवा.",

            "#finalScanButton":
                "📷 माझे पीक स्कॅन करा",

            ".footer-container > p":
                "शेतकऱ्यांना त्यांची पिके समजून घेण्यास, निरीक्षण करण्यास आणि काळजी घेण्यास मदत."
        },


        hi: {

            ".card-label":
                "खेत का अवलोकन",

            ".dashboard-card-head h3":
                "फसल स्वास्थ्य",

            ".health-status":
                "● स्वस्थ",

            ".health-score-info span":
                "खेत का स्वास्थ्य",

            ".health-score-info strong":
                "स्थिति अच्छी है",

            ".health-score-info small":
                "आज अपडेट किया गया",

            ".mini-stat:nth-child(1) small":
                "सक्रिय फसलें",

            ".mini-stat:nth-child(2) small":
                "स्कैन",

            ".mini-stat:nth-child(3) small":
                "मिट्टी की स्थिति",

            ".mini-stat:nth-child(4) small":
                "मौसम",

            ".demo-label":
                "नमूना खेत डेटा",

            ".section-heading .section-eyebrow":
                "यह कैसे मदद करता है",

            ".section-heading h2":
                "आपकी फसल के लिए जरूरी सब कुछ, एक ही जगह।",

            ".section-heading p":
                "ShetiMitra फसल निगरानी, स्कैनिंग और खेती की जानकारी को एक आसान प्लेटफ़ॉर्म पर एक साथ लाता है।",

            ".feature-one h3":
                "अपनी फसल स्कैन करें",

            ".feature-one p":
                "अपनी फसल की तस्वीर लें और उसके स्वास्थ्य का डिजिटल रिकॉर्ड रखें।",

            ".feature-two h3":
                "अपनी फसलों पर नज़र रखें",

            ".feature-two p":
                "अपनी सभी फसलों को व्यवस्थित रखें और पूरे मौसम में उनकी स्थिति देखें।",

            ".feature-three h3":
                "जोखिम जल्दी पहचानें",

            ".feature-three p":
                "बड़ी समस्या बनने से पहले फसल से जुड़े संभावित जोखिमों को समझें।",

            ".feature-four h3":
                "खेती की जानकारी",

            ".feature-four p":
                "अपनी फसलों के बारे में उपयोगी जानकारी देखें और बेहतर खेती के निर्णय लें।",

            ".scan-promo-content .section-eyebrow":
                "त्वरित स्कैन",

            ".scan-promo-content h2":
                "जानिए आपकी फसल क्या बता रही है।",

            ".scan-promo-content p":
                "अपनी फसल की साफ तस्वीर लें और उसकी स्वास्थ्य जानकारी ShetiMitra डैशबोर्ड में व्यवस्थित रखें।",

            ".scanner-points div:nth-child(1)":
                "✓ आसान फसल स्कैनिंग",

            ".scanner-points div:nth-child(2)":
                "✓ डिजिटल स्वास्थ्य रिकॉर्ड",

            ".scanner-points div:nth-child(3)":
                "✓ आसानी से समझ आने वाली जानकारी",

            "#promoScanButton":
                "📷 फसल स्कैन करें",

            ".crops-section .section-eyebrow":
                "मेरा खेत",

            ".crops-section h2":
                "आपकी फसलें, एक नज़र में।",

            "#addCropButton":
                "+ फसल जोड़ें",

            ".crop-cotton .crop-image-label":
                "🌿 कपास का खेत",

            ".crop-soybean .crop-image-label":
                "🌱 सोयाबीन का खेत",

            ".risk-content .section-eyebrow":
                "खेत की निगरानी",

            ".risk-content h2":
                "फसल के जोखिमों से आगे रहें।",

            ".history-section .section-eyebrow":
                "गतिविधि",

            ".history-section h2":
                "हाल की स्कैन हिस्ट्री.",

            "#viewHistoryButton":
                "सभी देखें →",

            ".why-content .section-eyebrow":
                "SHETIMITRA क्यों?",

            ".why-content h2":
                "खेती के फैसले थोड़े आसान।",

            ".final-cta .section-eyebrow":
                "अपनी फसल जांचने के लिए तैयार हैं?",

            ".final-cta h2":
                "अपनी फसलों को वह ध्यान दें जिसकी उन्हें जरूरत है।",

            ".final-cta p":
                "फसल स्कैन शुरू करें और अपने खेत के स्वास्थ्य को व्यवस्थित रखें।",

            "#finalScanButton":
                "📷 मेरी फसल स्कैन करें",

            ".footer-container > p":
                "किसानों को अपनी फसलों को समझने, निगरानी करने और उनकी देखभाल करने में मदद।"
        }

    };


    /* ---------------------------------------------------------
       SAFE TEXT UPDATE
    --------------------------------------------------------- */

    function setElementText(
        selector,
        value
    ) {

        const element =
            document.querySelector(selector);

        if (!element) return;


        /*
         * Preserve icons inside buttons whenever
         * possible.
         */

        if (
            element.tagName === "BUTTON" &&
            value.includes("📷")
        ) {

            const icon =
                element.querySelector(
                    "span:first-child"
                );

            const arrow =
                element.querySelector(
                    "span:last-child"
                );


            if (icon) {
                icon.textContent = "📷";
            }


            if (arrow) {
                arrow.textContent = "→";
            }


            const textNodes =
                [...element.childNodes]
                    .filter(
                        node =>
                            node.nodeType === Node.TEXT_NODE
                    );


            if (textNodes.length) {

                const text =
                    value
                        .replace("📷", "")
                        .trim();

                textNodes[0].textContent =
                    ` ${text} `;

            }

            return;
        }


        /*
         * Preserve the plus sign in Add Crop button.
         */

        if (
            element.id === "addCropButton" &&
            value.startsWith("+")
        ) {

            element.innerHTML =
                `<span>+</span> ${value
                    .replace("+", "")
                    .trim()}`;

            return;
        }


        element.textContent = value;

    }


    function applyLanguage(language) {

        if (!translations[language]) {
            language = "en";
        }


        /* Existing data-i18n elements */

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;

                const value =
                    translations[language][key];


                if (value) {
                    element.textContent = value;
                }

            });


        /* Mobile nav */

        const mobileLinks =
            document.querySelectorAll(
                ".mobile-nav .nav-link"
            );


        const mobileKeys = [
            "nav_home",
            "nav_crops",
            "nav_scan",
            "nav_monitoring",
            "nav_history"
        ];


        mobileLinks.forEach(
            (link, index) => {

                const key =
                    mobileKeys[index];

                if (
                    translations[language][key]
                ) {
                    link.textContent =
                        translations[language][key];
                }

            }
        );


        /* Additional sections */

        const sectionTranslations =
            extraTranslations[language];


        Object
            .entries(sectionTranslations)
            .forEach(
                ([selector, value]) => {

                    setElementText(
                        selector,
                        value
                    );

                }
            );


        /* Language selector */

        if (languageSelector) {
            languageSelector.value =
                language;
        }


        localStorage.setItem(
            "shetiMitraLanguage",
            language
        );


        document.documentElement.lang =
            language === "mr"
                ? "mr"
                : language === "hi"
                    ? "hi"
                    : "en";


        showToast(
            language === "mr"
                ? "भाषा बदलली"
                : language === "hi"
                    ? "भाषा बदल दी गई"
                    : "Language changed",
            language === "mr"
                ? "ShetiMitra आता मराठीत आहे."
                : language === "hi"
                    ? "ShetiMitra अब हिंदी में है."
                    : "ShetiMitra is now in English.",
            "🌐"
        );

    }


    const savedLanguage =
        localStorage.getItem(
            "shetiMitraLanguage"
        ) || "en";


    if (languageSelector) {

        languageSelector.value =
            savedLanguage;


        languageSelector.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

            }
        );

    }


    /*
     * Apply saved language silently.
     * We don't want a toast to appear automatically.
     */

    function applySavedLanguage(language) {

        if (!translations[language]) {
            language = "en";
        }


        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;

                const value =
                    translations[language][key];

                if (value) {
                    element.textContent =
                        value;
                }

            });


        document
            .querySelectorAll(
                ".mobile-nav .nav-link"
            )
            .forEach(
                (link, index) => {

                    const key = [
                        "nav_home",
                        "nav_crops",
                        "nav_scan",
                        "nav_monitoring",
                        "nav_history"
                    ][index];

                    if (
                        translations[language][key]
                    ) {
                        link.textContent =
                            translations[language][key];
                    }

                }
            );


        Object
            .entries(
                extraTranslations[language]
            )
            .forEach(
                ([selector, value]) => {

                    setElementText(
                        selector,
                        value
                    );

                }
            );


        document.documentElement.lang =
            language === "mr"
                ? "mr"
                : language === "hi"
                    ? "hi"
                    : "en";

    }


    applySavedLanguage(
        savedLanguage
    );


    /* ---------------------------------------------------------
       SCROLL REVEAL ANIMATIONS
    --------------------------------------------------------- */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, " +
            ".crop-card, " +
            ".add-crop-card, " +
            ".history-item, " +
            ".risk-dashboard, " +
            ".why-content, " +
            ".why-visual, " +
            ".final-cta-container"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* ---------------------------------------------------------
       KEYBOARD ACCESSIBILITY
    --------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                document.activeElement?.classList.contains(
                    "capture-button"
                )
            ) {

                captureButton?.click();

            }

        }
    );


    /* ---------------------------------------------------------
       INITIAL STATE
    --------------------------------------------------------- */

    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    console.log(
        "🌱 ShetiMitra dashboard initialized successfully."
    );

});