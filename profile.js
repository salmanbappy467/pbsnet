// --- PROFILE MANAGEMENT ---

// UI তে ডাটা সেট করা
function populateProfileUI(data) {
    const j = data.personal_json || {};
    
    // Images
    const avatar = data.profile_pic_url || `https://ui-avatars.com/api/?name=${data.full_name}&background=random`;
    document.getElementById('user-avatar').src = avatar;
    document.getElementById('nav-avatar').src = avatar;

    // Navbar & Hero
    document.getElementById('nav-user-name').innerText = data.full_name;
    document.getElementById('display-name-hero').innerText = data.full_name;
    document.getElementById('display-post-hero').innerText = data.post_name || "New Member";

    // View Mode Fields
    document.getElementById('v-name').innerText = data.full_name;
    document.getElementById('v-post').innerText = data.post_name || "-";
    document.getElementById('v-pbs').innerText = data.pbs_name || "-";
    document.getElementById('v-office').innerText = data.office_name || "-";
    document.getElementById('v-mobile').innerText = data.mobile || "-";
    document.getElementById('v-email').innerText = data.email || "-";
    
    // Developer API Key & Username Set
    document.getElementById('api-key-input').value = data.api_key || "No Key Generated";
    document.getElementById('username-input').value = data.username || "not_set"; // 🆕 Username Load

    // JSON Fields
    document.getElementById('v-district').innerText = j.own_district || "-";
    document.getElementById('v-joining').innerText = j.joining_date || "-";
    
    // Social Links
    const fb = j.facebook || "-";
    document.getElementById('v-facebook').innerText = getFbUsername(fb);
    document.getElementById('v-facebook-url').innerText = fb;

    const wa = j.whatsapp || "";
    document.getElementById('link-whatsapp').href = wa ? `https://wa.me/${wa.replace(/[^0-9]/g, '')}` : "#";
    document.getElementById('link-call').href = data.mobile ? `tel:${data.mobile}` : "#";

    // Edit Inputs Population
    document.getElementById('e-name').value = data.full_name;
    document.getElementById('e-post').value = data.post_name || "";
    document.getElementById('e-pbs').value = data.pbs_name || "";
    document.getElementById('e-office').value = data.office_name || "";
    document.getElementById('e-mobile').value = data.mobile || "";
    document.getElementById('e-district').value = j.own_district || "";
    document.getElementById('e-joining').value = j.joining_date || "";
    document.getElementById('e-whatsapp').value = j.whatsapp || "";
    document.getElementById('e-facebook').value = j.facebook || "";
}

// --- CORE PROFILE ACTIONS ---

async function saveProfile() {
    toggleLoader(true);
    try {
        // Update Core Data
        await apiCall('/me', 'PUT', {
            full_name: document.getElementById('e-name').value,
            post_name: document.getElementById('e-post').value,
            pbs_name: document.getElementById('e-pbs').value,
            office_name: document.getElementById('e-office').value,
            mobile: document.getElementById('e-mobile').value
        });

        // Update JSON Data
        await apiCall('/me/json', 'PATCH', {
            own_district: document.getElementById('e-district').value,
            joining_date: document.getElementById('e-joining').value,
            whatsapp: document.getElementById('e-whatsapp').value,
            facebook: document.getElementById('e-facebook').value
        });

        showToast("Profile Updated!");
        toggleEdit();
        location.reload(); 
    } catch(e) { showToast(e.message, 'error'); }
    finally { toggleLoader(false); }
}

async function uploadImage() {
    const file = document.getElementById('file-upload').files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    toggleLoader(true);
    try {
        await apiCall('/me/pic', 'POST', formData, true);
        showToast("Photo Updated!");
        location.reload();
    } catch(e) { showToast("Upload Failed: " + e.message, 'error'); }
    finally { toggleLoader(false); }
}

// --- USERNAME FUNCTIONS (NEW) ---

async function changeUsername() {
    const current = document.getElementById('username-input').value;
    const newUser = prompt("Enter new username (lowercase, no spaces):", current === "not_set" ? "" : current);
    
    if (!newUser) return; // Cancelled
    
    // Validation: only a-z, 0-9, underscore allowed, 3-20 chars
    if (!/^[a-z0-9_]{3,20}$/.test(newUser)) {
        return showToast("Invalid! Use a-z, 0-9, _ (3-20 chars)", "error");
    }

    toggleLoader(true);
    try {
        await apiCall('/me/username', 'POST', { newUsername: newUser });
        document.getElementById('username-input').value = newUser;
        showToast("Username Updated!");
    } catch (e) {
        showToast(e.message, 'error');
    } finally {
        toggleLoader(false);
    }
}

function copyUsername() {
    const username = document.getElementById('username-input').value;
    if (username === "not_set" || !username) {
        return showToast("No username set!", "error");
    }
    
    navigator.clipboard.writeText(username).then(() => {
        showToast("Username Copied!");
    });
}

// --- API KEY FUNCTIONS ---

async function generateKey() { 
    if(!confirm("Generate new API Key? Old one will stop working.")) return;
    
    try { 
        const data = await apiCall('/me/key', 'POST', {}); 
        document.getElementById('api-key-input').value = data.key; 
        showToast("New API Key Generated!"); 
    } catch(e) { showToast(e.message, 'error'); } 
}

function copyApiKey() { 
    const key = document.getElementById('api-key-input').value;
    if (!key || key === "...") return;
    navigator.clipboard.writeText(key).then(()=>showToast("API Key Copied!")); 
}

// --- SECURITY & HELPERS ---

async function changePassword() { 
    const n = document.getElementById('cp-new').value; 
    if(!n) return showToast("Enter new password", 'error'); 
    
    toggleLoader(true); 
    try { 
        await apiCall('/me/pass', 'POST', { newPassword: n }); 
        showToast("Password Changed. Logging out..."); 
        setTimeout(() => {
            localStorage.removeItem('token');
            location.reload();
        }, 2000); 
    } catch(e) { showToast(e.message, 'error'); } 
    finally { toggleLoader(false); } 
}

// Social Link Parser
function getFbUsername(url) { 
    if (!url || url === '-') return '-'; 
    try { 
        if (!url.includes('.')) return '@' + url.replace('@', ''); 
        const u = new URL(url.startsWith('http') ? url : 'https://' + url); 
        return u.pathname.includes('profile.php') ? 'Profile' : '@' + u.pathname.split('/').filter(Boolean)[0]; 
    } catch { return 'Link'; } 
}

function openFacebook() { 
    const u = document.getElementById('v-facebook-url').innerText; 
    if(u && u!=='-') window.open(u.startsWith('http')?u:'https://'+u, '_blank'); 
}

// Toggle Views
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