/**
 * 📂 File: pfi_calculator.js
 * ⚡ PFI & Average Load Calculator Module
 */

const PfiCalculatorApp = {
    initView: function() {
        // ১. অন্য ভিউ হাইড করা
        document.getElementById('view-home').classList.add('hidden');
        if(document.getElementById('view-profile')) document.getElementById('view-profile').classList.add('hidden');
        if(document.getElementById('view-directory')) document.getElementById('view-directory').classList.add('hidden');
        if(document.getElementById('view-rebpbs')) document.getElementById('view-rebpbs').classList.add('hidden');
        if(document.getElementById('view-meter-bench')) document.getElementById('view-meter-bench').classList.add('hidden');

        // ২. ভিউ তৈরি করা (যদি না থাকে)
        let pfiView = document.getElementById('view-pfi');
        if (!pfiView) {
            const main = document.querySelector('main');
            pfiView = document.createElement('div');
            pfiView.id = 'view-pfi';
            pfiView.className = 'fade-in space-y-6 pb-20 max-w-4xl mx-auto';
            
            pfiView.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-[#2e2f30] flex items-center justify-center text-emerald-600 dark:text-[#a8c7fa]">
                            <i class="fa-solid fa-calculator"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">PFI & Load Calculator</h2>
                    </div>
                    <button onclick="PfiCalculatorApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#2e2f30] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-[#c4c7c5] hover:text-red-500 transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div class="glass-card p-5 rounded-2xl border-t-4 border-t-blue-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-bolt text-blue-500"></i> Active Power (KWh)
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Previous</label>
                                <input type="number" id="pfi-prev-kwh" oninput="PfiCalculatorApp.calculate()" placeholder="0" class="modern-input">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Current</label>
                                <input type="number" id="pfi-curr-kwh" oninput="PfiCalculatorApp.calculate()" placeholder="Enter Current" class="modern-input font-bold">
                            </div>
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Used: <span id="pfi-use-kwh" class="font-bold text-blue-600 dark:text-blue-400">0</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-5 rounded-2xl border-t-4 border-t-orange-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-magnet text-orange-500"></i> Inductive Kvarh(Lag)
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Previous</label>
                                <input type="number" id="pfi-prev-lag" oninput="PfiCalculatorApp.calculate()" placeholder="0" class="modern-input">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Current</label>
                                <input type="number" id="pfi-curr-lag" oninput="PfiCalculatorApp.calculate()" placeholder="Enter Current" class="modern-input font-bold">
                            </div>
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Used: <span id="pfi-use-lag" class="font-bold text-orange-600 dark:text-orange-400">0</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-5 rounded-2xl border-t-4 border-t-purple-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-capacitor text-purple-500"></i> Capacitive Kvarh(Lead)
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Previous</label>
                                <input type="number" id="pfi-prev-lead" oninput="PfiCalculatorApp.calculate()" placeholder="0" class="modern-input">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Current</label>
                                <input type="number" id="pfi-curr-lead" oninput="PfiCalculatorApp.calculate()" placeholder="Enter Current" class="modern-input font-bold">
                            </div>
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <p class="text-xs text-slate-500 dark:text-slate-400">Used: <span id="pfi-use-lead" class="font-bold text-purple-600 dark:text-purple-400">0</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div class="p-6 rounded-2xl bg-slate-800 text-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div class="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50"></div>
                        <span id="pfi-pf-label" class="text-xs font-bold text-slate-300 uppercase z-10">Power Factor</span>
                        <h3 id="pfi-pf-result" class="text-4xl font-black mt-2 z-10 group-hover:scale-110 transition">0.00</h3>
                        <p class="text-[10px] text-slate-400 mt-1 z-10">Target: 0.98</p>
                    </div>

                    <div class="p-6 rounded-2xl bg-emerald-600 text-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                         <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 opacity-50"></div>
                        <span class="text-xs font-bold text-emerald-100 uppercase z-10">Avg Load (30 Days)</span>
                        <h3 id="pfi-load-result" class="text-4xl font-black mt-2 z-10 group-hover:scale-110 transition">0.00 <span class="text-lg">kW</span></h3>
                        <p class="text-[10px] text-emerald-200 mt-1 z-10">Based on 10h/day usage</p>
                    </div>
                </div>

                <div id="pfi-advice-box" class="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-400 flex gap-4 items-start">
                    <div class="text-yellow-500 text-xl mt-1"><i class="fa-regular fa-lightbulb"></i></div>
                    <div class="text-sm text-slate-600 dark:text-slate-300">
                        <p class="font-bold text-slate-800 dark:text-white mb-1">পরামর্শ:</p>
                        <p id="pfi-advice-text">মিটারের বর্তমান (Current) রিডিংগুলো ইনপুট দিন। আগের রিডিং না থাকলে ০ রাখুন।</p>
                    </div>
                </div>
            `;
            main.appendChild(pfiView);
        }
        
        pfiView.classList.remove('hidden');
    },

    close: function() {
        document.getElementById('view-pfi').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
    },

    // --- LOGIC ---
    val: function(id) { return parseFloat(document.getElementById(id).value) || 0; },
    
    calculate: function() {
        const prevKwh = this.val('pfi-prev-kwh');
        const currKwh = this.val('pfi-curr-kwh');
        const prevLag = this.val('pfi-prev-lag');
        const currLag = this.val('pfi-curr-lag');
        const prevLead = this.val('pfi-prev-lead');
        const currLead = this.val('pfi-curr-lead');

        // Usage
        const useKwh = Math.max(0, currKwh - prevKwh);
        const useLag = Math.max(0, currLag - prevLag);
        const useLead = Math.max(0, currLead - prevLead);

        document.getElementById('pfi-use-kwh').innerText = useKwh.toFixed(1);
        document.getElementById('pfi-use-lag').innerText = useLag.toFixed(1);
        document.getElementById('pfi-use-lead').innerText = useLead.toFixed(1);

        // Load Calc (300 hours)
        const loadKw = useKwh > 0 ? (useKwh / 300) : 0;
        document.getElementById('pfi-load-result').innerHTML = `${loadKw.toFixed(2)} <span class="text-lg">kW</span>`;

        // PF Calc
        const netKvar = Math.abs(useLag - useLead);
        const kva = Math.sqrt(Math.pow(useKwh, 2) + Math.pow(netKvar, 2));
        const pf = kva > 0 ? (useKwh / kva) : 0;
        
        const pfEl = document.getElementById('pfi-pf-result');
        pfEl.innerText = pf.toFixed(3);

        // Logic & Advice
        let pfType = useLag >= useLead ? "(Lagging)" : "(Leading)";
        document.getElementById('pfi-pf-label').innerText = `Power Factor ${pfType}`;

        const adviceText = document.getElementById('pfi-advice-text');
        const adviceBox = document.getElementById('pfi-advice-box');
        
        if (useKwh === 0) {
            adviceText.innerText = "সঠিক ফলাফল পেতে Current KWh রিডিং ইনপুট দিন।";
            adviceBox.className = "glass-card p-6 rounded-2xl border-l-4 border-l-yellow-400 flex gap-4 items-start";
        } 
        else if (useLag >= useLead) {
            // LAGGING
            const targetPf = 0.98;
            if (pf < targetPf && pf > 0) {
                const phi1 = Math.acos(pf);
                const phi2 = Math.acos(targetPf);
                const reqKvar = loadKw * (Math.tan(phi1) - Math.tan(phi2));
                
                adviceText.innerHTML = `PF ল্যাগিং অবস্থায় আছে। এটি ০.৯৮-এ উন্নীত করতে সিস্টেমে <b class="text-red-500">${reqKvar.toFixed(2)} kVAR</b> মানের ক্যাপাসিটর যোগ করতে হবে।`;
                adviceBox.className = "glass-card p-6 rounded-2xl border-l-4 border-l-red-500 flex gap-4 items-start";
            } else {
                adviceText.innerText = "পাওয়ার ফ্যাক্টর চমৎকার অবস্থায় আছে! কোনো অতিরিক্ত ক্যাপাসিটর প্রয়োজন নেই।";
                adviceBox.className = "glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 flex gap-4 items-start";
            }
        } else {
            // LEADING
            const excess = Math.abs(useLead - useLag);
            adviceText.innerHTML = `সিস্টেম <b class="text-red-500">Leading</b> অবস্থায় আছে (ক্যাপাসিটর বেশি অন করা)। প্যানেল থেকে অতিরিক্ত ক্যাপাসিটর বন্ধ করুন।`;
            adviceBox.className = "glass-card p-6 rounded-2xl border-l-4 border-l-red-500 flex gap-4 items-start";
        }
    }
};