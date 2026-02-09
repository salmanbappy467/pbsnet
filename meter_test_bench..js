/**
 * 📂 File: meter_test_bench.js
 * ⚡ Smart Electric Meter Test Bench Module
 */

const MeterTestBenchApp = {
    state: {
        isCalculating: false,
        refKh: 21.6 // Reference Constant
    },

    initView: function() {
        // ১. অন্য ভিউ হাইড করা
        document.getElementById('view-home').classList.add('hidden');
        if(document.getElementById('view-profile')) document.getElementById('view-profile').classList.add('hidden');
        if(document.getElementById('view-directory')) document.getElementById('view-directory').classList.add('hidden');
        if(document.getElementById('view-rebpbs')) document.getElementById('view-rebpbs').classList.add('hidden');

        // ২. ভিউ তৈরি করা (যদি না থাকে)
        let meterView = document.getElementById('view-meter-bench');
        if (!meterView) {
            const main = document.querySelector('main');
            meterView = document.createElement('div');
            meterView.id = 'view-meter-bench';
            meterView.className = 'fade-in space-y-6 pb-20';
            
            meterView.innerHTML = `
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-[#2e2f30] flex items-center justify-center text-indigo-600 dark:text-[#a8c7fa]">
                            <i class="fa-solid fa-tachometer-alt"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Meter Test Bench</h2>
                    </div>
                    <button onclick="MeterTestBenchApp.close()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#2e2f30] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-[#c4c7c5] hover:text-red-500 transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="flex justify-center gap-4 mb-8">
                    <button onclick="MeterTestBenchApp.presetLoad(240, 1)" class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-lg shadow-yellow-500/30 transition">
                        <i class="fa-regular fa-lightbulb"></i> Light Load (1A)
                    </button>
                    <button onclick="MeterTestBenchApp.presetLoad(240, 10)" class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/30 transition">
                        <i class="fa-solid fa-bolt"></i> Full Load (10A)
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div class="glass-card p-6 rounded-2xl border-t-4 border-t-blue-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-plug text-blue-500"></i> Source Parameters
                        </h3>
                        
                        <div class="space-y-4">
                            <div class="input-group">
                                <label class="text-xs font-bold text-slate-500 uppercase ml-1">Meter Class</label>
                                <select id="mt-class" onchange="MeterTestBenchApp.recalcError()" class="modern-select">
                                    <option value="0.2">Class 0.2s</option>
                                    <option value="0.5">Class 0.5</option>
                                    <option value="1.0" selected>Class 1.0</option>
                                    <option value="2.0">Class 2.0</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Volt (V)</label>
                                    <input type="number" id="mt-volt" value="240" oninput="MeterTestBenchApp.logicSource('volt')" class="modern-input">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Amp (A)</label>
                                    <input type="number" id="mt-amp" value="1" oninput="MeterTestBenchApp.logicSource('amp')" class="modern-input">
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Active Load (W)</label>
                                <input type="number" id="mt-load" value="240" oninput="MeterTestBenchApp.logicSource('load')" class="modern-input font-bold text-blue-600 dark:text-blue-400">
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-6 rounded-2xl border-t-4 border-t-indigo-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-tachometer-alt text-indigo-500"></i> Meter Spec
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Constant (Imp/kWh)</label>
                                <input type="number" id="mt-imp" value="1600" oninput="MeterTestBenchApp.logicSpec('imp')" class="modern-input">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Kh (Wh/p)</label>
                                    <input type="number" id="mt-kh" value="0.625" oninput="MeterTestBenchApp.logicSpec('kh')" class="modern-input">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Target Pulse</label>
                                    <input type="number" id="mt-pulse" value="5" oninput="MeterTestBenchApp.logicSpec('pulse')" class="modern-input font-bold">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-6 rounded-2xl border-t-4 border-t-purple-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-scale-balanced text-purple-500"></i> Reference Meter
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Ref. Kh (Fixed)</label>
                                <input type="number" id="mt-ref-kh" value="21.6" readonly class="modern-input bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Ref. Std. Rev</label>
                                    <input type="number" id="mt-ref-std" oninput="MeterTestBenchApp.logicRefStdRev()" class="modern-input">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase">Ref. Obs. Rev</label>
                                    <input type="number" id="mt-ref-obs" oninput="MeterTestBenchApp.logicRefObsRev()" class="modern-input">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-6 rounded-2xl border-t-4 border-t-teal-500">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-stopwatch text-teal-500"></i> Time Observation
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Standard Time (s)</label>
                                <input type="number" id="mt-std-time" oninput="MeterTestBenchApp.logicStdTime()" class="modern-input font-mono text-teal-600 dark:text-teal-400 font-bold">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase">Observed Time (s)</label>
                                <input type="number" id="mt-obs-time" oninput="MeterTestBenchApp.logicObsTime()" class="modern-input font-mono text-slate-700 dark:text-white font-bold border-teal-200 dark:border-teal-900 focus:border-teal-500">
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-6 rounded-2xl border-t-4 border-t-slate-800 dark:border-t-slate-500 md:col-span-2">
                        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-6 text-center uppercase tracking-widest">Analysis & Results</h3>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div id="mt-error-box" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-slate-200 dark:border-slate-600 shadow-sm text-center transition-colors">
                                <span class="text-xs font-bold text-slate-400 uppercase">Percentage Error</span>
                                <div class="flex justify-center items-end gap-1 mt-2">
                                    <input type="number" id="mt-error" oninput="MeterTestBenchApp.logicError()" class="bg-transparent text-3xl font-black text-center w-32 outline-none" value="0.00">
                                    <span class="text-sm font-bold text-slate-400 mb-1">%</span>
                                </div>
                            </div>

                            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-blue-500 shadow-sm text-center">
                                <span class="text-xs font-bold text-slate-400 uppercase">Accuracy</span>
                                <div class="flex justify-center items-end gap-1 mt-2">
                                    <input type="number" id="mt-accuracy" readonly class="bg-transparent text-3xl font-black text-blue-600 dark:text-blue-400 text-center w-32 outline-none" value="100.00">
                                    <span class="text-sm font-bold text-slate-400 mb-1">%</span>
                                </div>
                            </div>
                        </div>

                        <div id="mt-status" class="py-3 px-6 rounded-xl text-center font-black text-white text-lg tracking-[0.2em] bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all">
                            NORMAL
                        </div>
                    </div>

                </div>
            `;
            main.appendChild(meterView);
        }
        
        meterView.classList.remove('hidden');
        
        // Init Logic
        this.logicSource('volt'); 
    },

    close: function() {
        document.getElementById('view-meter-bench').classList.add('hidden');
        document.getElementById('view-home').classList.remove('hidden');
    },

    // --- UTILITIES ---
    el: function(id) { return document.getElementById(id); },
    val: function(id) { return parseFloat(this.el(id).value) || 0; },
    set: function(id, v) { if(this.el(id)) this.el(id).value = Number(v).toFixed(4); },

    // --- LOGIC HANDLERS ---
    
    presetLoad: function(v, i) {
        this.el('mt-volt').value = v;
        this.el('mt-amp').value = i;
        this.logicSource('volt');
    },

    logicSource: function(trigger) {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;

        let v = this.val('mt-volt'), i = this.val('mt-amp'), p = this.val('mt-load');

        if (trigger === 'volt' || trigger === 'amp') {
            p = v * i;
            this.set('mt-load', p);
        } else if (trigger === 'load') {
            if (v > 0) { i = p / v; this.set('mt-amp', i); }
        }
        this.calcAllFromLoad(p);
        this.state.isCalculating = false;
    },

    logicSpec: function(trigger) {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;

        let imp = this.val('mt-imp'), kh = this.val('mt-kh');

        if (trigger === 'imp' && imp > 0) {
            kh = 1000 / imp;
            this.set('mt-kh', kh);
        } else if (trigger === 'kh' && kh > 0) {
            imp = 1000 / kh;
            this.set('mt-imp', imp);
        }
        let p = this.val('mt-load');
        this.calcAllFromLoad(p);
        this.state.isCalculating = false;
    },

    logicStdTime: function() {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;
        let t_std = this.val('mt-std-time'), pulses = this.val('mt-pulse'), kh = this.val('mt-kh');
        if (t_std > 0 && pulses > 0 && kh > 0) {
            let new_load = (pulses * kh * 3600) / t_std;
            this.set('mt-load', new_load);
            let v = this.val('mt-volt');
            if (v > 0) this.set('mt-amp', new_load / v);
            this.recalcError();
        }
        this.state.isCalculating = false;
    },

    logicObsTime: function() {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;
        let t_obs = this.val('mt-obs-time'), p = this.val('mt-load');
        if (t_obs > 0) {
            let ref_obs_rev = (p * t_obs) / (3600 * this.state.refKh);
            this.set('mt-ref-obs', ref_obs_rev);
            this.recalcError();
        }
        this.state.isCalculating = false;
    },

    logicRefStdRev: function() {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;
        let ref_rev = this.val('mt-ref-std'), t_std = this.val('mt-std-time');
        if (t_std > 0 && ref_rev > 0) {
            let energy = ref_rev * this.state.refKh;
            let new_load = (energy * 3600) / t_std;
            this.set('mt-load', new_load);
            let v = this.val('mt-volt');
            if (v > 0) this.set('mt-amp', new_load / v);
        }
        this.state.isCalculating = false;
    },

    logicRefObsRev: function() {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;
        let ref_obs_rev = this.val('mt-ref-obs'), p = this.val('mt-load');
        if (p > 0) {
            let t_obs = (ref_obs_rev * 3600 * this.state.refKh) / p;
            this.set('mt-obs-time', t_obs);
            this.recalcError();
        }
        this.state.isCalculating = false;
    },

    logicError: function() {
        if(this.state.isCalculating) return;
        this.state.isCalculating = true;
        let err = this.val('mt-error'), t_std = this.val('mt-std-time'), p = this.val('mt-load');
        if (t_std > 0) {
            let t_obs = t_std / (1 + (err/100));
            this.set('mt-obs-time', t_obs);
            let ref_obs_rev = (p * t_obs) / (3600 * this.state.refKh);
            this.set('mt-ref-obs', ref_obs_rev);
            this.el('mt-accuracy').value = (100 + err).toFixed(2);
            this.updateStatus(err);
        }
        this.state.isCalculating = false;
    },

    // --- CORE CALCULATIONS ---
    calcAllFromLoad: function(p) {
        let pulses = this.val('mt-pulse'), kh = this.val('mt-kh');
        if (p > 0 && pulses > 0 && kh > 0) {
            let t_std = (pulses * kh * 3600) / p;
            this.set('mt-std-time', t_std);
            let ref_std_rev = (pulses * kh) / this.state.refKh;
            this.set('mt-ref-std', ref_std_rev);
            this.recalcError();
        }
    },

    recalcError: function() {
        let t_std = this.val('mt-std-time'), t_obs = this.val('mt-obs-time');
        if (t_std > 0 && t_obs > 0) {
            let err = ((t_std - t_obs) / t_obs) * 100;
            this.set('mt-error', err);
            this.el('mt-accuracy').value = (100 + err).toFixed(2);
            this.updateStatus(err);
        }
    },

    updateStatus: function(err) {
        let limit = parseFloat(this.el('mt-class').value);
        let badge = this.el('mt-status');
        let errorBox = this.el('mt-error-box');
        let errorInput = this.el('mt-error');

        badge.className = "py-3 px-6 rounded-xl text-center font-black text-white text-lg tracking-[0.2em] shadow-lg transition-all";
        errorBox.className = "p-4 rounded-2xl bg-white dark:bg-slate-800 border-l-4 shadow-sm text-center transition-colors";

        if (err > limit) {
            // FAST
            badge.innerText = "FAST";
            badge.classList.add("bg-red-500", "shadow-red-500/30");
            errorBox.classList.add("border-red-500");
            errorInput.style.color = "#ef4444"; // red-500
        } else if (err < -limit) {
            // SLOW
            badge.innerText = "SLOW";
            badge.classList.add("bg-orange-500", "shadow-orange-500/30");
            errorBox.classList.add("border-orange-500");
            errorInput.style.color = "#f97316"; // orange-500
        } else {
            // NORMAL
            badge.innerText = "NORMAL";
            badge.classList.add("bg-emerald-500", "shadow-emerald-500/30");
            errorBox.classList.add("border-emerald-500");
            errorInput.style.color = "#10b981"; // emerald-500
        }
    }
};
