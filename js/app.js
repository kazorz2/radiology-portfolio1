// ----- HELPERS -----
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id;
};

function showToast(message) {
    let toast = document.getElementById('syncToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'syncToast';
        toast.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem; 
            background: var(--brand-main); color: #fff; 
            padding: 0.8rem 1.5rem; border-radius: 50px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 9999;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: translateY(100px); opacity: 0;
            display: flex; align-items: center; gap: 0.75rem; font-weight: 500;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${message}`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

// ----- STORE.JS -----
const STORE_KEY = "mohamed_portfolio_data_v11";

const defaultData = {
    profile: {
        name: "Mohamed Ali Salah",
        title: "Radiology Specialist (اخصائي اشعه)",
        email: "moh68290@gmail.com",
        whatsapp: "+201060623186",
        facebook: "https://www.facebook.com/share/1Hok96ABYL/",
        bio: "Experienced Radiology Specialist dedicated to providing accurate and detailed diagnostic imaging. Passionate about medical technology and patient care.",
        education: "Bachelor of Health Sciences, Sohag Higher Institute of Health Sciences",
        educationDetails: "Class of 2026, Grade: Excellent",
        internships: "Training at Al-Hayat Hospital (Sohag), Taiba Radiology Center (Medina), Dayrout General Hospital, and Sohag General Hospital.",
        totalCases: "5000+",
        experienceYears: "5+",
        image: "file_000000003cb07243afd7c2c33b81cd9d.png",
        cvFile: "Mohamed Ali – Radiology Technician CV.pdf"
    },
    visitorCount: 0,
    cloudConfig: null,
    modalities: [
        { id: "xray", name: "Conventional X-ray", icon: "🦴" },
        { id: "ct", name: "CT Scan", icon: "💻" },
        { id: "mri", name: "MRI", icon: "🧠" },
        { id: "dental", name: "Dental Imaging", icon: "📸" },
        { id: "c-arm", name: "C-Arm", icon: "⚕️" },
        { id: "software", name: "PACS & RIS", icon: "🖥️" }
    ],
    cases: [
        { id: crypto.randomUUID(), title: "Brain MRI Analysis 🧠", description: "Detailed MRI scan highlighting normal tissue contrast.", modalityId: "mri", tags: ["Brain", "Contrast"], image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80", isFeatured: true },
        { 
            id: crypto.randomUUID(), 
            title: "Tri-phasic CT Liver | فحص ثلاثي المراحل للكبد 🩺", 
            description: "Arabic:\nالعنوان: فحص أشعة مقطعية ثلاثي المراحل على الكبد (Tri-phasic CT Liver).\nالتفاصيل الفنية: أشعة مقطعية بالصبغة باستخدام بروتوكول لمراحل الثلاث (Arterial, Portal, Delayed).\n\nEnglish:\nDynamic Tri-phasic CT Scan of the Liver. Multi-detector CT evaluation using a dedicated tri-phasic contrast protocol. Essential for characterizing focal liver lesions.", 
            modalityId: "ct", 
            tags: ["Liver", "Contrast", "Tri-phasic"], 
            image: "image/ct_liver_cover_1773868347998.png",
            gallery: [
                "https://www.youtube.com/watch?v=kgz9EOF4GQQ",
                "https://www.youtube.com/shorts/SqejwdoR_VY",
                "https://www.youtube.com/shorts/aNuCRGH0rZk"
            ],
            isFeatured: true 
        },
        { id: crypto.randomUUID(), title: "Digital X-ray Lower Limb (Anatomical) 🦴", description: "Standing full-leg digital X-ray for precise limb length evaluation (LLD). Clear anatomical landmarks from pelvis to ankle.", modalityId: "xray", tags: ["X-ray", "LLD", "Anatomical"], image: "image/anatomical angel.png", isFeatured: true },
        { id: crypto.randomUUID(), title: "Digital X-ray Lower Limb (Mechanical) 🦴", description: "Advanced mechanical axis analysis with precise angles (90.9° & 85.3°) for orthopedic surgical planning.", modalityId: "xray", tags: ["X-ray", "Mechanical Axis", "Orthopedic"], image: "image/mechanical angel.png", isFeatured: true },
        { id: crypto.randomUUID(), title: "Cervical Spine MRI 🧠", description: "Spinal cord evaluation without contrast.", modalityId: "mri", tags: ["Spine", "Cervical"], image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", isFeatured: false },
        { id: crypto.randomUUID(), title: "Chest CT Scan 💻", description: "High-resolution computed tomography of the lungs.", modalityId: "ct", tags: ["Chest", "Lungs"], image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", isFeatured: true },
        { id: crypto.randomUUID(), title: "Abdomen CT Scan 💻", description: "Routine abdominal scan.", modalityId: "ct", tags: ["Abdomen"], image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80", isFeatured: false }
    ],
    experience: [
        { id: crypto.randomUUID(), hospitalName: "Embaba General Hospital", dates: "Dec 2025 – Present", description: "Working on X-ray, CT, and C-Arm units.", icon: "🏥", media: "" },
        { id: crypto.randomUUID(), hospitalName: "Al-Fajr Clinic – Faisal/Kardasa", dates: "June 2025 – Present", description: "Specialized in CT and X-ray.", icon: "🏢", media: "" },
        { id: crypto.randomUUID(), hospitalName: "Quba Radiology & Home Scan", dates: "June 2025 – July 2025", description: "MRI, X-ray, and Mobile/Home imaging services.", icon: "⚕️", media: "" },
        { id: crypto.randomUUID(), hospitalName: "Al-Ahram Center – Faisal", dates: "July 2025 – Aug 2025", description: "Focused on CT scans (GE, Siemens, Toshiba).", icon: "🩺", media: "" },
        { id: crypto.randomUUID(), hospitalName: "Home Scan – Haram", dates: "June 2021", description: "Early training on Portable X-ray and Dental Sensors.", icon: "🏡", media: "" }
    ],
    services: [
        { id: "s1", title: "X-ray", description: "Digital radiography providing quick, high-quality skeletal and chest imaging.", icon: "🦴" },
        { id: "s2", title: "CT Scan", description: "Cross-sectional imaging for comprehensive internal evaluation.", icon: "💻" },
        { id: "s3", title: "MRI", description: "Magnetic Resonance Imaging for detailed soft tissue, brain, and joint analysis.", icon: "🧠" },
        { id: "s4", title: "Emergency Radiology", description: "Rapid diagnostic services for trauma and acute conditions.", icon: "🚑" }
    ],
    testimonials: [
        { id: crypto.randomUUID(), patientName: "Dr. Ahmed", feedback: "Exceptional detail in reporting. A highly dependable radiology specialist.", rating: 5 },
        { id: crypto.randomUUID(), patientName: "Sarah M.", feedback: "Very professional and empathetic approach to patient privacy.", rating: 5 }
    ],
    settings: {
        animations: true,
        theme: "dark"
    }
};
const firebaseConfig = {
  apiKey: "AIzaSyANhAfYD-s4PCcdYN0qq5I6XPzqZ36UsUs",
  authDomain: "mohamed-radiology.firebaseapp.com",
  databaseURL: "https://mohamed-radiology-default-rtdb.firebaseio.com",
  projectId: "mohamed-radiology",
  storageBucket: "mohamed-radiology.firebasestorage.app",
  messagingSenderId: "815693498488",
  appId: "1:815693498488:web:73d4834d729e4ced8f858d",
  measurementId: "G-5GRL3TQFZE"
};

// تشغيل الربط تلقائياً
localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));

// الجزء ده عشان يضمن إن الموقع يقرأ الحالات أول ما يفتح
const STORE_KEY = 'radiology_portfolio_data';


const Store = {
    init() {
        if (!localStorage.getItem(STORE_KEY)) {
            localStorage.setItem(STORE_KEY, JSON.stringify(defaultData));
        } else {
            // Migration V2: Ensure YouTube links are always correct for the CT Liver case
            const data = this.getData();
            let changed = false;
            data.cases = data.cases.map(c => {
                if (c.title.includes("Tri-phasic CT Liver")) {
                    // Force update if image is wrong or gallery is missing
                    if (c.image !== "image/ct_liver_cover_1773868347998.png" || !c.gallery || c.gallery.some(l => !l.includes('youtube.com') && !l.includes('youtu.be'))) {
                        c.image = "image/ct_liver_cover_1773868347998.png";
                        c.gallery = [
                            "https://www.youtube.com/watch?v=kgz9EOF4GQQ",
                            "https://www.youtube.com/shorts/SqejwdoR_VY",
                            "https://www.youtube.com/shorts/aNuCRGH0rZk"
                        ];
                        changed = true;
                    }
                }
                return c;
            });
            if (changed) this.saveData(data);
        }
    },
    getData() {
        return JSON.parse(localStorage.getItem(STORE_KEY));
    },
    saveData(data) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(data));
            // Automatically sync to cloud if active
            if (typeof Cloud !== 'undefined' && Cloud.isActive()) {
                Cloud.save('', data);
                showToast("Syncing with Cloud... ☁️");
            }
        } catch (e) {
            console.error("Save Error:", e);
            if (e.name === 'QuotaExceededError') {
                alert("Storage limit reached! Please use smaller images or compress them before uploading.");
            } else {
                alert("An error occurred while saving your changes.");
            }
        }
    },
    getProfile() { return this.getData().profile; },
    getModalities() { return this.getData().modalities; },
    getCases() { return this.getData().cases; },
    getExperience() { return this.getData().experience; },
    getServices() { return this.getData().services; },
    getTestimonials() { return this.getData().testimonials; },
    getSettings() { return this.getData().settings; },
    updateProfile(newProfileData) {
        const data = this.getData();
        data.profile = { ...data.profile, ...newProfileData };
        this.saveData(data);
    },
    addCase(caseData) {
        const data = this.getData();
        caseData.id = crypto.randomUUID();
        data.cases.push(caseData);
        this.saveData(data);
    },
    updateCase(id, updatedData) {
        const data = this.getData();
        data.cases = data.cases.map(c => c.id === id ? { ...c, ...updatedData } : c);
        this.saveData(data);
    },
    deleteCase(id) {
        const data = this.getData();
        data.cases = data.cases.filter(c => c.id !== id);
        this.saveData(data);
    },
    addExperience(expData) {
        const data = this.getData();
        expData.id = crypto.randomUUID();
        data.experience.push(expData);
        this.saveData(data);
    },
    updateExperience(id, updatedData) {
        const data = this.getData();
        data.experience = data.experience.map(e => e.id === id ? { ...e, ...updatedData } : e);
        this.saveData(data);
    },
    deleteExperience(id) {
        const data = this.getData();
        data.experience = data.experience.filter(e => e.id !== id);
        this.saveData(data);
    },
    addModality(modData) {
        const data = this.getData();
        if (!modData.id) modData.id = crypto.randomUUID();
        data.modalities.push(modData);
        this.saveData(data);
    },
    updateModality(id, updatedData) {
        const data = this.getData();
        data.modalities = data.modalities.map(m => m.id === id ? { ...m, ...updatedData } : m);
        this.saveData(data);
    },
    deleteModality(id) {
        const data = this.getData();
        data.modalities = data.modalities.filter(e => e.id !== id);
        this.saveData(data);
    },
    addTestimonial(testData) {
        const data = this.getData();
        testData.id = crypto.randomUUID();
        data.testimonials.push(testData);
        this.saveData(data);
    },
    deleteTestimonial(id) {
        const data = this.getData();
        data.testimonials = data.testimonials.filter(t => t.id !== id);
        this.saveData(data);
    },
    updateSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.saveData(data);
        document.documentElement.setAttribute('data-theme', data.settings.theme);
    },
    incrementVisits() {
        const data = this.getData();
        data.visitorCount = (data.visitorCount || 0) + 1;
        this.saveData(data);
        // Use atomic increment if cloud is active
        if (Cloud.isActive()) {
            Cloud.db.ref('portfolio/visitorCount').set(firebase.database.ServerValue.increment(1));
        }
    },
    updateCloudConfig(config) {
        const data = this.getData();
        data.cloudConfig = config;
        this.saveData(data);
    }
};

// ----- CLOUD SYNC (FIREBASE) -----
const Cloud = {
    db: null,
    init() {
        const config = Store.getData().cloudConfig;
        if (config && config.apiKey && typeof firebase !== 'undefined') {
            try {
                if (!firebase.apps.length) firebase.initializeApp(config);
                this.db = firebase.database();
                this.syncAll();
                console.log("☁️ Firebase Cloud Sync Active");
                return true;
            } catch (e) { console.error("Firebase Init Error:", e); }
        }
        return false;
    },
    isActive() { return !!this.db; },
    async syncAll() {
        if (!this.isActive()) return;
        
        // Use a real-time listener for instant updates
        this.db.ref('portfolio').on('value', (snapshot) => {
            if (snapshot.exists()) {
                const cloudData = snapshot.val();
                const localData = Store.getData();
                
                // --- SMART MERGE LOGIC ---
                // We merge cloud data into local, but for arrays, we combine them to prevent loss
                const merged = { ...localData, ...cloudData };
                
                // Merge Testimonials (Reviews)
                if (cloudData.testimonials) {
                    const localTests = localData.testimonials || [];
                    const cloudTests = cloudData.testimonials || [];
                    // Combine and remove duplicates by ID
                    const testMap = new Map();
                    [...localTests, ...cloudTests].forEach(t => testMap.set(t.id, t));
                    merged.testimonials = Array.from(testMap.values());
                }

                // Merge Cases (if needed)
                if (cloudData.cases) {
                    const caseMap = new Map();
                    [...(localData.cases || []), ...cloudData.cases].forEach(c => caseMap.set(c.id, c));
                    merged.cases = Array.from(caseMap.values());
                }
                
                // Solve the visitor count: Cloud version is always truth
                merged.visitorCount = Math.max(localData.visitorCount || 0, cloudData.visitorCount || 0);
                
                const oldDataStr = JSON.stringify(localData);
                const newDataStr = JSON.stringify(merged);

                if (oldDataStr !== newDataStr) {
                    localStorage.setItem(STORE_KEY, newDataStr);
                    console.log("🔄 Real-time Cloud Sync: Data Merged & Updated");
                    
                    // Simple logic to trigger UI refresh if not in Admin Panel
                    if (window.location.hash !== '#admin') {
                        // Debounced refresh to avoid flickering
                        if (window.syncRefreshTimeout) clearTimeout(window.syncRefreshTimeout);
                        window.syncRefreshTimeout = setTimeout(() => {
                            if (typeof router === 'function') router();
                        }, 500);
                    }
                }
            }
        });
    },
    save(path, data) {
        if (this.isActive()) {
            // If path is empty, we are saving the whole object
            const target = path ? 'portfolio/' + path : 'portfolio';
            this.db.ref(target).set(data);
        }
    }
};

Store.init();
Cloud.init();
Store.incrementVisits();
document.documentElement.setAttribute('data-theme', Store.getSettings().theme);

// ----- ADMIN.JS -----
let isAuthenticated = false;

function renderAdmin(container) {
    if (!isAuthenticated) {
        renderLogin(container);
    } else {
        renderDashboard(container);
    }
}

function renderLogin(container) {
    container.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-base);">
            <div class="glass-card admin-login-card" style="width: 100%; max-width: 400px; text-align: center;">
                <h2 style="margin-bottom: 2rem;">Admin <span style="color:var(--brand-main)">Login</span></h2>
                <form id="loginForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <input type="password" id="password" placeholder="Enter Password" required class="admin-input">
                    <button type="submit" class="btn btn-primary glow-btn">Login to CMS</button>
                    <a href="#" style="color: var(--text-tertiary); font-size: 0.9rem;">&larr; Back to Portfolio</a>
                </form>
            </div>
        </div>
        <style>
            .admin-input {
                width: 100%; padding: 1rem; background: var(--bg-surface); border: 1px solid var(--border-glass); 
                color: var(--text-primary); border-radius: var(--border-radius); outline: none; font-family: inherit;
            }
            .admin-input:focus {
                border-color: var(--brand-main);
                box-shadow: 0 0 0 2px var(--brand-glow);
            }
        </style>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('password').value;
        if (pwd === 'moh112005') {
            isAuthenticated = true;
            renderDashboard(container);
        } else {
            alert('Incorrect Password');
        }
    });
}

function renderDashboard(container) {
    const profile = Store.getProfile();
    const cases = Store.getCases();
    const experience = Store.getExperience();
    const modalities = Store.getModalities();
    
    container.innerHTML = `
        <div class="admin-layout">
            <aside class="admin-sidebar glass-panel">
                <div style="margin-bottom: 2rem;">
                    <h3>Dr. Mohamed Ali</h3>
                    <p style="color: var(--text-tertiary); font-size: 0.9rem;">CMS Dashboard</p>
                </div>
                <nav class="admin-nav-list" id="adminNav">
                    <button class="btn btn-secondary admin-tab active" data-target="panel-stats" style="justify-content: flex-start; border: none; background: transparent;">📊 Site Overview</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-cases" style="justify-content: flex-start; border: none; background: transparent;">📁 Manage Cases</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-profile" style="justify-content: flex-start; border: none; background: transparent;">👤 Profile</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-cv" style="justify-content: flex-start; border: none; background: transparent;">📄 CV Management</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-experience" style="justify-content: flex-start; border: none; background: transparent;">🏥 Experience</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-modalities" style="justify-content: flex-start; border: none; background: transparent;">⚙️ Modalities</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-reviews" style="justify-content: flex-start; border: none; background: transparent;">💬 Reviews</button>
                    <button class="btn btn-secondary admin-tab" data-target="panel-db" style="justify-content: flex-start; border: none; background: transparent;">☁️ Cloud Database</button>
                </nav>
                <div style="margin-top: auto; padding-top: 2rem;">
                    <button id="logoutBtn" class="btn btn-secondary" style="width: 100%; color: #ef4444; border: 1px solid rgba(239,68,68,0.3);">🚪 Logout</button>
                    <a href="#" class="btn btn-secondary glow-btn" style="width: 100%; text-align: center; margin-top: 1rem; color: var(--brand-main); border: 1px solid var(--brand-glow);">🌐 View Live Site</a>
                </div>
            </aside>
            <main class="admin-content">
                
                <!-- STATS PANEL -->
                <div id="panel-stats" class="admin-panel">
                    <h2>Site Statistics</h2>
                    <div class="grid-3" style="margin-top: 2rem;">
                        <div class="glass-card" style="padding: 2rem; text-align: center;">
                            <span style="font-size: 2.5rem; color: var(--brand-main);">👥</span>
                            <h3 style="margin-top: 1rem;">${Store.getData().visitorCount || 0}</h3>
                            <p>Total Visits</p>
                        </div>
                        <div class="glass-card" style="padding: 2rem; text-align: center;">
                            <span style="font-size: 2.5rem; color: var(--brand-main);">📸</span>
                            <h3 style="margin-top: 1rem;">${cases.length}</h3>
                            <p>Clinical Cases</p>
                        </div>
                        <div class="glass-card" style="padding: 2rem; text-align: center;">
                            <span style="font-size: 2.5rem; color: var(--brand-main);">💬</span>
                            <h3 style="margin-top: 1rem;">${Store.getTestimonials().length}</h3>
                            <p>Patient Reviews</p>
                        </div>
                    </div>
                </div>

                <!-- CASES PANEL -->
                <div id="panel-cases" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <h2>Manage Cases</h2>
                        <button class="btn btn-primary glow-btn" id="addCaseBtn">+ Add New Case</button>
                    </div>
                    
                    <div class="glass-card form-container-anim" style="padding: 2rem; display: none; margin-bottom: 2rem;" id="caseFormContainer">
                        <form id="caseForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="hidden" id="caseEditId">
                            <input type="text" id="caseTitle" placeholder="Case Title" class="admin-input" required>
                            <textarea id="caseDesc" placeholder="Description" class="admin-input" rows="3" required></textarea>
                            <select id="caseModality" class="admin-input" required>
                                ${modalities.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                            </select>
                            <input type="text" id="caseTags" placeholder="Tags (comma separated)" class="admin-input">
                            <textarea id="caseGalleryLinks" placeholder="Video/Gallery Links (YouTube URLs, one per line)" class="admin-input" rows="2"></textarea>
                            <input type="file" id="caseImage" class="admin-input" accept="image/*,video/*">
                            <small style="color: var(--text-tertiary); margin-top: -0.5rem;" id="caseImageHint">Leave blank to keep existing image when editing.</small>
                            <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); cursor: pointer;">
                                <input type="checkbox" id="caseFeatured" style="width: 18px; height: 18px;"> Featured Case
                            </label>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary glow-btn" id="caseSubmitBtn">Save Case</button>
                                <button type="button" class="btn btn-secondary" id="cancelCaseBtn">Cancel</button>
                            </div>
                        </form>
                    </div>

                    <div style="display: grid; gap: 1rem;">
                        ${cases.map(c => `
                            <div class="glass-card admin-list-card">
                                <div class="admin-list-info">
                                    ${c.image.startsWith('data:video') ? 
                                        `<video src="${c.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0; box-shadow: var(--shadow-sm);" muted></video>` : 
                                        `<img src="${c.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0; box-shadow: var(--shadow-sm);">`
                                    }
                                    <div>
                                        <strong style="font-size: 1.1rem; display: block; margin-bottom: 0.3rem;">${c.title}</strong>
                                        <div style="font-size: 0.85rem; color: var(--text-tertiary); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                            <span style="background: var(--bg-glass); padding: 0.2rem 0.6rem; border-radius: 4px;">${c.modalityId}</span>
                                            ${c.isFeatured ? '<span style="background: rgba(234, 179, 8, 0.1); color: #eab308; padding: 0.2rem 0.6rem; border-radius: 4px;">⭐ Featured</span>' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="admin-list-actions">
                                    <button class="btn btn-secondary btn-icon-only edit-case-btn" data-id="${c.id}" title="Edit Case">✏️</button>
                                    <button class="btn btn-secondary btn-icon-only delete-case-btn" data-id="${c.id}" title="Delete Case">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- PROFILE PANEL -->
                <div id="panel-profile" class="admin-panel" style="display: none;">
                    <h2>Profile Information & CV</h2>
                    <form id="profileForm" class="glass-card" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem;">
                        <input type="text" id="profName" value="${profile.name}" class="admin-input" placeholder="Name">
                        <input type="text" id="profTitle" value="${profile.title}" class="admin-input" placeholder="Title">
                        <input type="text" id="profEdu" value="${profile.education || ''}" class="admin-input" placeholder="Education (Degree & University)">
                        <input type="text" id="profEduDetails" value="${profile.educationDetails || ''}" class="admin-input" placeholder="Education Details (Class of 2026, Grade, etc.)">
                        <textarea id="profBio" class="admin-input" rows="4" placeholder="Bio Content">${profile.bio}</textarea>
                        <textarea id="profInternships" class="admin-input" rows="3" placeholder="Clinical Internships Summary">${profile.internships || ''}</textarea>
                        <div class="grid-2">
                            <input type="text" id="profEmail" value="${profile.email}" class="admin-input" placeholder="Email">
                            <input type="text" id="profWa" value="${profile.whatsapp}" class="admin-input" placeholder="WhatsApp">
                        </div>
                        <div class="grid-2">
                            <input type="text" id="profCases" value="${profile.totalCases}" class="admin-input" placeholder="Total Cases">
                            <input type="text" id="profExp" value="${profile.experienceYears}" class="admin-input" placeholder="Experience Years">
                        </div>
                        <input type="text" id="profFb" value="${profile.facebook}" class="admin-input" placeholder="Facebook Link">
                        
                        <div style="border-top: 1px solid var(--border-glass); padding-top: 1rem; margin-top: 1rem;">
                            <h4>Upload CV (PDF) - Optional</h4>
                            <input type="file" id="cvUpload" class="admin-input" accept="application/pdf" style="margin-top: 0.5rem;">
                        </div>

                        <div style="border-top: 1px solid var(--border-glass); padding-top: 1rem; margin-top: 0.5rem;">
                            <h4>Upload Profile Image - Optional</h4>
                            <input type="file" id="imgUpload" class="admin-input" accept="image/*" style="margin-top: 0.5rem;">
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: max-content;">Save Profile</button>
                    </form>
                </div>
                
                <!-- EXPERIENCE PANEL -->
                <div id="panel-experience" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <h2>Manage Experience</h2>
                        <button class="btn btn-primary glow-btn" id="addExpBtn">+ Add Experience</button>
                    </div>

                    <div class="glass-card form-container-anim" style="padding: 2rem; display: none; margin-bottom: 2rem;" id="expFormContainer">
                        <form id="expForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="hidden" id="expEditId">
                            <input type="text" id="expName" placeholder="Hospital/Clinic Name" class="admin-input" required>
                            <input type="text" id="expDate" placeholder="Duration (e.g. Dec 2025 – Present)" class="admin-input" required>
                            <input type="text" id="expDesc" placeholder="Role Description" class="admin-input" required>
                            <input type="text" id="expIcon" placeholder="Emoji Icon (e.g. 🏥)" value="🏥" class="admin-input" required>
                            <input type="file" id="expMedia" class="admin-input" accept="image/*,video/*">
                            <small style="color: var(--text-tertiary); margin-top: -0.5rem;" id="expMediaHint">Optional: Add an image or video for this experience.</small>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary glow-btn" id="expSubmitBtn">Save Experience</button>
                                <button type="button" class="btn btn-secondary" id="cancelExpBtn">Cancel</button>
                            </div>
                        </form>
                    </div>

                    <div style="display: grid; gap: 1rem;">
                        ${experience.map(e => `
                            <div class="glass-card admin-list-card">
                                <div>
                                    <strong style="font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        <span style="font-size: 1.5rem;">${e.icon}</span> ${e.hospitalName}
                                    </strong>
                                    <p style="font-size: 0.85rem; color: var(--brand-main); font-weight: 600;">${e.dates || ''}</p>
                                    <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.3rem;">${e.description}</p>
                                    ${e.media ? `<div style="margin-top: 0.5rem; width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-glass);">
                                        ${e.media.startsWith('data:video') ? `<video src="${e.media}" style="width:100%;height:100%;object-fit:cover;" muted></video>` : `<img src="${e.media}" style="width:100%;height:100%;object-fit:cover;">`}
                                    </div>` : ''}
                                </div>
                                <div class="admin-list-actions">
                                    <button class="btn btn-secondary btn-icon-only edit-exp-btn" data-id="${e.id}" title="Edit">✏️</button>
                                    <button class="btn btn-secondary btn-icon-only delete-exp-btn" data-id="${e.id}" title="Delete">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- MODALITIES PANEL -->
                <div id="panel-modalities" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <h2>Manage Modalities</h2>
                        <button class="btn btn-primary glow-btn" id="addModBtn">+ Add Modality</button>
                    </div>

                    <div class="glass-card form-container-anim" style="padding: 2rem; display: none; margin-bottom: 2rem;" id="modFormContainer">
                        <form id="modForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="hidden" id="modEditId">
                            <input type="text" id="modId" placeholder="ID (e.g. usg) - Cannot change once created" class="admin-input" required>
                            <input type="text" id="modName" placeholder="Name (e.g. Ultrasound)" class="admin-input" required>
                            <input type="text" id="modIcon" placeholder="Emoji Icon (e.g. 🔉)" value="🔉" class="admin-input" required>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary glow-btn" id="modSubmitBtn">Save Modality</button>
                                <button type="button" class="btn btn-secondary" id="cancelModBtn">Cancel</button>
                            </div>
                        </form>
                    </div>

                    <div class="grid-3">
                        ${modalities.map(m => `
                            <div class="glass-card" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 0.8rem; font-weight: 600; font-size: 1.1rem;">
                                    <span style="font-size: 1.5rem;">${m.icon}</span> ${m.name}
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-secondary btn-icon-only edit-mod-btn" data-id="${m.id}" title="Edit">✏️</button>
                                    <button class="btn btn-secondary btn-icon-only delete-mod-btn" data-id="${m.id}" title="Delete">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- CV MANAGEMENT PANEL -->
                <div id="panel-cv" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <h2>CV Management</h2>
                    </div>

                    <div class="glass-card" style="padding: 2rem;">
                        <div style="margin-bottom: 2rem;">
                            <h4>Current CV Status</h4>
                            <p style="color: var(--text-secondary); margin-top: 0.5rem;" id="cvStatusText">
                                ${profile.cvFile ? '✅ A CV is currently uploaded and active on the website.' : '❌ No CV currently uploaded.'}
                            </p>
                            ${profile.cvFile ? `<a href="${profile.cvFile}" download="Dr_Mohamed_Ali_CV.pdf" class="btn btn-secondary glow-btn" style="margin-top: 1rem; display: inline-block;">📄 Download Current CV</a>` : ''}
                        </div>

                        <form id="cvForm" style="display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-glass); padding-top: 2rem;">
                            <h4>Upload / Replace CV</h4>
                            <input type="file" id="cvUploadFile" class="admin-input" accept=".pdf,image/*" required>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary glow-btn" id="cvSubmitBtn">Upload CV</button>
                                ${profile.cvFile ? '<button type="button" class="btn btn-secondary" id="cvDeleteBtn" style="color: #ef4444; border: 1px solid rgba(239,68,68,0.3);">🗑️ Delete CV</button>' : ''}
                            </div>
                        </form>
                    </div>
                </div>

                <!-- REVIEWS PANEL -->
                <div id="panel-reviews" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                        <h2>Manage Reviews</h2>
                    </div>

                    <div style="display: grid; gap: 1rem;">
                        ${Store.getTestimonials().map(t => `
                            <div class="glass-card admin-list-card">
                                <div>
                                    <strong style="font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                                        ${'⭐'.repeat(t.rating || 5)} ${t.patientName}
                                    </strong>
                                    <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.3rem;">"${t.feedback}"</p>
                                </div>
                                <div class="admin-list-actions">
                                    <button class="btn btn-secondary btn-icon-only delete-review-btn" data-id="${t.id}" title="Delete Review">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                        ${Store.getTestimonials().length === 0 ? '<p style="color:var(--text-tertiary);">No reviews yet.</p>' : ''}
                    </div>
                </div>

                <!-- CLOUD DB PANEL -->
                <div id="panel-db" class="admin-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2>Cloud Database Sync (Firebase)</h2>
                        <span class="badge" style="background: ${Cloud.isActive() ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)'}; color: ${Cloud.isActive() ? '#10b981' : '#94a3b8'};">
                             ${Cloud.isActive() ? '● Cloud Connected' : '○ Local Storage Mode'}
                        </span>
                    </div>

                    <div class="glass-card" style="padding: 2rem;">
                        <p style="margin-bottom: 2rem;">Connect to <strong>Firebase Realtime Database</strong> to enable global reviews and cross-device synchronization.</p>
                        <form id="dbForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            <div class="grid-2">
                                <input type="text" id="dbApiKey" value="${profile.cloudConfig?.apiKey || ''}" placeholder="API Key" class="admin-input">
                                <input type="text" id="dbAuthDomain" value="${profile.cloudConfig?.authDomain || ''}" placeholder="Auth Domain" class="admin-input">
                            </div>
                            <div class="grid-2">
                                <input type="text" id="dbUrl" value="${profile.cloudConfig?.databaseURL || ''}" placeholder="Database URL" class="admin-input">
                                <input type="text" id="dbProjectId" value="${profile.cloudConfig?.projectId || ''}" placeholder="Project ID" class="admin-input">
                            </div>
                            <button type="submit" class="btn btn-primary glow-btn" style="width: max-content;">Save Cloud Config</button>
                        </form>
                        
                        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-glass);">
                            <h4>Quick Hardware Hint 💡</h4>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-tertiary);">
                                To get your keys: Go to <a href="https://console.firebase.google.com/" target="_blank" style="color: var(--brand-main);">Firebase Console</a> &rarr; Create Project &rarr; Project Settings &rarr; Your Apps &rarr; Web.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    bindAdminEvents(container);
}

function bindAdminEvents(container) {
    const tabs = document.querySelectorAll('.admin-tab');
    const panels = document.querySelectorAll('.admin-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.style.background = 'transparent');
            e.target.style.background = 'var(--bg-glass-hover)';
            
            panels.forEach(p => p.style.display = 'none');
            const target = e.target.getAttribute('data-target');
            document.getElementById(target).style.display = 'block';
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        isAuthenticated = false;
        window.location.hash = '#hero'; // Redirect to portfolio on logout
    });

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        let profileUpdate = {
            name: document.getElementById('profName').value,
            title: document.getElementById('profTitle').value,
            education: document.getElementById('profEdu').value,
            educationDetails: document.getElementById('profEduDetails').value,
            bio: document.getElementById('profBio').value,
            internships: document.getElementById('profInternships').value,
            email: document.getElementById('profEmail').value,
            whatsapp: document.getElementById('profWa').value,
            facebook: document.getElementById('profFb').value,
            totalCases: document.getElementById('profCases').value,
            experienceYears: document.getElementById('profExp').value
        };

        const cvInput = document.getElementById('cvUpload');
        if(cvInput.files.length > 0) {
            profileUpdate.cvFile = await toBase64(cvInput.files[0]);
        }
        
        const imgInput = document.getElementById('imgUpload');
        if(imgInput.files.length > 0) {
            profileUpdate.image = await toBase64(imgInput.files[0]);
        }

        Store.updateProfile(profileUpdate);
        alert('Profile Updated Successfully!');
        renderDashboard(container);
    });

    const caseFormContainer = document.getElementById('caseFormContainer');
    const caseForm = document.getElementById('caseForm');
    
    document.getElementById('addCaseBtn').addEventListener('click', () => { 
        document.getElementById('caseEditId').value = '';
        caseForm.reset();
        document.getElementById('caseSubmitBtn').textContent = 'Save Case';
        caseFormContainer.style.display = 'block'; 
    });
    
    document.getElementById('cancelCaseBtn').addEventListener('click', () => { 
        caseFormContainer.style.display = 'none'; 
        caseForm.reset(); 
    });

    caseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('caseEditId').value;
        const fileInput = document.getElementById('caseImage');
        
        let imageBase64;
        if(fileInput.files.length > 0) {
            imageBase64 = await toBase64(fileInput.files[0]);
        } else if (!editId) {
            return alert('Image is required for new cases');
        }

        const caseData = {
            title: document.getElementById('caseTitle').value,
            description: document.getElementById('caseDesc').value,
            modalityId: document.getElementById('caseModality').value,
            tags: document.getElementById('caseTags').value.split(',').map(t => t.trim()).filter(Boolean),
            gallery: document.getElementById('caseGalleryLinks').value.split('\n').map(l => l.trim()).filter(Boolean),
            isFeatured: document.getElementById('caseFeatured').checked
        };
        
        if (imageBase64) caseData.image = imageBase64;

        if (editId) {
            Store.updateCase(editId, caseData);
        } else {
            Store.addCase(caseData);
        }
        renderDashboard(container);
    });

    document.querySelectorAll('.edit-case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const c = Store.getCases().find(x => x.id === id);
            if(c) {
                document.getElementById('caseEditId').value = c.id;
                document.getElementById('caseTitle').value = c.title;
                document.getElementById('caseDesc').value = c.description;
                document.getElementById('caseModality').value = c.modalityId;
                document.getElementById('caseTags').value = (c.tags || []).join(', ');
                document.getElementById('caseGalleryLinks').value = (c.gallery || []).join('\n');
                document.getElementById('caseFeatured').checked = c.isFeatured || false;
                document.getElementById('caseSubmitBtn').textContent = 'Update Case';
                caseFormContainer.style.display = 'block';
                document.getElementById('panel-cases').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.delete-case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("Are you sure you want to delete this case?")) {
                Store.deleteCase(e.target.closest('button').getAttribute('data-id'));
                renderDashboard(container);
            }
        });
    });

    const expFormContainer = document.getElementById('expFormContainer');
    const expForm = document.getElementById('expForm');

    document.getElementById('addExpBtn').addEventListener('click', () => { 
        document.getElementById('expEditId').value = '';
        expForm.reset();
        document.getElementById('expForm').reset();
        document.getElementById('expSubmitBtn').textContent = 'Save Experience';
        expFormContainer.style.display = 'block';
        document.getElementById('expMediaHint').textContent = 'Optional: Add an image or video for this experience.';
    });
    
    document.getElementById('cancelExpBtn').addEventListener('click', () => { 
        expFormContainer.style.display = 'none'; 
        expForm.reset(); 
    });

    document.getElementById('expForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('expEditId').value;
        
        let expData = {
            hospitalName: document.getElementById('expName').value,
            dates: document.getElementById('expDate').value,
            description: document.getElementById('expDesc').value,
            icon: document.getElementById('expIcon').value
        };

        const mediaInput = document.getElementById('expMedia');
        if(mediaInput.files.length > 0) {
            expData.media = await toBase64(mediaInput.files[0]);
        } else if (id) {
            const existing = Store.getExperience().find(ex => ex.id === id);
            if(existing) expData.media = existing.media;
        }

        if (id) {
            Store.updateExperience(id, expData);
        } else {
            Store.addExperience(expData);
        }
        
        renderDashboard(container);
    });

    document.getElementById('dbForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = {
            apiKey: document.getElementById('dbApiKey').value,
            authDomain: document.getElementById('dbAuthDomain').value,
            databaseURL: document.getElementById('dbUrl').value,
            projectId: document.getElementById('dbProjectId').value
        };
        Store.updateCloudConfig(config);
        alert("Cloud configuration saved. Refreshing to initialize...");
        window.location.reload();
    });

    document.querySelectorAll('.edit-exp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const ex = Store.getExperience().find(x => x.id === id);
            if (ex) {
                document.getElementById('expEditId').value = ex.id;
                document.getElementById('expName').value = ex.hospitalName;
                document.getElementById('expDate').value = ex.dates || '';
                document.getElementById('expDesc').value = ex.description;
                document.getElementById('expIcon').value = ex.icon;
                document.getElementById('expSubmitBtn').textContent = 'Update Experience';
                expFormContainer.style.display = 'block';
                document.getElementById('panel-experience').scrollIntoView({ behavior: 'smooth' });
                document.getElementById('expMediaHint').textContent = 'Leave blank to keep existing media.';
            }
        });
    });

    document.querySelectorAll('.delete-exp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("Delete this experience?")) {
                Store.deleteExperience(e.target.closest('button').getAttribute('data-id'));
                renderDashboard(container);
            }
        });
    });

    const modFormContainer = document.getElementById('modFormContainer');
    const modForm = document.getElementById('modForm');

    document.getElementById('addModBtn').addEventListener('click', () => { 
        document.getElementById('modEditId').value = '';
        modForm.reset();
        document.getElementById('modId').disabled = false;
        document.getElementById('modSubmitBtn').textContent = 'Save Modality';
        modFormContainer.style.display = 'block'; 
    });

    document.getElementById('cancelModBtn').addEventListener('click', () => { 
        modFormContainer.style.display = 'none'; 
        modForm.reset(); 
    });

    modForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('modEditId').value;
        const modData = {
            name: document.getElementById('modName').value,
            icon: document.getElementById('modIcon').value
        };

        if (editId) {
            Store.updateModality(editId, modData);
        } else {
            modData.id = document.getElementById('modId').value.toLowerCase().replace(/\s+/g, '-');
            Store.addModality(modData);
        }
        renderDashboard(container);
    });

    document.querySelectorAll('.edit-mod-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const m = Store.getModalities().find(x => x.id === id);
            if(m) {
                document.getElementById('modEditId').value = m.id;
                document.getElementById('modId').value = m.id;
                document.getElementById('modId').disabled = true;
                document.getElementById('modName').value = m.name;
                document.getElementById('modIcon').value = m.icon;
                document.getElementById('modSubmitBtn').textContent = 'Update Modality';
                modFormContainer.style.display = 'block';
                document.getElementById('panel-modalities').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.delete-mod-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("Delete this modality?")) {
                Store.deleteModality(e.target.closest('button').getAttribute('data-id'));
                renderDashboard(container);
            }
        });
    });

    const cvForm = document.getElementById('cvForm');
    if (cvForm) {
        cvForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('cvUploadFile');
            if(fileInput.files.length > 0) {
                const cvBase64 = await toBase64(fileInput.files[0]);
                Store.updateProfile({ cvFile: cvBase64 });
                alert('CV successfully uploaded and active!');
                renderDashboard(container);
            }
        });
        
        const cvDeleteBtn = document.getElementById('cvDeleteBtn');
        if (cvDeleteBtn) {
            cvDeleteBtn.addEventListener('click', () => {
                if(confirm('Are you sure you want to permanently delete the current CV?')) {
                    Store.updateProfile({ cvFile: null });
                    renderDashboard(container);
                }
            });
        }
    }

    document.querySelectorAll('.delete-review-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm('Are you sure you want to delete this review?')) {
                Store.deleteTestimonial(e.target.closest('button').getAttribute('data-id'));
                renderDashboard(container);
            }
        });
    });
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// ----- PORTFOLIO.JS -----
function renderPortfolio(container) {
    const profile = Store.getProfile();
    const cases = Store.getCases();
    const experience = Store.getExperience();
    const modalities = Store.getModalities();
    const services = Store.getServices();
    const testimonials = Store.getTestimonials();

    container.innerHTML = `
        <a href="#admin" style="position: fixed; bottom: 20px; right: 20px; background: var(--bg-surface); padding: 0.8rem; border-radius: 50%; box-shadow: var(--shadow-lg); z-index: 999; border: 1px solid var(--border-glass); font-size: 1.2rem; color: var(--text-primary); transition: var(--transition);">
            🔐
        </a>

        <nav id="navbar">
            <div class="container nav-container">
                <a href="#" class="logo">
                    <i class="fa-solid fa-x-ray" style="color: var(--brand-main);"></i>
                    ${profile.name.split(' ')[0]} <span>${profile.name.split(' ').slice(1).join(' ')}</span>
                </a>
                <div class="nav-links" id="navLinks">
                    <a href="#hero">Home</a>
                    <a href="#about">About</a>
                    <a href="#career">My Career</a>
                    <a href="#cases">Cases</a>
                    <a href="#services">Services</a>
                    <a href="#contact">Contact</a>
                </div>
                <div class="nav-actions">

                    <button class="btn btn-icon-only btn-secondary" id="themeToggle">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                    <button class="mobile-toggle" id="mobileToggle">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>

        <section id="hero">
            <div class="container hero-grid">
                <div class="hero-content">
                    <div class="badge fadeSlideUp">
                        <i class="fa-solid fa-stethoscope"></i> ${profile.title}
                    </div>
                    <h1 class="fadeSlideUp" style="animation-delay: 0.1s">Precision in <br><span style="color:var(--brand-main)">Every Pixel.</span></h1>
                    <p class="fadeSlideUp" style="animation-delay: 0.2s; margin: 1rem 0 2rem; font-size: 1.1rem; max-width: 500px;">
                        ${profile.bio}
                    </p>
                    <div class="fadeSlideUp" style="animation-delay: 0.3s; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="#cases" class="btn btn-primary"><i class="fa-solid fa-eye"></i> View Cases</a>
                        <a href="https://wa.me/${profile.whatsapp.replace('+', '')}" class="btn btn-secondary" target="_blank"><i class="fa-brands fa-whatsapp"></i> Chat Now</a>
                        ${profile.cvFile ? `<a href="${profile.cvFile}" download="cv mohamed ali.pdf" class="btn btn-primary glow-btn" style="background: rgba(45, 126, 219, 0.2); border: 1px solid var(--brand-glow);"><i class="fa-solid fa-download"></i> cv mohamed ali</a>` : ''}
                    </div>
                    
                    <div class="hero-stats fadeSlideUp" style="animation-delay: 0.4s">
                        <div class="stat-item">
                            <h3 id="count-cases">0</h3>
                            <p>Cases Analyzed</p>
                        </div>
                        <div class="stat-item">
                            <h3 id="count-exp">0</h3>
                            <p>Years Experience</p>
                        </div>
                        <div class="stat-item">
                            <h3 id="count-modalities">${modalities.length}</h3>
                            <p>Core Modalities</p>
                        </div>
                    </div>
                </div>
                <div class="hero-image float-1">
                    <img src="image/hero_premium.png" alt="${profile.name}">
                </div>
            </div>
        </section>

        <section id="about" class="container reveal">
            <h2><span style="color:var(--brand-main)">About</span> Me</h2>
            <div class="grid-2" style="gap: 4rem; align-items: center;">
                <div>
                    <p style="font-size: 1.1rem; margin-bottom: 2rem;">${profile.bio}</p>
                    ${profile.cvFile ? `<a href="${profile.cvFile}" download="cv mohamed ali.pdf" class="btn btn-primary glow-btn" style="margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-download"></i> cv mohamed ali</a>` : ''}
                    <div class="grid-2">
                        <div class="glass-panel" style="padding: 1rem; display: flex; align-items: center; gap: 1rem;">
                            <span style="font-size: 2rem;">🎓</span>
                            <div>
                                <strong>Education</strong>
                                <p style="font-size: 0.85rem; color: var(--text-tertiary);">${profile.education || ''}</p>
                            </div>
                        </div>
                        <div class="glass-panel" style="padding: 1rem; display: flex; align-items: center; gap: 1rem;">
                            <span style="font-size: 2rem;">🏆</span>
                            <div>
                                <strong>Achievements</strong>
                                <p style="font-size: 0.85rem; color: var(--text-tertiary);">${profile.educationDetails || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                     <div class="glass-card" style="padding: 2rem; border-color: var(--brand-main);">
                        <h3>Why Choose Me?</h3>
                        <ul style="list-style: none; margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                            <li><i class="fa-solid fa-check" style="color:var(--brand-main)"></i> Meticulous attention to detail</li>
                            <li><i class="fa-solid fa-check" style="color:var(--brand-main)"></i> State-of-the-art diagnostic reporting</li>
                            <li><i class="fa-solid fa-check" style="color:var(--brand-main)"></i> Commitment to patient privacy</li>
                            <li><i class="fa-solid fa-check" style="color:var(--brand-main)"></i> Fast turnaround times</li>
                        </ul>
                     </div>
                </div>
            </div>
        </section>

        <section id="career" class="career-section container reveal">
            <h2 style="text-align: center;">My <span style="color:var(--brand-main)">Career</span> Journey</h2>
            
            <div class="education-card" style="margin-top: 3rem;">
                <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🎓</span>
                <h3 style="font-size: 1.5rem; color: var(--brand-main);">${profile.education}</h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-top: 0.5rem;">${profile.educationDetails}</p>
                <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border-glass); max-width: 700px; margin-left: auto; margin-right: auto;">
                    <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">Clinical Internships</h4>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${profile.internships}</p>
                </div>
            </div>

            <h3 style="text-align: center; margin-top: 5rem;">Professional Timeline</h3>
            <div class="timeline">
                ${experience.map((exp, index) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="timeline-date">${exp.dates}</span>
                            <h4 style="font-size: 1.3rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem;">
                                <span>${exp.icon}</span> ${exp.hospitalName}
                            </h4>
                            <p style="color: var(--text-secondary); line-height: 1.6;">${exp.description}</p>
                            ${exp.media ? `
                                <div class="timeline-media">
                                    ${exp.media.startsWith('data:video') ? `<video src="${exp.media}" controls></video>` : `<img src="${exp.media}" alt="${exp.hospitalName}">`}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <h3 style="text-align: center; margin-top: 6rem;">Technical Expertise & Modalities</h3>
            <div class="skills-grid">
                ${modalities.map(m => `
                    <div class="glass-card skill-card">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">${m.icon}</span>
                        <h4 style="font-size: 1.1rem;">${m.name}</h4>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="cases" class="container reveal">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
                <h2>Interactive <span style="color:var(--brand-main)">Cases</span> Gallery</h2>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="text" id="caseSearch" placeholder="🔍 Search cases..." style="padding: 0.75rem 1rem; border-radius: 50px; background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); outline: none;">
                    <button class="btn btn-secondary filter-btn active" data-filter="all">All</button>
                    ${modalities.map(m => `
                        <button class="btn btn-secondary filter-btn" data-filter="${m.id}">${m.name}</button>
                    `).join('')}
                </div>
            </div>

            <div class="grid-3 cases-grid">
                ${cases.map(c => `
                    <div class="glass-card case-card" data-id="${c.id}" data-modality="${c.modalityId}" data-title="${c.title.toLowerCase()}">
                        <div class="case-modality">
                            ${modalities.find(m => m.id === c.modalityId)?.icon} ${modalities.find(m => m.id === c.modalityId)?.name}
                        </div>
                        ${c.isFeatured ? '<div style="position: absolute; top: 1rem; left: 1rem; background: rgba(234, 179, 8, 0.9); color: #fff; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; box-shadow: var(--shadow-md); z-index: 2; backdrop-filter: blur(4px);">⭐ Featured</div>' : ''}
                        <div class="case-media-container">
                            ${(() => {
                                const media = c.image;
                                const youtubeId = getYoutubeId(media);
                                if (youtubeId) {
                                    return `
                                        <div class="youtube-placeholder" style="background: #000; height: 250px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                                            <img src="https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7;">
                                            <i class="fa-brands fa-youtube" style="font-size: 4rem; color: #ff0000; position: absolute; z-index: 2; text-shadow: 0 0 20px rgba(0,0,0,0.5);"></i>
                                            <div style="position: absolute; inset: 0; background: linear-gradient(transparent, rgba(0,0,0,0.5));"></div>
                                        </div>`;
                                }
                                return (media.endsWith('.mp4') || media.startsWith('data:video')) ? 
                                    `<video src="${media}" class="case-image" muted loop playsinline></video>` : 
                                    `<img src="${media}" alt="${c.title}" class="case-image">`;
                            })()}
                            ${c.gallery && c.gallery.length > 1 ? `<div class="gallery-badge"><i class="fa-solid fa-images"></i> ${c.gallery.length} Media</div>` : ''}
                        </div>
                        <div class="case-content">
                            <h4>${c.title}</h4>
                            <p style="font-size: 0.9rem; margin: 0.5rem 0 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.description}</p>
                            <div style="margin-bottom: 1rem;">
                                ${getYoutubeId(c.image) || (c.gallery && c.gallery.some(l => getYoutubeId(l))) ? 
                                    `<span class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.8rem; width: 100%; justify-content: center;">
                                        <i class="fa-solid fa-play"></i> Watch Case
                                     </span>` : 
                                    `<span class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.8rem; width: 100%; justify-content: center;">
                                        <i class="fa-solid fa-image"></i> View Details
                                     </span>`
                                }
                            </div>
                            <div class="case-tags">
                                ${c.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <section id="services" class="container reveal">
            <h2>Clinical <span style="color:var(--brand-main)">Services</span></h2>
            <div class="grid-2" style="margin-top: 3rem;">
                ${services.map(srv => `
                    <div class="glass-card" style="padding: 2rem; display: flex; gap: 1.5rem; align-items: flex-start;">
                        <span style="font-size: 2.5rem;">${srv.icon}</span>
                        <div>
                            <h4 style="font-size: 1.25rem;">${srv.title}</h4>
                            <p style="margin-top: 0.5rem; font-size: 0.95rem;">${srv.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="testimonials" class="container reveal">
            <h2 style="text-align: center;"><span style="color:var(--brand-main)">Patient</span> Feedback</h2>
            <div class="grid-2" style="margin-top: 3rem;">
                ${testimonials.map(t => `
                    <div class="glass-card" style="padding: 2rem; position: relative;">
                        <i class="fa-solid fa-quote-left" style="position: absolute; top: 1.5rem; right: 1.5rem; font-size: 3rem; color: var(--border-glass);"></i>
                        <p style="font-size: 1.1rem; font-style: italic; margin-bottom: 1.5rem; position: relative; z-index: 1;">"${t.feedback}"</p>
                        <strong>- ${t.patientName}</strong>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="leave-review" class="container reveal">
            <div class="glass-card form-container-anim" style="max-width: 600px; margin: 4rem auto 0; padding: 2rem; border-color: var(--brand-main); box-shadow: var(--shadow-md);">
                <h3 style="text-align: center; margin-bottom: 1.5rem;">Leave a Review</h3>
                <form id="reviewForm" style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="text" id="revName" placeholder="Your Name" required style="width: 100%; padding: 1rem; background: var(--bg-base); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: var(--border-radius); outline: none;">
                    <select id="revRating" required style="width: 100%; padding: 1rem; background: var(--bg-base); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: var(--border-radius); outline: none;">
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="3">⭐⭐⭐ Average</option>
                        <option value="2">⭐⭐ Poor</option>
                        <option value="1">⭐ Terrible</option>
                    </select>
                    <textarea id="revFeedback" placeholder="Your Feedback" required rows="3" style="width: 100%; padding: 1rem; background: var(--bg-base); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: var(--border-radius); outline: none;"></textarea>
                    <button type="submit" class="btn btn-primary glow-btn" style="align-self: flex-start;">Submit Review</button>
                    <p id="reviewSuccessMsg" style="color: #10b981; margin-top: 0.5rem; display: none;">Thank you! Your review has been submitted successfully.</p>
                </form>
            </div>
        </section>

        <section id="contact" class="container reveal" style="text-align: center;">
            <h2>Get In <span style="color:var(--brand-main)">Touch</span></h2>
            <p style="max-width: 600px; margin: 0 auto 3rem;">Ready to discuss a case or need a professional radiologic consultation? Reach out immediately through WhatsApp or email.</p>
            
            <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
                <a href="https://wa.me/${profile.whatsapp.replace('+', '')}" target="_blank" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
                    <i class="fa-brands fa-whatsapp" style="font-size: 1.5rem;"></i> WhatsApp Me
                </a>
                <a href="mailto:${profile.email}" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1.1rem;">
                    <i class="fa-solid fa-envelope" style="font-size: 1.2rem;"></i> Email Me
                </a>
                <a href="${profile.facebook}" target="_blank" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1.1rem;">
                    <i class="fa-brands fa-facebook" style="font-size: 1.2rem;"></i> Facebook
                </a>
            </div>
        </section>

        <a href="https://wa.me/${profile.whatsapp.replace('+', '')}" target="_blank" class="floating-wa" title="Chat on WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
        </a>

        <div id="caseModal" class="modal-overlay">
            <div class="modal-container glass-card">
                <button class="modal-close" id="closeModalBtn">&times;</button>
                <div id="modalBody" class="modal-body">
                    <!-- Dynamic content here -->
                </div>
            </div>
        </div>

        <footer style="background: var(--bg-surface); padding: 4rem 0; text-align: center; border-top: 1px solid var(--border-glass);">
            <div class="container">
                <p style="color: var(--text-tertiary); margin-bottom: 1.5rem;">
                    <i class="fa-solid fa-shield-halved"></i> "All medical images are anonymized to protect patient privacy and comply with medical ethics."
                </p>
                <div style="display: flex; justify-content: center; margin-bottom: 2rem;">
                    <div class="visitor-counter">
                        <span class="pulse-dot"></span>
                        <span id="visitorCount">${Store.getData().visitorCount || 0}</span> Views
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <p>&copy; ${new Date().getFullYear()} ${profile.name}. All rights reserved.<span class="hidden-heart" id="mayarTrigger">❤</span></p>
                    <div style="display: flex; gap: 1.5rem; align-items: center;">
                        <a href="#admin" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-tertiary); font-size: 0.9rem; transition: color 0.3s;" id="footerAdminLock">
                            <i class="fa-solid fa-lock" style="font-size: 0.8rem;"></i> Admin
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Store.addTestimonial({
                patientName: document.getElementById('revName').value,
                rating: parseInt(document.getElementById('revRating').value, 10),
                feedback: document.getElementById('revFeedback').value
            });
            document.getElementById('reviewSuccessMsg').style.display = 'block';
            reviewForm.reset();
            setTimeout(() => {
                renderPortfolio(container); 
            }, 1000);
        });
    }

    initializeInteractions();
}

function initializeInteractions() {
    const themeBtn = document.getElementById('themeToggle');
    const root = document.documentElement;
    
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        Store.updateSettings({ theme: newTheme });
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    const mobileBtn = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.style.zIndex = "1001"; // Ensure button is above the menu
        mobileBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu when a link is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            mobileBtn.style.zIndex = ""; // Reset z-index
        });
    });

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if(window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cases = document.querySelectorAll('.case-card');
    const searchInput = document.getElementById('caseSearch');
    
    let activeFilter = 'all';

    const renderVisibilities = () => {
        const query = searchInput.value.toLowerCase();
        cases.forEach(c => {
            const matchesFilter = activeFilter === 'all' || c.getAttribute('data-modality') === activeFilter;
            const matchesSearch = c.getAttribute('data-title').includes(query);
            
            if (matchesFilter && matchesSearch) {
                c.style.display = 'block';
                setTimeout(() => c.style.opacity = '1', 50);
            } else {
                c.style.opacity = '0';
                setTimeout(() => c.style.display = 'none', 300);
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.getAttribute('data-filter');
            renderVisibilities();
        });
    });

    if(searchInput) {
        searchInput.addEventListener('input', renderVisibilities);
    }

    // Modal Logic
    const caseModal = document.getElementById('caseModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBody = document.getElementById('modalBody');

    const openCaseModal = (caseId) => {
        const c = Store.getCases().find(x => x.id === caseId);
        if(!c) return;

        const modality = Store.getModalities().find(m => m.id === c.modalityId);
        const gallery = c.gallery || [c.image];
        let currentIdx = 0;


        const updateModalMedia = () => {
            const media = gallery[currentIdx];
            let mediaHtml;
            
            const youtubeId = getYoutubeId(media);
            if (youtubeId) {
                // Use a more robust embed URL with mute=1 to ensure autoplay works and origin for safety
                const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
                mediaHtml = `
                    <div class="video-container" style="position:relative; width:100%; height:500px; background:#000;">
                        <iframe src="${embedUrl}" 
                            class="enlarged-media" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen 
                            style="width: 100%; height: 100%; border:none;">
                        </iframe>
                        <div style="position:absolute; bottom:10px; right:10px;">
                            <a href="https://youtube.com/watch?v=${youtubeId}" target="_blank" class="btn btn-secondary" style="font-size:0.7rem; padding:0.4rem 0.8rem; background:rgba(0,0,0,0.6); color:#fff; border:none;">
                                <i class="fa-brands fa-youtube"></i> Open on YouTube
                            </a>
                        </div>
                    </div>`;
            } else if (media.endsWith('.mp4') || media.startsWith('data:video')) {
                mediaHtml = `<video src="${media}" controls autoplay muted class="enlarged-media"></video>`;
            } else {
                mediaHtml = `<img src="${media}" alt="${c.title}" class="enlarged-media">`;
            }
            
            modalBody.querySelector('.modal-media').innerHTML = `
                ${mediaHtml}
                ${gallery.length > 1 ? `
                    <button class="gallery-nav prev" id="prevMedia"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="gallery-nav next" id="nextMedia"><i class="fa-solid fa-chevron-right"></i></button>
                    <div class="gallery-counter">${currentIdx + 1} / ${gallery.length}</div>
                ` : ''}
            `;

            // Re-bind arrows
            if(gallery.length > 1) {
                document.getElementById('prevMedia').addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIdx = (currentIdx - 1 + gallery.length) % gallery.length;
                    updateModalMedia();
                });
                document.getElementById('nextMedia').addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIdx = (currentIdx + 1) % gallery.length;
                    updateModalMedia();
                });
            }
        };

        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="case-modality" style="position:static; margin-bottom: 1rem; display: inline-block;">
                    ${modality?.icon} ${modality?.name}
                </div>
                ${c.isFeatured ? '<span class="badge" style="margin-left: 1rem;">⭐ Featured</span>' : ''}
            </div>
            <div class="modal-media">
                <!-- Media injected by updateModalMedia -->
            </div>
            <div class="modal-info">
                <h2 style="color: var(--brand-main); margin: 1.5rem 0 1rem; font-size: 1.8rem;">${c.title}</h2>
                <div style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.8; margin-bottom: 1.5rem; white-space: pre-line;">${c.description}</div>
                <div class="case-tags">
                    ${c.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                </div>
            </div>
        `;
        
        updateModalMedia();
        caseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCaseModal = () => {
        caseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Pause video if any
        const video = modalBody.querySelector('video');
        if(video) video.pause();
    };

    document.querySelectorAll('.case-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't open if clicked on a direct child link or button if any (none currently)
            const id = card.getAttribute('data-id');
            if(id) openCaseModal(id);
        });
    });

    // --- REFACTORED MODAL EVENTS ---
    // Use delegation on the modal itself for better reliability
    if (caseModal) {
        caseModal.addEventListener('click', (e) => {
            // Close if clicking the background OR the close button
            if (e.target.id === 'caseModal' || e.target.id === 'closeModalBtn' || e.target.closest('#closeModalBtn')) {
                closeCaseModal();
            }
        });
    }

    // --- PREMIUM FEATURES ---
    
    // 1. Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .case-card, .btn')) {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursor.style.background = 'var(--brand-glow)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .case-card, .btn')) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'var(--brand-main)';
            }
        });
    }



    // 3. Counter Animation
    const animateValue = (id, start, end, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString() + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Trigger counters on reveal
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'count-cases') animateValue('count-cases', 0, parseInt(Store.getProfile().totalCases), 2000);
                if (entry.target.id === 'count-exp') animateValue('count-exp', 0, parseInt(Store.getProfile().experienceYears), 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (document.getElementById('count-cases')) counterObserver.observe(document.getElementById('count-cases'));
    if (document.getElementById('count-exp')) counterObserver.observe(document.getElementById('count-exp'));

    // 4. Mayar Easter Egg
    const mayarTrigger = document.getElementById('mayarTrigger');
    if (mayarTrigger) {
        mayarTrigger.addEventListener('click', () => {
            const pass = prompt("Enter Secret Key:");
            if (pass && pass.toLowerCase() === 'mayar') {
                triggerMayarSurprise();
            }
        });
    }

    function triggerMayarSurprise() {
        // Create Love Overlay if not exists
        let overlay = document.getElementById('loveOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loveOverlay';
            overlay.className = 'love-overlay';
            overlay.innerHTML = '<div class="love-message">I Really Love You ❤️</div>';
            document.body.appendChild(overlay);
        }

        // Show Overlay
        overlay.classList.add('active');
        
        // Falling Roses - Adaptive count for mobile
        const isMobile = window.innerWidth < 768;
        const roseCount = isMobile ? 30 : 70;
        const symbols = ['🌹', '🌸', '❤️', '🌺', '🌷', '✨', '💖', '💘', '🤍'];
        for (let i = 0; i < roseCount; i++) {
            setTimeout(() => {
                const rose = document.createElement('div');
                rose.className = 'rose-particle';
                rose.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                rose.style.left = Math.random() * 100 + 'vw';
                rose.style.animationDuration = (Math.random() * 4 + 2) + 's';
                rose.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
                rose.style.opacity = Math.random() * 0.5 + 0.5;
                document.body.appendChild(rose);
                
                // Remove after animation
                setTimeout(() => rose.remove(), 5000);
            }, i * 100);
        }

        // Hide Overlay after 6 seconds
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 6000);
    }
}

// ----- APP.JS (ROUTER) -----
class AppRouter {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.currentView = null;
        window.addEventListener('hashchange', () => this.route());
        this.route();
    }

    route() {
        const hash = window.location.hash || '#hero';
        const targetView = hash.startsWith('#admin') ? 'admin' : 'portfolio';
        
        if (this.currentView !== targetView) {
            this.currentView = targetView;
            if (targetView === 'admin') {
                renderAdmin(this.appContainer);
                window.scrollTo(0,0);
            } else {
                renderPortfolio(this.appContainer);
                window.scrollTo(0,0);
            }
        }

        if (targetView === 'portfolio' && hash && hash !== '#' && hash !== '#hero') {
            setTimeout(() => {
                const target = document.querySelector(hash);
                if(target) {
                    const navHeight = document.getElementById('navbar').offsetHeight || 0;
                    const offsetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 50);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AppRouter();
});
