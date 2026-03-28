/**
 * 📂 File: pbshub.js
 * 📝 Description: PBS Hub - Technical Manuals & Specifications Interface
 */

const PbsHubApp = {
    initView: function() {
        // ড্যাশবোর্ড এবং প্রোফাইল হাইড করা
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let hubView = document.getElementById('view-pbshub');
        if (!hubView) {
            const mainContainer = document.querySelector('main');
            hubView = document.createElement('div');
            hubView.id = 'view-pbshub';
            hubView.className = 'fade-in space-y-6 max-w-2xl mx-auto';
            
            // ইউজারের API Key সংগ্রহ (dashboardState থেকে)
            const apiKey = dashboardState.user.api_key || "No API Key Generated";

            hubView.innerHTML = `
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">The Hub</h2>
                        <p class="text-slate-400 text-sm">Technical Manuals & Specifications</p>
                    </div>
                    <button onclick="PbsHubApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="glass-card p-8 rounded-[2rem] text-center border-2 border-amber-100 dark:border-amber-900/30">
                    <p class="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">Your Access Key (Click to Copy)</p>
                    <h3 onclick="PbsHubApp.copyKey('${apiKey}')" class="text-2xl md:text-3xl font-mono font-black text-slate-700 dark:text-white break-all mb-6 cursor-pointer hover:text-amber-600 transition selection:bg-amber-100" title="Click to Copy">
                        ${apiKey}
                    </h3>
                    
                    <div class="flex justify-center">
                        <a href="https://pbshub.vercel.app/login/${apiKey}" target="_blank" class="flex items-center justify-center gap-2 bg-amber-500 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-amber-600 transition shadow-lg shadow-amber-500/20">
                            <i class="fa-solid fa-external-link text-sm"></i> Enter The Hub
                        </a>
                    </div>
                </div>

                <div class="glass-card p-8 rounded-[2rem] space-y-6">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <i class="fa-solid fa-circle-info text-amber-500"></i> What is PBS Hub?
                    </h4>
                    
                    <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>PBS Hub is the ultimate central repository for all your technical needs. Here you can find:</p>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><b>Meter Specifications:</b> Detailed technical data for all energy meters.</li>
                            <li><b>Equipment Manuals:</b> Interactive guides for testing and installation.</li>
                            <li><b>Technical Documents:</b> REB/PBS guidelines and official specifications.</li>
                            <li><b>Range-based Search:</b> Instantly find documents matching specific categories.</li>
                        </ul>
                        <p class="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            সরাসরি এক্সেসড পেতে আপনার <b>API Key</b> ব্যবহার করা হয়। উপরে থাকা <b>"Enter The Hub"</b> বাটনে ক্লিক করলে তা স্বয়ংক্রিয়ভাবে আপনাকে লগিন করিয়ে দেবে।
                        </p>
                    </div>
                </div>
            `;
            mainContainer.appendChild(hubView);
        }
        hubView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-pbshub').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
    },

    copyKey: function(key) {
        if(key === "No API Key Generated") {
            return showToast("Please generate an API key from profile first!", "error");
        }
        navigator.clipboard.writeText(key).then(() => {
            showToast("Access Key Copied to Clipboard!");
        });
    }
};
