/**
 * 📂 File: profile.js
 * 👤 Profile Management (SDK Based - Fixed)
 */

// ✅ Designation লোড করার ফাংশন
function populateDesignations() {
    const select = document.getElementById('e-post');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Select Designation</option>';
    if (typeof DESIGNATION_LIST !== 'undefined') {
        DESIGNATION_LIST.forEach(post => {
            const opt = document.createElement('option');
            opt.value = post;
            opt.innerText = post;
            select.appendChild(opt);
        });
    }
}

// ✅ PBS লোড করার ফাংশন
function populatePbs() {
    const select = document.getElementById('e-pbs');
    if (!select) return;
    
    if(select.options.length > 1) return; // ইতিমধ্যে লোড করা থাকলে বাদ দিন

    if (typeof PBS_LIST !== 'undefined') {
        PBS_LIST.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.innerText = p;
            select.appendChild(opt);
        });
    }
}

// --- LOAD PROFILE ---
async function loadUserProfile() {
    try {
        const user = await account.get(); // বর্তমান ইউজার
        const doc = await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
        
        // ছবির URL তৈরি
        let picUrl = null;
        if (doc.profile_pic_id) {
            try {
                const fileUrl = storage.getFileView(BUCKET_ID, doc.profile_pic_id);
                picUrl = fileUrl.href;
            } catch(e) { console.log("Image load error"); }
        }

        const fullData = { ...doc, profile_pic_url: picUrl };
        populateProfileUI(fullData); // UI তে ডাটা বসানো
        return fullData;
    } catch (e) {
        console.error("Profile Load Error:", e);
        throw e;
    }
}

// ✅ UI পপুলেট আপডেট (JSON Parse ফিক্স সহ)
function populateProfileUI(data) {
    let j = {};
    // ⚠️ CRITICAL: personal_json স্ট্রিং থেকে অবজেক্টে রূপান্তর
    try { 
        if (typeof data.personal_json === 'string') {
            j = JSON.parse(data.personal_json || "{}"); 
        } else {
            j = data.personal_json || {};
        }
    } catch(e){ console.log("JSON Parse Error", e); }

    // ড্রপডাউন লোড
    populatePbs();
    populateDesignations();

    // ছবি সেটআপ
    const avatar = data.profile_pic_url || `https://ui-avatars.com/api/?name=${data.full_name}&background=random`;
    if(document.getElementById('user-avatar')) document.getElementById('user-avatar').src = avatar;
    if(document.getElementById('nav-avatar')) document.getElementById('nav-avatar').src = avatar;

    // টেক্সট ফিল্ড
    setText('nav-user-name', data.full_name);
    setText('display-name-hero', data.full_name);
    setText('display-post-hero', data.post_name || "New Member");

    setText('v-name', data.full_name);
    setText('v-post', data.post_name || "-");
    setText('v-pbs', data.pbs_name || "-");
    setText('v-office', data.office_name || "-");
    setText('v-mobile', data.mobile || "-");
    setText('v-email', data.email || "-");
    
    // ইনপুট ভ্যালু
    setVal('api-key-input', data.api_key || "No Key Generated");
    setVal('username-input', data.username || "not_set");

    // JSON ডাটা ফিল্ড
    setText('v-district', j.own_district || "-");
    setText('v-joining', j.joining_date || "-");
    
    // সোস্যাল লিংক
    setText('v-facebook', j.facebook ? 'View Profile' : '-');
    setText('v-facebook-url', j.facebook || "");
    
    if(document.getElementById('link-whatsapp')) {
        document.getElementById('link-whatsapp').href = j.whatsapp ? `https://wa.me/${j.whatsapp.replace(/[^0-9]/g, '')}` : "#";
    }
    if(document.getElementById('link-call')) {
        document.getElementById('link-call').href = data.mobile ? `tel:${data.mobile}` : "#";
    }

    // এডিট ফর্ম পপুলেট (একটু দেরিতে যাতে ড্রপডাউন লোড হয়)
    setTimeout(() => {
        setVal('e-name', data.full_name);
        setVal('e-post', data.post_name || ""); 
        setVal('e-pbs', data.pbs_name || "");
        setVal('e-office', data.office_name || "");
        setVal('e-mobile', data.mobile || "");
        setVal('e-district', j.own_district || "");
        setVal('e-joining', j.joining_date || "");
        setVal('e-whatsapp', j.whatsapp || "");
        setVal('e-facebook', j.facebook || "");
    }, 200);
}

// হেল্পার ফাংশন
function setText(id, val) { if(document.getElementById(id)) document.getElementById(id).innerText = val; }
function setVal(id, val) { if(document.getElementById(id)) document.getElementById(id).value = val; }

