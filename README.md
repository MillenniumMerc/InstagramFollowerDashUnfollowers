# Local Instagram Profile Integrity Audit Tool

A privacy-first, zero-login local automation script designed to bypass Meta's data-masking mechanisms and identify accounts that do not follow you back. 

## 🛡️ Why This Project Exists
Meta obfuscates the grim reality of people losing followers as that hurts their metrics and including such a simple feature in the app itself would collapse a large portion of their users. Third-party mobile apps that require an Instagram login often compromise user credentials or trigger Meta's automated spam filters, leading to account bans or action blocks. Meta deliberately throttles browser user interfaces and truncates single-year data exports to mask connection telemetry, weaponizing friction to prevent network cleanups. I cannot stand such practices nor wish to sell my private network data to AI companies.

This application provides a completely secure, offline, data-sovereign solution by parsing raw, official "All-Time" Meta JSON server data dumps directly on the client machine.

## 🚀 Key Architectural Features
- **File System Auto-Aggregation:** Automatically scans the runtime directory and flattens multiple paginated JSON chunks (e.g., `followers_1.json`, `followers_2.json`) into a unified local `Set` for performance optimization.
- **Data Normalization:** Overcomes Meta's erratic database schema formatting (mapping asynchronous variations between root object metadata strings and nested `string_list_data` arrays).
- **Dynamic Dashboard Compilation:** Dynamically builds a local, self-contained HTML/CSS visual dashboard with native browser link interpolation for seamless, manual review cycles.

## 🛠️ How to Run Locally
1. Request your official account archive from Meta (Select **Followers and following** with the date filter explicitly checked to **All Time** in **JSON** format). One should receive a connections folder with 'followers_[]' and following JSON source files.
2. Unzip and drop the connection JSON files into the root directory of this repository.
3. Execute the script in your terminal:
   ```bash
   node index.js
   ```
4. Double-click the generated `audit_dashboard.html` file in your file explorer to launch your private dark-themed dashboard.

## 🔒 Privacy Notice
This script runs entirely client-side. No user parameters, credentials, tokens, or network structures are transmitted to external endpoints or third-party cloud environments. Ensure your personal `.json` targets remain ignored via the configured `.gitignore`.
