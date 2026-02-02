/**
 * 📂 File: auth.js
 * 🔐 Authentication Logic (SDK Based)
 */

// ১. লগিন ফাংশন
async function handleLogin() {
    const identifier = document.getElementById('login-input').value.trim();
    const password = document.getElementById('login-pass').value;

    if(!identifier || !password) return showToast("All fields required!", 'error');
    
    toggleLoader(true);
    try {
        let email = identifier;

        // Smart Login: মোবাইল নম্বর হলে ইমেইল খুঁজে বের করা
        if (!identifier.includes('@')) {
            const res = await databases.listDocuments(
                DB_ID, 
                COLL_PROFILE, 
                [Appwrite.Query.equal('mobile', identifier)]
            );
            if (res.total === 0) throw new Error("User not found with this mobile");
            email = res.documents[0].email;
        }

        // সেশন তৈরি
        await account.createEmailPasswordSession(email, password);
        showToast("Login Successful!");
        location.reload(); 
    } catch(e) { 
        showToast(e.message, 'error'); 
    } finally { 
        toggleLoader(false); 
    }
}

// ২. রেজিস্ট্রেশন ফাংশন
async function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    if(!name || !email || !password) return showToast("All fields required", 'error');

    toggleLoader(true);
    try {
        const user = await account.create(Appwrite.ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);

        // প্রোফাইল তৈরি
        await databases.createDocument(
            DB_ID, 
            COLL_PROFILE, 
            user.$id, 
            {
                full_name: name,
                email: email,
                personal_json: "{}"
            }
        );

        showToast("Account Created!");
        location.reload();
    } catch(err) { 
        showToast(err.message, 'error'); 
    } finally { 
        toggleLoader(false); 
    }
}

// ৩. গুগল লগিন
function googleLogin() {
    try {
        account.createOAuth2Session('google', window.location.origin, window.location.origin);
    } catch(e) { showToast("Error: " + e.message, 'error'); }
}

// ৪. গুগল সেশন হ্যান্ডলার
async function handleGoogleSession() {
    try {
        const session = await account.getSession('current');
        if(!session) return;

        const user = await account.get();
        try {
            await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
        } catch (e) {
            if(e.code === 404) {
                toggleLoader(true);
                await databases.createDocument(DB_ID, COLL_PROFILE, user.$id, {
                    full_name: user.name,
                    email: user.email,
                    personal_json: "{}"
                });
                toggleLoader(false);
            }
        }
    } catch (e) { /* No session */ }
}

// ৫. রিকভারি
function showForgotUI() { 
    document.getElementById('login-form').classList.add('hidden'); 
    document.getElementById('forgot-form').classList.remove('hidden'); 
}

async function sendRecoveryEmail() {
    const email = document.getElementById('forgot-email').value;
    if(!email) return showToast("Enter email", 'error');
    try {
        await account.createRecovery(email, window.location.href);
        showToast("Recovery link sent!");
        switchTab('login');
    } catch(e) { showToast(e.message, 'error'); }
}

function switchTab(m) {
    document.getElementById('login-form').classList.toggle('hidden', m !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', m !== 'register');
    document.getElementById('forgot-form').classList.add('hidden');
    const act="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white transition-all";
    const inact="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all";
    document.getElementById('tab-login').className=m==='login'?act:inact; 
    document.getElementById('tab-register').className=m==='register'?act:inact;
}