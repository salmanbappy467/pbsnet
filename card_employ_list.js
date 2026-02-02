/**
 * 📂 File: card_employ_list.js
 * 🔍 Directory Search (Gemini Themed)
 */

window.DirectoryApp = {
    config: {
        id: 'employee_dir',
        title: 'Employee Directory',
        allowedPosts: ['All'],
        action: () => DirectoryApp.initView()
    },

    state: {
        offset: 0,
        limit: 10,
        isLoading: false
    },

    initView: function() {
        // Hide other views
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let dirView = document.getElementById('view-directory');
        if (!dirView) {
            const main = document.querySelector('main');
            dirView = document.createElement('div');
            dirView.id = 'view-directory';
            dirView.className = 'fade-in space-y-6 pb-20'; // Bottom padding for scrolling
            
            dirView.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#2e2f30] flex items-center justify-center text-blue-600 dark:text-[#a8c7fa]">
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Directory</h2>
                    </div>
                    <button onclick="DirectoryApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#2e2f30] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-[#c4c7c5] hover:text-red-500 transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="bg-white dark:bg-[#1e1f20] p-3 rounded-2xl border border-slate-200 dark:border-[#444746] grid grid-cols-1 md:grid-cols-3 gap-3 shadow-sm">
                    
                    <div class="relative group">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#c4c7c5]"></i>
                        <input type="text" id="dir-search" placeholder="Search name..." 
                            class="w-full bg-slate-50 dark:bg-[#2e2f30] text-slate-800 dark:text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#a8c7fa] border border-transparent transition placeholder:text-slate-400 dark:placeholder:text-[#c4c7c5]/50" 
                            onkeyup="DirectoryApp.handleSearch()">
                    </div>
                    
                    <div class="relative">
                        <select id="dir-pbs" 
                            class="w-full bg-slate-50 dark:bg-[#2e2f30] text-slate-800 dark:text-white pl-4 pr-10 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#a8c7fa] border border-transparent appearance-none transition" 
                            onchange="DirectoryApp.handleSearch()">
                            <option value="">All PBS</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                    
                    <div class="relative">
                        <select id="dir-post" 
                            class="w-full bg-slate-50 dark:bg-[#2e2f30] text-slate-800 dark:text-white pl-4 pr-10 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#a8c7fa] border border-transparent appearance-none transition" 
                            onchange="DirectoryApp.handleSearch()">
                            <option value="">All Posts</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                </div>

                <div id="dir-results" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <div class="col-span-full text-center py-16 text-slate-400 dark:text-[#c4c7c5]">
                        <i class="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-30"></i>
                        <p>Search or select filters to view employees.</p>
                    </div>
                </div>

                <div id="dir-load-more" class="hidden text-center pt-6">
                    <button onclick="DirectoryApp.loadMore()" class="px-6 py-2.5 rounded-full bg-blue-50 dark:bg-[#2e2f30] text-blue-600 dark:text-[#a8c7fa] font-bold hover:bg-blue-100 dark:hover:bg-[#333537] transition text-sm">
                        Load More Results
                    </button>
                </div>
            `;
            main.appendChild(dirView);
            
            // Populate Filters
            if (typeof PBS_LIST !== 'undefined') {
                const sel = document.getElementById('dir-pbs');
                PBS_LIST.forEach(p => { 
                    const o = document.createElement('option'); o.value = p; o.text = p; sel.add(o); 
                });
            }
            if (typeof DESIGNATION_LIST !== 'undefined') {
                const postSel = document.getElementById('dir-post');
                DESIGNATION_LIST.forEach(d => {
                    const o = document.createElement('option'); o.value = d; o.text = d; postSel.add(o);
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
        this.timer = setTimeout(() => {
            this.state.offset = 0;
            this.fetchData(true);
        }, 500);
    },

    loadMore: function() {
        this.state.offset += this.state.limit;
        this.fetchData(false);
    },

    fetchData: async function(isReset) {
        const queryText = document.getElementById('dir-search').value.trim();
        const pbs = document.getElementById('dir-pbs').value;
        const post = document.getElementById('dir-post').value;
        const container = document.getElementById('dir-results');
        const loadMoreBtn = document.getElementById('dir-load-more');

        if (!queryText && !pbs && !post) {
            container.innerHTML = `<div class="col-span-full text-center py-16 text-slate-400 dark:text-[#c4c7c5]">
                <i class="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-30"></i>
                <p>Start searching to find colleagues.</p>
            </div>`;
            loadMoreBtn.classList.add('hidden');
            return;
        }

        if (this.state.isLoading) return;
        this.state.isLoading = true;

        if (isReset) {
            container.innerHTML = '<p class="text-center col-span-full text-slate-400 dark:text-[#c4c7c5] py-10"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Searching...</p>';
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...';
        }

        try {
            let q = [];
            if (pbs) q.push(Appwrite.Query.equal('pbs_name', pbs));
            if (post) q.push(Appwrite.Query.equal('post_name', post));
            if (queryText) q.push(Appwrite.Query.search('full_name', queryText)); 

            q.push(Appwrite.Query.limit(this.state.limit));
            q.push(Appwrite.Query.offset(this.state.offset));
            q.push(Appwrite.Query.orderDesc('$createdAt'));

            const res = await databases.listDocuments(DB_ID, COLL_PROFILE, q);
            const users = res.documents;

            if (isReset) container.innerHTML = ''; 
            
            if (users.length === 0 && isReset) {
                container.innerHTML = `<div class="col-span-full text-center py-16 text-slate-400 dark:text-[#c4c7c5]">No employees found matching criteria.</div>`;
                loadMoreBtn.classList.add('hidden');
            } else {
                users.forEach(u => {
                    let pic = `https://ui-avatars.com/api/?name=${u.full_name}&background=random`;
                    if(u.profile_pic_id) {
                        try { pic = storage.getFileView(BUCKET_ID, u.profile_pic_id).href; } catch(e){}
                    }

                    const card = document.createElement('div');
                    // ✅ Updated Card Style: Solid, Clean, Hover Border
                    card.className = "bg-white dark:bg-[#1e1f20] p-4 rounded-2xl cursor-pointer border border-slate-200 dark:border-[#444746] hover:border-blue-400 dark:hover:border-[#a8c7fa] transition flex items-center gap-4 group";
                    
                    card.innerHTML = `
                        <img src="${pic}" class="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-[#444746]">
                        <div class="min-w-0 flex-1">
                            <h4 class="font-bold text-sm text-slate-800 dark:text-[#e3e3e3] truncate group-hover:text-blue-600 dark:group-hover:text-[#a8c7fa] transition">${u.full_name}</h4>
                            <p class="text-xs font-bold text-blue-600 dark:text-[#a8c7fa] uppercase mt-0.5">${u.post_name || 'N/A'}</p>
                            <p class="text-[10px] text-slate-400 dark:text-[#c4c7c5] truncate mt-1"><i class="fa-solid fa-building-columns mr-1"></i>${u.pbs_name || '-'}</p>
                        </div>
                        <div class="text-slate-300 dark:text-[#444746] group-hover:text-blue-500 dark:group-hover:text-[#a8c7fa] transition">
                            <i class="fa-solid fa-chevron-right"></i>
                        </div>
                    `;
                    card.onclick = () => DirectoryApp.showProfileModal(u, pic);
                    container.appendChild(card);
                });

                if (res.total > (this.state.offset + users.length)) {
                    loadMoreBtn.classList.remove('hidden');
                    loadMoreBtn.innerHTML = `<button onclick="DirectoryApp.loadMore()" class="px-6 py-2.5 rounded-full bg-blue-50 dark:bg-[#2e2f30] text-blue-600 dark:text-[#a8c7fa] font-bold hover:bg-blue-100 dark:hover:bg-[#333537] transition text-sm">Load More</button>`;
                } else {
                    loadMoreBtn.classList.add('hidden');
                }
            }
        } catch (err) {
            console.error(err);
            if(isReset) container.innerHTML = `<p class="text-center text-red-400 col-span-full">Error: ${err.message}</p>`;
        } finally {
            this.state.isLoading = false;
        }
    },

    // ✅ GEMINI STYLE PROFILE MODAL
    showProfileModal: function(u, picUrl) {
        let personal = {};
        try { 
            if(typeof u.personal_json === 'string') {
                personal = JSON.parse(u.personal_json || '{}');
            } else {
                personal = u.personal_json || {};
            }
        } catch(e){}

        let waLink = null;
        if(personal.whatsapp) waLink = `https://wa.me/${personal.whatsapp.replace(/[^0-9]/g, '')}`;
        let fbLink = personal.facebook;
        if(fbLink && !fbLink.startsWith('http')) fbLink = `https://${fbLink}`;

        const modal = document.createElement('div');
        // Dark Overlay
        modal.className = "fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in";
        
        modal.innerHTML = `
            <div class="w-full max-w-sm bg-white dark:bg-[#1e1f20] rounded-[2rem] relative overflow-hidden shadow-2xl border border-slate-200 dark:border-[#444746] flex flex-col max-h-[90vh]">
                
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 text-slate-600 dark:text-[#e3e3e3] flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                
                <div class="overflow-y-auto p-6 scroll-smooth">
                    
                    <div class="text-center mt-4">
                        <img src="${picUrl}" class="w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-[#131314] shadow-lg object-cover bg-slate-100 dark:bg-[#2e2f30]">
                        
                        <h2 class="text-xl font-bold mt-4 text-slate-800 dark:text-[#e3e3e3]">${u.full_name}</h2>
                        <span class="bg-blue-50 dark:bg-[#2e2f30] text-blue-600 dark:text-[#a8c7fa] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-2 inline-block border border-blue-100 dark:border-[#444746]">
                            ${u.post_name || 'N/A'}
                        </span>
                    
                    </div>

                    <div class="mt-4 space-y-3 text-left">


                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#2e2f30] border border-slate-100 dark:border-[#444746]">
                            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-[#131314] text-purple-600 dark:text-[#a8c7fa] flex items-center justify-center"><i class="fa-solid fa-map-location-dot"></i></div>
                            <div>
                                <p class="text-[10px] text-slate-400 dark:text-[#c4c7c5] uppercase font-bold">Office</p>
                                <p class="text-sm font-bold text-slate-700 dark:text-[#e3e3e3]">${u.office_name || 'HQ'}<br/>${u.pbs_name || '-'}</p>
                            </div>
                        </div>
                     


                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#2e2f30] border border-slate-100 dark:border-[#444746]">
                            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#131314] text-blue-600 dark:text-[#a8c7fa] flex items-center justify-center"><i class="fa-solid fa-phone"></i></div>
                            <div>
                                <p class="text-[10px] text-slate-400 dark:text-[#c4c7c5] uppercase font-bold">Mobile</p>
                                <a href="tel:${u.mobile}" class="text-sm font-bold text-slate-700 dark:text-[#e3e3e3] hover:underline font-mono">${u.mobile || 'N/A'}</a>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#2e2f30] border border-slate-100 dark:border-[#444746]">
                            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-[#131314] text-purple-600 dark:text-[#a8c7fa] flex items-center justify-center"><i class="fa-solid fa-map-location-dot"></i></div>
                            <div>
                                <p class="text-[10px] text-slate-400 dark:text-[#c4c7c5] uppercase font-bold">Home District</p>
                                <p class="text-sm font-bold text-slate-700 dark:text-[#e3e3e3]">${personal.own_district || 'Not Set'}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#2e2f30] border border-slate-100 dark:border-[#444746]">
                            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-[#131314] text-emerald-600 dark:text-[#a8c7fa] flex items-center justify-center"><i class="fa-solid fa-calendar-day"></i></div>
                            <div>
                                <p class="text-[10px] text-slate-400 dark:text-[#c4c7c5] uppercase font-bold">Joining Date</p>
                                <p class="text-sm font-bold text-slate-700 dark:text-[#e3e3e3]">${personal.joining_date || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-slate-50 dark:bg-[#2e2f30] border-t border-slate-100 dark:border-[#444746] flex gap-3">
                    <a href="tel:${u.mobile}" class="flex-1 bg-slate-900 dark:bg-[#a8c7fa] text-white dark:text-[#131314] py-3 rounded-xl font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-phone"></i> Call
                    </a>
                    ${waLink ? `<a href="${waLink}" target="_blank" class="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"><i class="fa-brands fa-whatsapp text-lg"></i> Chat</a>` : ''}
                    ${fbLink ? `<a href="${fbLink}" target="_blank" class="w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition"><i class="fa-brands fa-facebook-f"></i></a>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};