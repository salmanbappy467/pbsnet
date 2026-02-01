/**
 * 📂 File: card_employ_list.js
 * 📝 Description: Employee Directory with Full Profile Fetching
 */

const DirectoryApp = {
    config: {
        id: 'employee_dir',
        title: 'Employee Directory',
        icon: 'fa-solid fa-address-book',
        color: 'bg-teal-100 text-teal-600',
        desc: 'Search officers & View full details.',
        allowedPosts: ['All'],
        action: () => DirectoryApp.initView()
    },

    initView: function() {
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let dirView = document.getElementById('view-directory');
        if (!dirView) {
            const mainContainer = document.querySelector('main');
            dirView = document.createElement('div');
            dirView.id = 'view-directory';
            dirView.className = 'fade-in space-y-6';
            
            dirView.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Employee Directory</h2>
                        <p class="text-slate-400 text-sm">Find contact details.</p>
                    </div>
                    <button onclick="DirectoryApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                    <div class="flex-grow relative">
                        <input type="text" id="dir-search" placeholder="Name, Mobile, Username..." class="modern-input pl-12" onkeyup="DirectoryApp.handleSearch()">
                        <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                    <div class="w-full md:w-1/4 relative">
                        <select id="dir-pbs" class="modern-select" onchange="DirectoryApp.fetchData()">
                            <option value="" disabled selected>Select PBS</option>
                        </select>
                    </div>
                    <div class="w-full md:w-1/4 relative">
                        <select id="dir-post" class="modern-select" onchange="DirectoryApp.fetchData()">
                            <option value="">All Designations</option>
                            <option value="GM">GM</option>
                            <option value="DGM">DGM</option>
                            <option value="AGM">AGM</option>
                            <option value="JE">Junior Engineer</option>
                            <option value="EC">Enforcement Coordinator</option>
                            <option value="Lineman">Lineman</option>
                        </select>
                    </div>
                </div>

                <div id="dir-results" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    <div class="col-span-full text-center py-10 text-slate-400">
                        <i class="fa-solid fa-magnifying-glass text-4xl mb-3 opacity-50"></i>
                        <p>Search to verify details.</p>
                    </div>
                </div>
            `;
            mainContainer.appendChild(dirView);

            if (typeof PBS_LIST !== 'undefined') {
                const pbsSelect = document.getElementById('dir-pbs');
                PBS_LIST.forEach(pbs => {
                    const opt = document.createElement('option');
                    opt.value = pbs;
                    opt.text = pbs;
                    pbsSelect.add(opt);
                });
            }
        }
        dirView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-directory').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
    },

    timer: null,
    handleSearch: function() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.fetchData(), 500);
    },

    // 1️⃣ Fetch List (Search API)
    fetchData: async function() {
        const query = document.getElementById('dir-search').value;
        const pbs = document.getElementById('dir-pbs').value;
        const designation = document.getElementById('dir-post').value;
        const container = document.getElementById('dir-results');

        if(!query && !pbs && !designation) {
             container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400"><p>Search to find people.</p></div>`;
             return;
        }

        container.innerHTML = '<p class="text-center col-span-full text-slate-400 py-4"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Searching...</p>';

        try {
            let url = `/users/search?search=${encodeURIComponent(query)}`;
            if (pbs) url += `&pbs=${encodeURIComponent(pbs)}`;
            if (designation) url += `&designation=${encodeURIComponent(designation)}`;

            const res = await apiCall(url);
            const users = res.users || [];

            container.innerHTML = ''; 

            if (users.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-10"><p class="text-slate-500 font-bold">No results found.</p></div>`;
                return;
            }

            users.forEach(u => {
                // Mapping keys from Search API
                const name = u.full_name || u.name || 'Unknown';
                const post = u.post_name || u.designation || 'N/A';
                const pbsName = u.pbs_name || u.pbs || '-';
                const avatar = u.profile_pic_url || u.pic_url || `https://ui-avatars.com/api/?name=${name}&background=random`;
                const mobileDisplay = u.mobile || 'N/A';

                const card = document.createElement('div');
                card.className = "glass-card p-4 rounded-xl cursor-pointer hover:border-blue-500 transition flex items-center gap-4 group";
                
                card.innerHTML = `
                    <img src="${avatar}" class="w-14 h-14 rounded-full object-cover border-2 border-slate-100 group-hover:border-blue-200 transition">
                    <div class="flex-grow min-w-0">
                        <h4 class="font-bold text-slate-700 dark:text-slate-200 truncate">${name}</h4>
                        <p class="text-xs text-blue-600 font-bold uppercase mb-0.5">${post}</p>
                        <p class="text-xs text-slate-400 truncate"><i class="fa-solid fa-building-columns mr-1"></i>${pbsName}</p>
                        <p class="text-xs text-slate-500 font-mono truncate"><i class="fa-solid fa-phone mr-1"></i>${mobileDisplay}</p>
                    </div>
                    <div class="text-slate-300 group-hover:text-blue-500">
                        <i class="fa-regular fa-eye"></i>
                    </div>
                `;

                // ✅ CLICK: Call Function to Fetch Full Data
                card.onclick = () => DirectoryApp.fetchAndShowProfile(u.username, u);
                
                container.appendChild(card);
            });

        } catch (err) {
            console.error(err);
            container.innerHTML = `<p class="text-center col-span-full text-red-400">Error loading data.</p>`;
        }
    },

    // 2️⃣ Fetch Full Profile Details (Profile API)
    fetchAndShowProfile: async function(username, fallbackData) {
        // If no username, show fallback data immediately
        if(!username) {
            DirectoryApp.showProfileModal(fallbackData);
            return;
        }

        // Show Global Loader
        if(typeof toggleLoader === 'function') toggleLoader(true);

        try {
            // 🔥 API CALL: Fetch Fresh Full Data
            // Note: API Call uses global `apiCall` from config.js
            const fullData = await apiCall(`/profile/${username}`);
            DirectoryApp.showProfileModal(fullData);
        } catch (e) {
            console.error("Profile Fetch Error:", e);
            // If API fails, show what we have from search
            DirectoryApp.showProfileModal(fallbackData);
        } finally {
            if(typeof toggleLoader === 'function') toggleLoader(false);
        }
    },

    // 3️⃣ Show Modal with Data
    showProfileModal: function(u) {
        const existingModal = document.getElementById('dir-profile-modal');
        if(existingModal) existingModal.remove();

        // 🛠️ KEY MAPPING (Handles both Search API & Profile API keys)
        const name = u.full_name || u.name || 'Unknown';
        const post = u.post_name || u.designation || 'N/A';
        const pbsName = u.pbs_name || u.pbs || '-';
        const office = u.office_name || u.office || '-';
        const mobile = u.mobile || "";
        const email = u.email || "-";
        const username = u.username || "-";
        const avatar = u.profile_pic_url || u.pic_url || `https://ui-avatars.com/api/?name=${name}&background=random`;
        
        // 🛠️ JSON PARSING
        let personal = {};
        if (u.personal_json) {
            if (typeof u.personal_json === 'object') {
                personal = u.personal_json;
            } else if (typeof u.personal_json === 'string') {
                try {
                    personal = JSON.parse(u.personal_json);
                } catch(e) { console.error("JSON Error", e); }
            }
        }

        // Social Links
        let fbLink = personal.facebook || null;
        if(fbLink && !fbLink.startsWith('http')) fbLink = `https://${fbLink}`;

        let waLink = null;
        if(personal.whatsapp) {
            const waNumber = personal.whatsapp.replace(/[^0-9]/g, ''); 
            waLink = `https://wa.me/${waNumber}`;
        }

        const modal = document.createElement('div');
        modal.id = 'dir-profile-modal';
        modal.className = "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in";
        
        modal.innerHTML = `
            <div class="glass-card w-full max-w-sm rounded-[2rem] overflow-hidden relative shadow-2xl bg-white dark:bg-slate-900 transform transition-all scale-100">
                <div class="h-24 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
                
                <button onclick="document.getElementById('dir-profile-modal').remove()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-500 flex items-center justify-center transition backdrop-blur-md">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="px-6 -mt-12 mb-4 text-center">
                    <img src="${avatar}" class="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover mx-auto bg-white">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white mt-2">${name}</h2>
                    <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">${post}</span>
                    <p class="text-xs text-slate-400 mt-1">@${username}</p>
                </div>

                <div class="px-6 pb-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"><i class="fa-solid fa-building-columns"></i></div>
                        <div><p class="text-[10px] text-slate-400 uppercase font-bold">PBS & Office</p><p class="text-sm font-bold text-slate-700 dark:text-slate-200">${pbsName} <span class="text-slate-300">|</span> ${office}</p></div>
                    </div>

                    <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><i class="fa-solid fa-phone"></i></div>
                        <div><p class="text-[10px] text-slate-400 uppercase font-bold">Mobile</p><a href="tel:${mobile}" class="text-sm font-bold text-blue-600 hover:underline">${mobile || 'N/A'}</a></div>
                    </div>

                    <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><i class="fa-regular fa-envelope"></i></div>
                        <div><p class="text-[10px] text-slate-400 uppercase font-bold">Email</p><p class="text-xs font-bold text-slate-700 dark:text-slate-200 break-all">${email}</p></div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                         <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Own District</p>
                            <p class="text-sm font-bold text-slate-700 dark:text-slate-200">${personal.own_district || '-'}</p>
                         </div>
                         <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Joining Date</p>
                            <p class="text-sm font-bold text-slate-700 dark:text-slate-200">${personal.joining_date || '-'}</p>
                         </div>
                    </div>
                    
                    <div class="flex gap-2 pt-2">
                        <a href="tel:${mobile}" class="flex-1 bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-lg text-center font-bold text-sm hover:opacity-90 transition"><i class="fa-solid fa-phone mr-2"></i>Call</a>
                        
                        ${waLink ? `<a href="${waLink}" target="_blank" class="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-center font-bold text-sm hover:opacity-90 transition"><i class="fa-brands fa-whatsapp mr-2"></i>WhatsApp</a>` : ''}
                        
                        ${fbLink ? `<a href="${fbLink}" target="_blank" class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center font-bold text-sm hover:opacity-90 transition"><i class="fa-brands fa-facebook-f mr-2"></i>FB</a>` : ''}
                     </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if(e.target === modal) modal.remove();
        });
    }
};