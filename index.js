const fs = require('fs');
const path = require('path');

try {
    console.log(`\n=== RUNNING ACCOUNT INTEGRITY AUDIT + DASHBOARD BUILDER ===`);

    // 1. Scan directory for Meta JSON files
    const files = fs.readdirSync('.');
    const followerFiles = files.filter(f => f.startsWith('followers_') && f.endsWith('.json'));
    const followingFiles = files.filter(f => f.startsWith('following') && f.endsWith('.json'));

    if (followerFiles.length === 0 || followingFiles.length === 0) {
        throw new Error("Missing files! Place your new all-time JSON files into this exact directory.");
    }

    // 2. Process Following
    let followingList = [];
    followingFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const rawFollowing = data.relationships_following || data;
        const users = rawFollowing.map(item => item.title).filter(Boolean);
        followingList = followingList.concat(users);
    });

    // 3. Process Followers
    const followersSet = new Set();
    followerFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        data.forEach(item => {
            if (item.string_list_data && item.string_list_data.length > 0) {
                const username = item.string_list_data[0].value;
                if (username) followersSet.add(username);
            }
        });
    });

    // 4. Isolate the Non-Followers
    const snakes = followingList.filter(user => !followersSet.has(user));

    console.log(`--------------------------------------------------`);
    console.log(`Total you follow:        ${followingList.length}`);
    console.log(`Total following you:     ${followersSet.size}`);
    console.log(`🚨 Verified Non-Followers:    ${snakes.length}\n`);

    // 5. Generate a Local HTML Dashboard for Quick Navigation
    if (snakes.length > 0) {
        // Create pure text backup
        fs.writeFileSync('verified_snakes.txt', snakes.join('\n'));

        // Build the HTML Interface
        const htmlLinks = snakes.map(user => 
            `<li><a href="https://instagram.com/${user}/" target="_blank">@${user}</a></li>`
        ).join('\n');

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Integrity Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; max-width: 600px; margin: 40px auto; padding: 20px; }
        h1 { color: #f1f5f9; border-bottom: 20px; }
        .stats { background: #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #334155; }
        .stats p { margin: 8px 0; font-size: 1.1rem; }
        .alert { color: #f43f5e; font-weight: bold; }
        ul { list-style: none; padding: 0; }
        li { background: #1e293b; margin: 8px 0; padding: 12px 16px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; transition: background 0.2s; }
        li:hover { background: #334155; }
        a { color: #38bdf8; text-decoration: none; font-weight: 500; font-size: 1.1rem; display: block; width: 100%; }
        a:after { content: ' ↗'; font-size: 0.8rem; color: #7dd3fc; }
    </style>
</head>
<body>
    <h1>Profile Integrity Dashboard</h1>
    <div class="stats">
        <p>Total You Follow: <strong>${followingList.length}</strong></p>
        <p>Total Following You: <strong>${followersSet.size}</strong></p>
        <p class="alert">Verified Non-Followers: ${snakes.length}</p>
    </div>
    <h3>Click a profile to open and review/unfollow manually:</h3>
    <ul>
        ${htmlLinks}
    </ul>
</body>
</html>`;

        fs.writeFileSync('audit_dashboard.html', htmlContent);
        console.log(`[Success! Clickable Dashboard created: audit_dashboard.html]`);
        console.log(`Double-click 'audit_dashboard.html' in your folder to open it in your browser.`);
    } else {
        console.log(`Zero snakes found. Your profile integrity is 100% clean!`);
    }

} catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
}
