// auth.js - সম্পূর্ণ আপডেটেড এবং ফিক্সড ভার্সন

// --- APPWRITE CONFIGURATION ---
const client = new Appwrite.Client();
client
    // ✅ Region Fix: সিঙ্গাপুর রিজিয়ন ব্যবহার করা হয়েছে
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') 
    .setProject('pbsnet'); // আপনার Appwrite Project ID

const account = new Appwrite.Account(client);

// ✅ আপনার লাইভ ব্যাকএন্ড URL
const BACKEND_URL = 'https://lost-darsey-sbinc2jkj-81fcaf06.koyeb.app'; // প্রোডাকশনে আপনার ব্যাকএন্ড URL দিন

// --- AUTH FUNCTIONS ---

// ১. সাধারণ লগিন (ইমেইল/পাসওয়ার্ড)
async function handleLogin() {
    const i = document.getElementById('login-input').value.trim();
    const p = document.getElementById('login-pass').value;
    if(!i || !p) return showToast("Required!", 'error'); 
    
    toggleLoader(true);
    try {
        // সাধারণ লগিন সরাসরি ব্যাকএন্ডে হিট করে
        const data = await apiCall('/auth/login', 'POST', { identifier: i, password: p });
        setToken(data.token);
        location.reload(); 
    } catch(e) { showToast(e.message, 'error'); } 
    finally { toggleLoader(false); }
}

// ২. রেজিস্ট্রেশন
async function handleRegister() {
    const n = document.getElementById('reg-name').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-pass').value;
    if(!n || !e || !p) return showToast("All fields required", 'error');

    toggleLoader(true);
    try {
        await apiCall('/auth/register', 'POST', { name: n, email: e, password: p });
        // রেজিস্ট্রেশন শেষে অটো লগিন
        const loginData = await apiCall('/auth/login', 'POST', { identifier: e, password: p });
        setToken(loginData.token);
        location.reload();
    } catch(err) { showToast(err.message, 'error'); } 
    finally { toggleLoader(false); }
}

// ৩. ✅ Google Login (Fix: 404 Error সমাধান)
async function googleLogin() {
    try {
        // আমরা এখন '/dashboard' এ পাঠাব না, সরাসরি মেইন ডোমেইনে পাঠাব
        // কারণ index.html লোড হলেই আমাদের স্ক্রিপ্ট লগিন ডিটেক্ট করবে
        account.createOAuth2Session(
            'google', 
            window.location.origin, // Success URL (Homepage)
            window.location.origin  // Failure URL (Homepage)
        );
    } catch(e) { 
        showToast("Google Login Error: " + e.message, 'error'); 
    }
}

// ৪. ✅ Google Session Handler (ব্যাকএন্ডের সাথে সংযোগ)


// auth.js - handleGoogleSession ফাংশন আপডেট

async function handleGoogleSession() {
    // যদি অ্যাপে ইতিমধ্যে লগিন করা থাকে, তবে আর চেক করার দরকার নেই
    if (getToken()) return;

    try {
        const session = await account.get();
        
        if (session) {
            toggleLoader(true);
            // ❌ এই লাইনটি সরানো হয়েছে: showToast("Connecting with Google...", "info");

            // ব্যাকএন্ড ভেরিফিকেশন
            const jwtData = await account.createJWT();
            
            const res = await fetch(`${BACKEND_URL}/api/auth/oauth-success`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appwriteJwt: jwtData.jwt })
            });

            const data = await res.json();
            
            if (data.token) {
                setToken(data.token);
                showToast("Login Successful!");
                location.reload(); 
            } else {
                console.error("Backend Auth Failed", data);
                await account.deleteSession('current');
            }
        }
    } catch (e) {
        // console.log("No Google Session");
    } finally {
        toggleLoader(false);
    }
}

// --- UTILITY FUNCTIONS ---

// Forgot Password
function showForgotUI() { 
    document.getElementById('login-form').classList.add('hidden'); 
    document.getElementById('forgot-form').classList.remove('hidden'); 
}

async function sendRecoveryEmail() {
    const email = document.getElementById('forgot-email').value;
    if(!email) return showToast("Enter email", 'error');
    
    toggleLoader(true);
    try {
        await apiCall('/auth/forgot-password', 'POST', { email });
        showToast("Recovery link sent!");
        switchTab('login');
    } catch(e) { showToast(e.message, 'error'); }
    finally { toggleLoader(false); }
}

// Logout Function
async function logout() { 
    try {
        // Appwrite এবং LocalStorage দুই জায়গা থেকেই লগআউট
        await account.deleteSession('current');
    } catch(e) {
        // ইগনোর, যদি সেশন না থাকে
    }
    clearAuth(); // config.js বা dashboard.js এর ফাংশন যা টোকেন মুছে দেয়
}

// Tab Switching (Login/Register)
function switchTab(m) {
    document.getElementById('login-form').classList.toggle('hidden', m !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', m !== 'register');
    document.getElementById('forgot-form').classList.add('hidden');
    
    const act="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white transition-all";
    const inact="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all";
    
    document.getElementById('tab-login').className=m==='login'?act:inact; 
    document.getElementById('tab-register').className=m==='register'?act:inact;
}