// --- UPDATE PROFILE ---
async function saveProfile() {
    toggleLoader(true);
    try {
        const user = await account.get();
        const currentDoc = await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);
        
        let currentJson = {};
        try { currentJson = JSON.parse(currentDoc.personal_json || "{}"); } catch(e){}

        const updatedJson = {
            ...currentJson,
            own_district: document.getElementById('e-district').value,
            joining_date: document.getElementById('e-joining').value,
            whatsapp: document.getElementById('e-whatsapp').value,
            facebook: document.getElementById('e-facebook').value
        };

        await databases.updateDocument(DB_ID, COLL_PROFILE, user.$id, {
            full_name: document.getElementById('e-name').value,
            post_name: document.getElementById('e-post').value,
            pbs_name: document.getElementById('e-pbs').value,
            office_name: document.getElementById('e-office').value,
            mobile: document.getElementById('e-mobile').value,
            personal_json: JSON.stringify(updatedJson)
        });

        showToast("Profile Updated!");
        toggleEdit();
        location.reload(); 
    } catch(e) { showToast(e.message, 'error'); }
    finally { toggleLoader(false); }
}

// --- IMAGE UPLOAD ---
async function uploadImage() {
    const file = document.getElementById('file-upload').files[0];
    if(!file) return;

    toggleLoader(true);
    try {
        const user = await account.get();
        const doc = await databases.getDocument(DB_ID, COLL_PROFILE, user.$id);

        if (doc.profile_pic_id) {
            try { await storage.deleteFile(BUCKET_ID, doc.profile_pic_id); } 
            catch (err) { console.log("Old file cleanup failed"); }
        }

        const uploaded = await storage.createFile(BUCKET_ID, Appwrite.ID.unique(), file);

        await databases.updateDocument(DB_ID, COLL_PROFILE, user.$id, {
            profile_pic_id: uploaded.$id
        });

        showToast("Photo Updated!");
        location.reload();
    } catch(e) { showToast("Upload Failed: " + e.message, 'error'); }
    finally { toggleLoader(false); }
}

// --- OTHER ACTIONS ---
/*
async function changeUsername() {
    const newUser = prompt("Enter username (lowercase, no spaces):");
    if (!newUser) return;
    if (!/^[a-z0-9_]{3,20}$/.test(newUser)) return showToast("Invalid format!", "error");

    toggleLoader(true);
    try {
        const check = await databases.listDocuments(DB_ID, COLL_PROFILE, [Appwrite.Query.equal('username', newUser)]);
        if(check.total > 0) throw new Error("Username already taken!");

        const user = await account.get();
        await databases.updateDocument(DB_ID, COLL_PROFILE, user.$id, { username: newUser });
        
        document.getElementById('username-input').value = newUser;
        showToast("Username Updated!");
    } catch (e) { showToast(e.message, 'error'); } 
    finally { toggleLoader(false); }
}
*/

function copyUsername() {
    const txt = document.getElementById('username-input').value;
    if(txt && txt !== 'not_set') navigator.clipboard.writeText(txt).then(()=>showToast("Copied!"));
}

async function generateKey() { 
    if(!confirm("Generate new Key?")) return;
    try { 
        const key = 'pbsnet-' + Math.random().toString(36).substring(2, 18);
        const user = await account.get();
        await databases.updateDocument(DB_ID, COLL_PROFILE, user.$id, { api_key: key });
        document.getElementById('api-key-input').value = key; 
        showToast("Key Generated!"); 
    } catch(e) { showToast(e.message, 'error'); } 
}

function copyApiKey() {
    const key = document.getElementById('api-key-input').value;
    if (key) navigator.clipboard.writeText(key).then(()=>showToast("Copied!")); 
}

async function changePassword() { 
    const n = document.getElementById('cp-new').value; 
    if(!n) return showToast("Enter password", 'error'); 
    toggleLoader(true); 
    try { 
        await account.updatePassword(n); 
        showToast("Password Changed!");
        toggleSecurity();
    } catch(e) { showToast(e.message, 'error'); } 
    finally { toggleLoader(false); } 
}

function openFacebook() { 
    const u = document.getElementById('v-facebook-url').innerText; 
    if(u) window.open(u.startsWith('http')?u:'https://'+u, '_blank'); 
}
function toggleEdit() { 
    document.getElementById('profile-details').classList.toggle('hidden'); 
    document.getElementById('profile-edit').classList.toggle('hidden'); 
    document.getElementById('security-form').classList.add('hidden'); 
}
function toggleSecurity() { 
    document.getElementById('security-form').classList.toggle('hidden'); 
    document.getElementById('profile-edit').classList.add('hidden'); 
    document.getElementById('profile-details').classList.remove('hidden'); 
}