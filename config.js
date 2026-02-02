/**
 * 📂 File: config.js
 * ⚙️ Appwrite Configuration
 */

// --- APPWRITE INIT ---
const client = new Appwrite.Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // আপনার রিজিয়ন
    .setProject('pbsnet'); // আপনার Project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

// --- CONSTANTS ---
const DB_ID = 'central_db';
const COLL_PROFILE = 'user_profiles';
const BUCKET_ID = 'profile_pics';

// --- PBS LIST ---
const PBS_LIST = [
    "Bagerhat PBS", "Barguna PBS", "Barishal PBS-1", "Barishal PBS-2", "Bhola PBS",
    "Bogura PBS-1", "Bogura PBS-2", "Brahmanbaria PBS", "Chandpur PBS-1", "Chandpur PBS-2",
    "Chapainawabganj PBS", "Chattogram PBS-1", "Chattogram PBS-2", "Chattogram PBS-3",
    "Chuadanga PBS", "Cox's Bazar PBS", "Cumilla PBS-1", "Cumilla PBS-2", "Cumilla PBS-3",
    "Cumilla PBS-4", "Dhaka PBS-1", "Dhaka PBS-2", "Dhaka PBS-3", "Dhaka PBS-4",
    "Dinajpur PBS-1", "Dinajpur PBS-2", "Faridpur PBS", "Feni PBS", "Gaibandha PBS",
    "Gazipur PBS", "Gopalganj PBS", "Habiganj PBS", "Jamalpur PBS", "Jashore PBS-1",
    "Jashore PBS-2", "Jhalakathi PBS", "Jhenaidah PBS", "Joypurhat PBS", "Khulna PBS",
    "Kishoreganj PBS", "Kurigram-Lalmonirhat PBS", "Kushtia PBS", "Lakshmipur PBS",
    "Madaripur PBS", "Magura PBS", "Manikganj PBS", "Meherpur PBS", "Moulvibazar PBS",
    "Munshiganj PBS", "Mymensingh PBS-1", "Mymensingh PBS-2", "Mymensingh PBS-3",
    "Naogaon PBS-1", "Naogaon PBS-2", "Narail PBS", "Narayanganj PBS-1", "Narayanganj PBS-2",
    "Narsingdi PBS-1", "Narsingdi PBS-2", "Natore PBS-1", "Natore PBS-2", "Netrokona PBS",
    "Nilphamari PBS", "Noakhali PBS", "Pabna PBS-1", "Pabna PBS-2", "Panchagarh PBS",
    "Patuakhali PBS", "Pirojpur PBS", "Rajbari PBS", "Rajshahi PBS", "Rangpur PBS-1",
    "Rangpur PBS-2", "Satkhira PBS", "Shariatpur PBS", "Sherpur PBS", "Sirajganj PBS-1",
    "Sirajganj PBS-2", "Sunamganj PBS", "Sylhet PBS-1", "Sylhet PBS-2", "Tangail PBS",
    "Thakurgaon PBS"
];

// ✅ DESIGNATION LIST
const DESIGNATION_LIST = [
    "GM", "DGM", "AGM", "JE", "EC", "MTS", "MT", "LT", "LM", "BS", "BA", "MRCM", "WI", "Other"
];

// --- UTILITIES ---
function showToast(m, t='success') { 
    const b = document.getElementById('toast-bg'), i = document.getElementById('toast-icon');
    if(t==='success'){ 
        b.className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border border-emerald-400 bg-emerald-500 text-white font-bold text-sm backdrop-blur-md"; 
        i.className="fa-solid fa-circle-check"; 
    } else { 
        b.className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border border-red-400 bg-red-500 text-white font-bold text-sm backdrop-blur-md"; 
        i.className="fa-solid fa-circle-exclamation"; 
    }
    document.getElementById('toast-msg').innerText = m; 
    const toast = document.getElementById('toast');
    toast.classList.remove('-translate-y-32', 'opacity-0');
    setTimeout(()=> toast.classList.add('-translate-y-32', 'opacity-0'), 3000); 
}

function toggleLoader(s) { 
    document.getElementById('global-loader').classList.toggle('hidden', !s); 
}

// Logout Utility
async function logout() { 
    try {
        await account.deleteSession('current');
    } catch(e) { console.log(e); }
    location.reload(); 
}