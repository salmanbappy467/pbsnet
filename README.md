নিচে একটি বিস্তারিত এবং প্রফেশনাল `README.md` ফাইল তৈরি করে দেওয়া হলো। এটি এমনভাবে সাজানো হয়েছে যেন **অন্য কোনো AI (যেমন: ChatGPT, Gemini, Copilot)** বা ডেভেলপার এটি পড়লে তাৎক্ষণিকভাবে বুঝতে পারে যে Appwrite-এ ডাটাবেস, স্টোরেজ এবং অথেনটিকেশন কীভাবে কনফিগার করতে হবে।

এটি আপনার প্রজেক্ট ফোল্ডারে `README.md` নামে সেভ করুন।

---

```markdown
# pbsNet - Central Identity Hub 🛡️

**pbsNet** is a Single Page Application (SPA) designed as a centralized identity management system for PBS employees. It utilizes **Appwrite** as the Backend-as-a-Service (BaaS) for authentication, database, and storage.

This documentation serves as a **System Blueprint** for AI agents and developers to replicate the Appwrite environment.

---

## 🛠️ Tech Stack

* **Frontend:** Vanilla HTML5, JavaScript (ES6+), Tailwind CSS (via CDN).
* **Backend:** Appwrite Cloud / Self-Hosted.
* **Icons:** FontAwesome 6.4.0.

---

## 🚀 Appwrite Configuration Blueprint

To run this project, the Appwrite project must be configured exactly as described below.

### 1. Project Settings
* **Platform:** Web App
* **Hostname:** `*` (or your specific domain like `localhost`, `pbsnet.com`)
* **Authentication Services:**
    * ✅ **Email/Password** (Enabled)
    * ✅ **Phone** (Enabled - required for Smart Login logic)
    * ✅ **Google OAuth2** (Enabled)

### 2. Database Schema

* **Database Name:** `Central DB`
* **Database ID:** `central_db`

#### Collection: User Profiles
* **Collection Name:** `User Profiles`
* **Collection ID:** `user_profiles`
* **Document Security:** 🟢 **Enabled** (Crucial)
* **Permissions:**
    * `Role: users` -> `create`, `read`, `update`
    * *(Optional)* `Role: any` -> `read` (If profiles are public)

**Attributes (Columns):**

| Key | Type | Size | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `full_name` | String | 128 | No | User's display name |
| `email` | String | 128 | Yes | User's email address |
| `mobile` | String | 20 | No | Primary mobile number |
| `post_name` | String | 128 | No | Designation (e.g., AGM, JE) |
| `office_name` | String | 128 | No | Office Name |
| `pbs_name` | String | 128 | No | Dropdown value (e.g., Dhaka PBS-1) |
| `api_key` | String | 256 | No | Generated secure key for external apps |
| `profile_pic_id`| String | 128 | No | File ID from Storage Bucket |
| `personal_json` | String | 5000 | No | JSON String for flexible data |

**Indexes:**

| Key | Type | Attribute | Order | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `idx_mobile` | Key | `mobile` | ASC | Used for "Smart Login" (Phone -> Email lookup) |

**`personal_json` Structure:**
To keep the schema clean, specific details are stored as a stringified JSON object in the `personal_json` attribute:
```json
{
  "own_district": "Dhaka",
  "joining_date": "2023-01-01",
  "whatsapp": "017XXXXXXXX",
  "facebook": "[https://facebook.com/username](https://facebook.com/username)"
}

```

---

### 3. Storage Bucket

* **Bucket Name:** `Profile Pictures`
* **Bucket ID:** `profile_pics`
* **File Security:** 🟢 **Enabled**
* **Permissions:**
* `Role: any` -> `read` (Images visible to public/app)
* `Role: users` -> `create`, `delete` (Users manage their own photos)


* **Allowed Extensions:** `jpg`, `jpeg`, `png`, `webp`
* **Max File Size:** 5MB (Recommended)

---

## 🧩 Application Logic & Workflows

### A. Smart Login System

The system accepts either an **Email** or a **Phone Number** in the login field.

1. **Input Check:** Code checks if the input contains `@`.
2. **If Email:** Direct `account.createEmailPasswordSession()`.
3. **If Phone:**
* Queries `user_profiles` collection using `idx_mobile` index.
* Retrieves the linked `email` from the document.
* Logs in using the retrieved `email` + entered `password`.



### B. Profile Image Management

* **Upload:** Uses `storage.createFile()`.
* **Auto-Cleanup:** Before uploading a new photo, the code checks if `profile_pic_id` exists in the database. If yes, it calls `storage.deleteFile()` to remove the old image to save space.
* **Display:** Uses `storage.getFileView()` to bypass transformation limits on free plans.

### C. Personal Data Handling

Data fields like *District, Joining Date, WhatsApp, Facebook* are strictly handled within the `personal_json` attribute.

* **Read:** `JSON.parse(doc.personal_json)`
* **Write:** `JSON.stringify(updatedObject)`

---

## 💻 Installation / Setup

1. **Clone/Download** the `index.html` file.
2. **Update Config:** Open `index.html` and modify the SDK initialization block:
```javascript
const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // e.g., [https://sgp.cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)
    .setProject('pbsnet');

```


3. **Run:** Open `index.html` in any modern browser. No build process (npm/yarn) is required.

---

## ⚠️ Common Troubleshooting for AIs

If generating code based on this project, ensure:

1. **CORS:** The Appwrite project has the frontend domain added in *Overview > Platforms*.
2. **Permissions:** If `401` errors occur, check `Document Security` permissions in the Database settings.
3. **Attribute Size:** Ensure `personal_json` is large enough (5000+ chars) to hold the stringified data.
4. **Index:** The `mobile` index is mandatory for phone login to work.

---

*Generated by pbsNet Architect AI*

```
``