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
        // ১. একাউন্ট তৈরি
        const user = await account.create(Appwrite.ID.unique(), email, password, name);
        // ২. সেশন তৈরি (লগিন)
        await account.createEmailPasswordSession(email, password);

        // ৩. ইউনিক ইউজারনেম এবং API Key জেনারেট
        const finalUsername = await getUniqueUsername(name); // এখানে নতুন ফাংশন কল করা হলো
        const autoApiKey = 'pbsnet-' + Math.random().toString(36).substring(2, 18);

        // ৪. প্রোফাইল সেভ
        await databases.createDocument(
            DB_ID, 
            COLL_PROFILE, 
            user.$id, 
            {
                full_name: name,
                email: email,
                username: finalUsername,
                api_key: autoApiKey,
                personal_json: "{}"
            }
        );

        showToast(`Account Created! Username: ${finalUsername}`);
        location.reload();
    } catch(err) { 
        showToast(err.message, 'error'); 
    } finally { 
        toggleLoader(false); 
    }
}

// ৩. গুগল লগিন (Mobile Optimized)
function googleLogin() {
    try {
        // window.location.origin এর পরিবর্তে href ব্যবহার করা হচ্ছে এবং ট্রেইলিং স্লাশ বা কোয়েরি বাদ দেওয়া হচ্ছে
        const currentUrl = window.location.href.split('#')[0].split('?')[0]; 
        
        // OAuth2 Session তৈরি
        account.createOAuth2Session('google', currentUrl, currentUrl);
    } catch(e) { 
        showToast("Error: " + e.message, 'error'); 
    }
}

// ৪. গুগল সেশন হ্যান্ডলার
// auth.js এর handleGoogleSession আপডেট

async function handleGoogleSession() {
    try {
        const session = await account.getSession('current');
        if(!session) return;

        const user = await account.get();
        
        // চেক করুন ইউজার প্রোফাইল ডাটাবেসে আছে কিনা
        try {
            await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
        } catch (e) {
            // 404 মানে প্রোফাইল নেই, তাই নতুন বানাতে হবে
            if(e.code === 404) {
                toggleLoader(true);
                try {
                     const finalUsername = await getUniqueUsername(user.name);
                     const autoApiKey = 'pbsnet-' + Math.random().toString(36).substring(2, 18);

                     await databases.createDocument(DB_ID, COLL_PROFILE, user.$id, {
                        full_name: user.name,
                        email: user.email,
                        username: finalUsername,
                        api_key: autoApiKey,
                        personal_json: "{}"
                    });
                    showToast("Profile initialized!");
                } catch(createErr) {
                    console.error("Profile Create Error:", createErr);
                } finally {
                    toggleLoader(false);
                }
            }
        }
    } catch (e) { 
        // নো সেশন, মানে লগিন নেই। কিছু করার দরকার নেই।
        console.log("No active Google session");
    }
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


// --- HELPER: Unique Username Generator ---
async function getUniqueUsername(fullName) {
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    try {
        // ১. প্রথমে ক্লিন নামটি চেক করি
        const check = await databases.listDocuments(
            DB_ID, 
            COLL_PROFILE, 
            [Appwrite.Query.equal('username', cleanName)]
        );

        // ২. যদি কেউ এই নাম না নিয়ে থাকে (total = 0), তাহলে এটিই রিটার্ন করুন
        if (check.total === 0) {
            return cleanName;
        }
    } catch (e) {
        console.log("Unique check failed, falling back to random.");
    }

    // ৩. যদি নাম নেওয়া থাকে, তাহলে র‍্যান্ডম সংখ্যা যুক্ত করুন
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${randomSuffix}`;
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