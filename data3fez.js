/**
 * 📂 File: data3fez.js
 * 📝 Description: Data3Fez Tool Interface
 */

const Data3FezApp = {
    initView: function() {
        // ড্যাশবোর্ড এবং প্রোফাইল হাইড করা
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let fezView = document.getElementById('view-data3fez');
        if (!fezView) {
            const mainContainer = document.querySelector('main');
            fezView = document.createElement('div');
            fezView.id = 'view-data3fez';
            fezView.className = 'fade-in space-y-6 max-w-2xl mx-auto';
            
            // ইউজারের API Key সংগ্রহ (dashboardState থেকে)
            const apiKey = dashboardState.user.api_key || "No API Key Generated";

            fezView.innerHTML = `
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Data3Fez</h2>
                        <p class="text-slate-400 text-sm">Centralized Data Management Tool</p>
                    </div>
                    <button onclick="Data3FezApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="glass-card p-8 rounded-[2rem] text-center border-2 border-blue-100 dark:border-blue-900/30">
                    <p class="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Your API Key (Click to Copy)</p>
                    <h3 onclick="Data3FezApp.copyKey('${apiKey}')" class="text-2xl md:text-3xl font-mono font-black text-slate-700 dark:text-white break-all mb-6 cursor-pointer hover:text-blue-600 transition selection:bg-blue-100" title="Click to Copy">
                        ${apiKey}
                    </h3>
                    
                    <div class="flex justify-center">
                        <a href="https://data3fez.vercel.app/?key=${apiKey}" target="_blank" class="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                            <i class="fa-solid fa-external-link text-sm"></i> Open Data3Fez
                        </a>
                    </div>
                </div>

                <div class="glass-card p-8 rounded-[2rem] space-y-6">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <i class="fa-solid fa-sheet-plastic text-emerald-500"></i> Google Sheet Configuration
                    </h4>
                    
                    <div class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 mb-4">
                        <p class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">গুরুত্বপূর্ণ:</p>
                        <p class="text-sm text-slate-600 dark:text-slate-300">শিটটি অবশ্যই <b>"Anyone with the link can edit"</b> মোডে থাকতে হবে।</p>
                    </div>

                    <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">1</span>
                            <p>আপনার Google Sheet ওপেন করে ডানদিকের উপরের কোণায় <b>Share</b> বাটনে ক্লিক করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
                            <p>General Access সেকশনে 'Restricted' পরিবর্তন করে <b>'Anyone with the link'</b> সিলেক্ট করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">3</span>
                            <p>ডানপাশে 'Viewer' এর বদলে <b>'Editor'</b> সিলেক্ট করে 'Done' দিন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">4</span>
                            <p>এরপর শিটের URL কপি করে Data3Fez এর <b>Settings > Sheet Setup</b> এ গিয়ে পেস্ট করে "Setup Sheet" ক্লিক করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">5</span>
                            <p>সিস্টেম স্বয়ংক্রিয়ভাবে <b>data3fez</b> নামে একটি ট্যাব তৈরি করে নেবে এবং ডেটা সেভ করা শুরু করবে।</p>
                        </div>
                    </div>
                </div>
            `;
            mainContainer.appendChild(fezView);
        }
        fezView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-data3fez').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
    },

    copyKey: function(key) {
        if(key === "No API Key Generated") {
            return showToast("Please generate an API key from profile first!", "error");
        }
        navigator.clipboard.writeText(key).then(() => {
            showToast("API Key Copied to Clipboard!");
        });
    }
};
