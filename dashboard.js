/**
 * 📂 File: dashboard.js
 * 🚀 Advanced Dashboard Manager with Search, Categories & Favorites
 */

// --- 1. APP CONFIGURATION ---
const appPlugins = [
    {
        id: 'directory',
        title: 'Employee Directory',
        icon: 'fa-solid fa-address-book',
        color: 'bg-teal-100 text-teal-600',
        desc: 'Search & View Profiles.',
        category: 'General',
        allowedPosts: ['All'],
        action: () => DirectoryApp.initView() // From card_employ_list.js
    },
    // dashboard.js এর appPlugins সেকশনে এটি যোগ করুন
   {
    id: 'rebpbs_automation',
    title: 'REBPBS Automation',
    icon: 'fa-solid fa-robot',
    color: 'bg-rose-100 text-rose-600',
    desc: 'Automate your tasks with REBPBS tool.',
    category: 'Automation',
    allowedPosts: ['MT', 'MTS'], // শুধুমাত্র MT এবং Admin পোস্টের জন্য    
    action: () => RebpbsApp.initView() // এটি নতুন ভিউ ওপেন করবে
     },
];

// --- 2. STATE MANAGEMENT ---
let dashboardState = {
    user: null,
    favorites: JSON.parse(localStorage.getItem('pbs_fav_apps')) || [],
    activeCategory: 'All',
    searchTerm: ''
};

// --- 3. INIT FUNCTION ---
async function initDashboard(user) {
    dashboardState.user = user;
    const viewHome = document.getElementById('view-home');
    
    // Inject Filter & Search UI if not exists
    if (!document.getElementById('dash-controls')) {
        const controls = document.createElement('div');
        controls.id = 'dash-controls';
        controls.className = "mb-8 space-y-4";
        controls.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
               
                
            </div>
            
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-end" id="category-tabs">
                </div>
        `;
        // Insert after header, before grid
        const grid = document.getElementById('plugin-grid');
        grid.parentNode.insertBefore(controls, grid);
    }

    renderCategories();
    renderCards();
}

// --- 4. RENDER LOGIC ---

function renderCategories() {
    const categories = ['All', ...new Set(appPlugins.map(app => app.category))];
    const container = document.getElementById('category-tabs');
    
    container.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" 
            class="px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${
            dashboardState.activeCategory === cat 
            ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 border-transparent' 
            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }">
            ${cat}
        </button>
    `).join('');
}

function renderCards() {
    const container = document.getElementById('plugin-grid');
    container.innerHTML = '';
    
    const userPost = dashboardState.user.post_name || "";

    // 1. Filter by Permission, Search & Category
    let filteredApps = appPlugins.filter(app => {
        // Permission Check
        const hasPermission = app.allowedPosts.includes('All') || 
                              app.allowedPosts.some(role => userPost.toLowerCase().includes(role.toLowerCase()) || role === 'Admin');
        if (!hasPermission) return false;

        // Search Check
        const matchesSearch = app.title.toLowerCase().includes(dashboardState.searchTerm.toLowerCase());
        
        // Category Check
        const matchesCategory = dashboardState.activeCategory === 'All' || app.category === dashboardState.activeCategory;

        return matchesSearch && matchesCategory;
    });

    // 2. Sort: Favorites First
    filteredApps.sort((a, b) => {
        const isFavA = dashboardState.favorites.includes(a.id);
        const isFavB = dashboardState.favorites.includes(b.id);
        return isFavB - isFavA; // True (1) comes before False (0)
    });

    if (filteredApps.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-300">No apps found matching your criteria.</div>`;
        return;
    }

    // 3. Render Cards
    filteredApps.forEach(app => {
        const isFav = dashboardState.favorites.includes(app.id);
        const badgeHtml = app.badge ? `<span class="absolute top-4 right-4 bg-red-500 text-white text-[7px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">${app.badge} New</span>` : '';

        const card = document.createElement('div');
        card.className = `relative glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition group bg-white/50 dark:bg-slate-800/50 border-2 ${isFav ? 'border-blue-200 dark:border-blue-900/50' : 'border-transparent'}`;
        
        card.innerHTML = `
            ${badgeHtml}
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-xl shadow-sm">
                    <i class="${app.icon}"></i>
                </div>
                <button onclick="toggleFavorite(event, '${app.id}')" class="text-slate-300 hover:text-yellow-400 transition transform hover:scale-110">
                    <i class="${isFav ? 'fa-solid text-yellow-400' : 'fa-regular'} fa-star text-lg"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <h3 class="font-bold text-slate-700 dark:text-slate-200 text-lg mb-1">${app.title}</h3>
                <p class="text-xs text-slate-400 dark:text-slate-400 font-medium line-clamp-2">${app.desc}</p>
            </div>
            
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span class="card-category">${app.category}</span>
                
                <div class="card-footer-icon">
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        `;

        // Card Click Action (Prevent firing when clicking Star)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                app.action();
            }
        });

        container.appendChild(card);
    });
}

// --- 5. INTERACTION HANDLERS ---

function filterDashboard(text) {
    dashboardState.searchTerm = text;
    renderCards();
}

function setCategory(cat) {
    dashboardState.activeCategory = cat;
    renderCategories(); // Re-render tabs to update active style
    renderCards();
}

function toggleFavorite(e, appId) {
    e.stopPropagation(); // Stop card click
    
    if (dashboardState.favorites.includes(appId)) {
        dashboardState.favorites = dashboardState.favorites.filter(id => id !== appId);
        showToast("Removed from favorites", "info");
    } else {
        dashboardState.favorites.push(appId);
        showToast("Added to favorites");
    }
    
    localStorage.setItem('pbs_fav_apps', JSON.stringify(dashboardState.favorites));
    renderCards(); // Re-sort and render
}