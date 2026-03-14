/**
 * 📂 File: rebpbs_automation.js
 * 📝 Description: REBPBS Automation Tool Interface
 */

const RebpbsApp = {
    initView: function() {
        // ড্যাশবোর্ড এবং প্রোফাইল হাইড করা
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let rebView = document.getElementById('view-rebpbs');
        if (!rebView) {
            const mainContainer = document.querySelector('main');
            rebView = document.createElement('div');
            rebView.id = 'view-rebpbs';
            rebView.className = 'fade-in space-y-6 max-w-2xl mx-auto';
            
            // ইউজারের API Key সংগ্রহ (dashboardState থেকে)
            const apiKey = dashboardState.user.api_key || "No API Key Generated";

            rebView.innerHTML = `
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">REBPBS Automation</h2>
                        <p class="text-slate-400 text-sm">Manage your automation API and tools.</p>
                    </div>
                    <button onclick="RebpbsApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="glass-card p-8 rounded-[2rem] text-center border-2 border-rose-100 dark:border-rose-900/30">
                    <p class="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-4">Your Automation API Key</p>
                    <h3 id="reb-api-display" class="text-2xl md:text-3xl font-mono font-black text-slate-700 dark:text-white break-all mb-6 selection:bg-rose-100">
                        ${apiKey}
                    </h3>
                    
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="RebpbsApp.copyKey('${apiKey}')" class="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition">
                            <i class="fa-regular fa-copy"></i> Copy API Key
                        </button>
                        <a href="https://rebpbs.pages.dev" target="_blank" class="flex items-center justify-center gap-2 bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/20">
                            <i class="fa-solid fa-external-link text-sm"></i> Open REBPBS
                        </a>
                    </div>
                </div>

                <div class="glass-card p-8 rounded-[2rem] space-y-4">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <i class="fa-solid fa-circle-info text-blue-500"></i> ব্যবহারের নিয়মাবলী
                    </h4>
                    <div class="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">1</span>
                            <p>প্রথমে উপরের <b>Copy API Key</b> বাটনে ক্লিক করে আপনার ইউনিক কী-টি কপি করে নিন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
                            <p>এরপর <b>Open REBPBS</b> বাটনে ক্লিক করে অটোমেশন পোর্টালে প্রবেশ করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">3</span>
                            <p>পোর্টালের  Pc softwore টি ডাউনলোড করে ,  key icon এ  আপনার কপি করা API Key-টি পেস্ট করুন </p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold text-xs">4</span>
                            <p>ও <a href="https://rebpbs-new.pages.dev" target="_blank" class="text-blue-500 hover:underline">rebpbs-new.pages.dev</a> এ ক্লিক করুন আর  এবং অটোমেশন শুরু করুন।</p>
                        </div>
                    </div>
                </div>
            `;
            mainContainer.appendChild(rebView);
        }
        rebView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-rebpbs').classList.add('hidden');
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