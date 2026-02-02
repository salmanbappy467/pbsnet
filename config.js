// --- CONFIGURATION ---
const API_URL = 'https://lost-darsey-sbinc2jkj-81fcaf06.koyeb.app/api'; 

// Updated Sorted List (A-Z)
const PBS_LIST = [
    "Bagerhat PBS",
    "Barguna PBS",
    "Barishal PBS-1",
    "Barishal PBS-2",
    "Bhola PBS",
    "Bogura PBS-1",
    "Bogura PBS-2",
    "Brahmanbaria PBS",
    "Chandpur PBS-1",
    "Chandpur PBS-2",
    "Chapainawabganj PBS",
    "Chattogram PBS-1",
    "Chattogram PBS-2",
    "Chattogram PBS-3",
    "Chuadanga PBS",
    "Cox's Bazar PBS",
    "Cumilla PBS-1",
    "Cumilla PBS-2",
    "Cumilla PBS-3",
    "Cumilla PBS-4",
    "Dhaka PBS-1",
    "Dhaka PBS-2",
    "Dhaka PBS-3",
    "Dhaka PBS-4",
    "Dinajpur PBS-1",
    "Dinajpur PBS-2",
    "Faridpur PBS",
    "Feni PBS",
    "Gaibandha PBS",
    "Gazipur PBS",
    "Gopalganj PBS",
    "Habiganj PBS",
    "Jamalpur PBS",
    "Jashore PBS-1",
    "Jashore PBS-2",
    "Jhalakathi PBS",
    "Jhenaidah PBS",
    "Joypurhat PBS",
    "Khulna PBS",
    "Kishoreganj PBS",
    "Kurigram-Lalmonirhat PBS",
    "Kushtia PBS",
    "Lakshmipur PBS",
    "Madaripur PBS",
    "Magura PBS",
    "Manikganj PBS",
    "Meherpur PBS",
    "Moulvibazar PBS",
    "Munshiganj PBS",
    "Mymensingh PBS-1",
    "Mymensingh PBS-2",
    "Mymensingh PBS-3",
    "Naogaon PBS-1",
    "Naogaon PBS-2",
    "Narail PBS",
    "Narayanganj PBS-1",
    "Narayanganj PBS-2",
    "Narsingdi PBS-1",
    "Narsingdi PBS-2",
    "Natore PBS-1",
    "Natore PBS-2",
    "Netrokona PBS",
    "Nilphamari PBS",
    "Noakhali PBS",
    "Pabna PBS-1",
    "Pabna PBS-2",
    "Panchagarh PBS",
    "Patuakhali PBS",
    "Pirojpur PBS",
    "Rajbari PBS",
    "Rajshahi PBS",
    "Rangpur PBS-1",
    "Rangpur PBS-2",
    "Satkhira PBS",
    "Shariatpur PBS",
    "Sherpur PBS",
    "Sirajganj PBS-1",
    "Sirajganj PBS-2",
    "Sunamganj PBS",
    "Sylhet PBS-1",
    "Sylhet PBS-2",
    "Tangail PBS",
    "Thakurgaon PBS"
];

// --- UTILITIES ---
const getToken = () => localStorage.getItem('token');
const setToken = (t) => localStorage.setItem('token', t);
const clearAuth = () => { localStorage.removeItem('token'); location.reload(); };

// Global Toast Function
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
    document.getElementById('toast').classList.remove('-translate-y-32', 'opacity-0');
    setTimeout(()=>document.getElementById('toast').classList.add('-translate-y-32', 'opacity-0'), 3000); 
}

// Global Loader
function toggleLoader(s) { document.getElementById('global-loader').classList.toggle('hidden', !s); }

// Generic API Caller
async function apiCall(endpoint, method = 'GET', body = null, isFile = false) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    
    if (isFile) {
        options.body = body; 
    } else if (body) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();
        
        if (res.status === 401 || res.status === 403) {
            if(token) clearAuth();
            throw new Error(data.error || "Session Expired");
        }
        
        if (!res.ok) throw new Error(data.error || "Request Failed");
        return data;
    } catch (err) {
        throw err;
    }
}
