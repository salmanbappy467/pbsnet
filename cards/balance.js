/**
 * 📂 File: balance.js
 * 📝 Description: Balance Tool Interface
 */

const BalanceApp = {
    initView: function() {
        // Hide Home and Profile
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-profile').classList.add('hidden');
        
        let balanceView = document.getElementById('view-balance');
        if (!balanceView) {
            const mainContainer = document.querySelector('main');
            balanceView = document.createElement('div');
            balanceView.id = 'view-balance';
            balanceView.className = 'fade-in space-y-6 max-w-2xl mx-auto';
            
            // Get user's API Key
            const apiKey = dashboardState.user.api_key || "No API Key Generated";

            balanceView.innerHTML = `
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Meter Balance</h2>
                        <p class="text-slate-400 text-sm">Smart Stock & Ledger Management</p>
                    </div>
                    <button onclick="BalanceApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div class="glass-card p-8 rounded-[2rem] text-center border-2 border-purple-100 dark:border-purple-900/30">
                    <p class="text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em] mb-4">Your API Key (Click to Copy)</p>
                    <h3 onclick="BalanceApp.copyKey('${apiKey}')" class="text-2xl md:text-3xl font-mono font-black text-slate-700 dark:text-white break-all mb-6 cursor-pointer hover:text-purple-600 transition selection:bg-purple-100" title="Click to Copy">
                        ${apiKey}
                    </h3>
                    
                    <div class="flex justify-center">
                        <a href="https://meterbalance.pages.dev/?key=${apiKey}" target="_blank" class="flex items-center justify-center gap-2 bg-purple-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/20">
                            <i class="fa-solid fa-external-link text-sm"></i> Open Meter Balance
                        </a>
                    </div>
                </div>

                <div class="glass-card p-8 rounded-[2rem] space-y-6">
                    <h4 class="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <i class="fa-solid fa-circle-info text-blue-500"></i> About Balance App
                    </h4>
                    
                    <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 mb-4">
                        <p class="text-sm text-slate-600 dark:text-slate-300"><b>Meter Balance</b> একটি স্টকিং এবং লেজার ম্যানেজমেন্ট টুল যা আপনার মিটার এবং ইকুইপমেন্টের স্টক ট্র্যাক করতে সাহায্য করে। এটি সরাসরি আপনার গুগল শিটের সাথে কানেক্টেড।</p>
                    </div>

                    <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-600 flex items-center justify-center font-bold text-xs">1</span>
                            <p>আপনার API Key কপি করে অ্যাপের সেটআপ স্ক্রিনে ব্যবহার করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-600 flex items-center justify-center font-bold text-xs">2</span>
                            <p>প্রথমবার ব্যবহারের সময় আপনার গুগল শিটের URL দিয়ে সেটআপ সম্পন্ন করুন।</p>
                        </div>
                        <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-600 flex items-center justify-center font-bold text-xs">3</span>
                            <p>অফলাইন সাপোর্টের মাধ্যমে আপনি নেট ছাড়াও এন্ট্রি করতে পারবেন, যা পরে অটো-সিঙ্ক হবে।</p>
                        </div>
                    </div>
                </div>
            `;
            mainContainer.appendChild(balanceView);
        }
        balanceView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-balance').classList.add('hidden');
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
