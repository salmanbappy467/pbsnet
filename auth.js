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

// ৩. গুগল লগিন (Mobile Optimized via Redirect)
function googleLogin() {
    // সরাসরি নতুন তৈরি করা পেজে পাঠিয়ে দিচ্ছি যা অথেনটিকেশন শুরু করবে
    window.location.href = "google-log.html";
}

// ৪. গুগল সেশন হ্যান্ডলার
// auth.js এর handleGoogleSession আপডেট

async function handleGoogleSession() {
    try {
        const session = await account.getSession('current');
        if(!session) return;

        const user = await account.get();
        let isNewProfile = false;
        
        // চেক করুন ইউজার প্রোফাইল ডাটাবেসে আছে কিনা
        try {
            await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
        } catch (e) {
            // 404 মানে প্রোফাইল নেই, তাই নতুন বানাতে হবে
            if(e.code === 404) {
                isNewProfile = true;
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
                    // Loader বন্ধ করার দরকার নেই কারণ নিচে প্রোফাইল পিকচার ফেচ হবে
                }
            }
        }

        // ✅ AUTO FETCH GOOGLE PROFILE PICTURE
        try {
            const doc = await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
            
            // যদি ইউজারের কোনো ছবি না থাকে এবং সেশনটি Google এর হয়
            if (!doc.profile_pic_id && session.provider === 'google' && session.providerAccessToken) {
                toggleLoader(true);
                
                // ১. গুগলের API থেকে ইউজারের ছবি আনা
                const gRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${session.providerAccessToken}` }
                });
                const gData = await gRes.json();
                
                if (gData.picture) {
                    // ২. হাই-রেজুলিউশন ছবি নেওয়ার চেষ্টা
                    const highResPic = gData.picture.replace('=s96-c', '=s500-c');
                    
                    // ৩. ছবিটি ডাউনলোড করে ফাইল বানানো
                    const imgRes = await fetch(highResPic);
                    const blob = await imgRes.blob();
                    const file = new File([blob], 'google_avatar.jpg', { type: blob.type });

                    // ৪. Appwrite Storage এ আপলোড করা
                    const uploaded = await storage.createFile(BUCKET_ID, Appwrite.ID.unique(), file);
                    
                    // ৫. ডাটাবেস अपडेट করে profile_pic_id বসানো
                    await databases.updateDocument(DB_ID, COLL_PROFILE, user.$id, {
                        profile_pic_id: uploaded.$id
                    });
                }
            }
        } catch (picErr) {
            console.warn("Failed to sync Google Picture:", picErr);
        } finally {
            toggleLoader(false);
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