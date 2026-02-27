// CyberShield — Complete Question Bank
// 10 attack categories × 5 questions each = 50 questions
// Each question has: id, type, category, difficulty, scenario, answer, explanation, redFlags

const QUESTION_BANK = {

  // ─────────────────────────────────────────────
  // 1. PHISHING EMAILS
  // ─────────────────────────────────────────────
  phishing: [
    {
      id: 'ph001', category: 'phishing', difficulty: 'easy',
      scenario: {
        type: 'email',
        from: 'security-alert@paypa1.com',
        to: 'you@gmail.com',
        subject: '⚠️ URGENT: Your PayPal Account Has Been Suspended',
        body: `Dear Valued Customer,\n\nWe have detected <b>unusual login activity</b> on your account from IP 185.234.XX.XX (Russia). Your account has been <b>temporarily suspended</b>.\n\nTo restore access immediately, verify your identity within <b>24 HOURS</b> or your account will be permanently closed and funds frozen.\n\n→ Click here to verify: http://paypa1-secure.account-verify.net/restore?token=abc123\n\nPayPal Security Team`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 100,
      explanation: 'The sender domain is "paypa1.com" (number 1 instead of letter l) — classic typosquatting. The link points to "account-verify.net", not paypal.com. Real PayPal never sends threatening "24-hour" ultimatums.',
      redFlags: ['Typosquatted domain (paypa1.com)', 'External link domain mismatch', 'Urgency + threat tactic', 'Suspicious IP mention to create fear']
    },
    {
      id: 'ph002', category: 'phishing', difficulty: 'easy',
      scenario: {
        type: 'email',
        from: 'hr@cornpany-india.com',
        to: 'employee@cornpany.com',
        subject: 'New Salary Revision — Open Attachment to View Details',
        body: `Dear Employee,\n\nPlease find attached the updated salary revision document effective this month.\n\nKindly <b>open the attachment and Enable Macros</b> to view the complete document with your revised CTC breakdown.\n\nThis document is confidential. Do not share with colleagues.\n\nBest Regards,\nHR Department`,
        hasAttachment: true,
        attachmentName: 'Salary_Revision_2025.xlsm'
      },
      answer: 'threat',
      points: 120,
      explanation: '"Enable Macros" is the #1 method for delivering malware via Office documents. The domain "cornpany-india.com" is not your company\'s domain. Salary bait creates emotional urgency to click without thinking.',
      redFlags: ['"Enable Macros" instruction', 'Unofficial domain (cornpany-india.com)', 'Macro-enabled Excel file (.xlsm)', 'Emotional bait (salary information)']
    },
    {
      id: 'ph003', category: 'phishing', difficulty: 'medium',
      scenario: {
        type: 'email',
        from: 'noreply@github.com',
        to: 'developer@mycompany.com',
        subject: '[GitHub] Please verify your email address',
        body: `Hi there,\n\nWe need to verify your email address to keep your GitHub account secure.\n\nPlease click the button below to verify:\nhttps://github.com/users/email_verifications/abc123xyz456\n\nThis link will expire in 24 hours.\n\nIf you didn't create a GitHub account, you can safely ignore this email.\n\nThanks,\nThe GitHub Team`,
        hasAttachment: false
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is legitimate. Sender is @github.com (official), the link goes directly to github.com with no redirects, the tone is calm with no threats, and it offers a safe "ignore" option — phishing emails never do that.',
      redFlags: []
    },
    {
      id: 'ph004', category: 'phishing', difficulty: 'hard',
      scenario: {
        type: 'email',
        from: 'support@arnazon.com',
        to: 'shopper@gmail.com',
        subject: 'Your Amazon Order #114-2847291 — Action Required',
        body: `Hello,\n\nWe were unable to process your recent order due to a payment verification issue.\n\nOrder #114-2847291 — ₹4,299\n\nPlease update your payment information within 12 hours to avoid order cancellation:\nhttps://www.arnazon.com/account/payment-update?ref=114-2847291\n\nAmazon Customer Service`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 150,
      explanation: 'The sender domain is "arnazon.com" — rn looks like m but it\'s two characters. The link also goes to arnazon.com, not amazon.com. This is a highly convincing homograph attack — always examine domain names character by character.',
      redFlags: ['Homograph domain attack (arnazon vs amazon)', '12-hour pressure tactic', 'Payment details request', 'Link domain matches fake sender — designed to look consistent']
    },
    {
      id: 'ph005', category: 'phishing', difficulty: 'medium',
      scenario: {
        type: 'email',
        from: 'billing@netflix.com',
        to: 'user@gmail.com',
        subject: 'Your Netflix membership has been paused',
        body: `Hi,\n\nWe're having trouble with your current billing information and have paused your Netflix membership.\n\nTo continue enjoying Netflix, please update your payment information:\nhttps://www.netflix.com/account/update-payment\n\nIf you don't update by April 15, your account will be closed.\n\nNetflix Support`,
        hasAttachment: false
      },
      answer: 'safe',
      points: 120,
      explanation: 'Sender is @netflix.com (genuine), link goes to netflix.com directly, the message is calm and professional. Netflix does send legitimate billing failure emails. However — always navigate directly to Netflix.com rather than clicking email links as a best practice.',
      redFlags: []
    }
  ],

  // ─────────────────────────────────────────────
  // 2. FAKE POP-UPS / SCAREWARE
  // ─────────────────────────────────────────────
  popup: [
    {
      id: 'pu001', category: 'popup', difficulty: 'easy',
      scenario: {
        type: 'popup',
        icon: '🛡️',
        title: 'CRITICAL VIRUS ALERT — Microsoft Security',
        body: 'Your computer is infected with 5 viruses! Trojan.GenericKD.46274852 has been detected. Your personal data, banking passwords, and photos are at risk. Call Microsoft Support NOW: 1-800-745-2091',
        buttons: ['Fix Now (Free)', 'Ignore (Dangerous)'],
        source: 'Browser Pop-up on news website'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Browsers CANNOT detect viruses — only installed antivirus software can. This is a classic tech support scam. The phone number leads to scammers who charge ₹5,000–20,000 for fake "fixes" and may install real malware.',
      redFlags: ['Browser claiming to detect viruses (impossible)', 'Phone number in a web alert', '"Ignore (Dangerous)" label to prevent closing', 'Urgency + fear about personal data']
    },
    {
      id: 'pu002', category: 'popup', difficulty: 'easy',
      scenario: {
        type: 'popup',
        icon: '🎉',
        title: 'Congratulations! You Are Today\'s Lucky Winner!',
        body: 'You are the 1,000,000th visitor to this site! You have won a Samsung Galaxy S24 Ultra. Claim your prize before the timer runs out! ⏱️ 02:47',
        buttons: ['Claim My Prize!', 'Enter Details to Collect'],
        source: 'Pop-up while browsing a shopping site'
      },
      answer: 'threat',
      points: 100,
      explanation: 'No website gives away phones to random visitors. The countdown timer is fake — it resets on refresh. Clicking leads to personal data harvesting or a subscription scam. "You\'ve been selected" with no prior entry is always fraud.',
      redFlags: ['Unsolicited prize with no entry', 'Countdown timer creates false urgency', 'Requires personal details to "claim"', 'Too good to be true reward']
    },
    {
      id: 'pu003', category: 'popup', difficulty: 'medium',
      scenario: {
        type: 'popup',
        icon: '🔄',
        title: 'Flash Player Update Required',
        body: 'Your Adobe Flash Player is out of date. Some content on this page requires the latest version. Please download the update to continue viewing this video.',
        buttons: ['Download Update', 'Remind Me Later'],
        source: 'Pop-up on a video streaming site'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Adobe Flash Player was permanently discontinued in December 2020. Any "Flash update" prompt is malware. Legitimate software updates come from the software itself or official app stores — never from random websites.',
      redFlags: ['Flash Player discontinued since 2020', 'Unsolicited download prompt from website', 'Software updates never come from random sites', 'Designed to trick older users unfamiliar with Flash\'s end-of-life']
    },
    {
      id: 'pu004', category: 'popup', difficulty: 'medium',
      scenario: {
        type: 'popup',
        icon: '🔒',
        title: 'Two-Factor Authentication Request',
        body: 'A sign-in was attempted on your Google account from: Chrome on Windows 11, New Delhi IN at 10:43 AM. Approve this sign-in if this was you.',
        buttons: ['Yes, It\'s Me', 'No, Block This'],
        source: 'Notification on your phone from Google app'
      },
      answer: 'safe',
      points: 120,
      explanation: 'This is a legitimate Google 2FA push notification. It shows specific device and location details, provides a deny option, and comes from your installed Google app — not a random website. Always review 2FA requests you did not initiate.',
      redFlags: []
    },
    {
      id: 'pu005', category: 'popup', difficulty: 'hard',
      scenario: {
        type: 'popup',
        icon: '⚠️',
        title: 'Your Browser is Severely Outdated',
        body: 'Security researchers have identified a critical zero-day vulnerability (CVE-2024-7894) in your browser version. Hackers are actively exploiting this. Update immediately to protect your passwords and banking data.',
        buttons: ['Update Now — Secure My Browser', 'View CVE Details'],
        source: 'Full-screen overlay on a legitimate-looking security blog'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Using a real CVE number makes this look credible, but browser updates are delivered through the browser\'s own update mechanism — never through websites. "Update Now" would download malware. Real security advisories don\'t have download buttons.',
      redFlags: ['Browser updates never come from websites', 'Real CVE numbers used to appear credible', 'Full-screen overlay prevents easy closing', '"Update" button would install malware, not a real browser update']
    }
  ],

  // ─────────────────────────────────────────────
  // 3. URL / DOMAIN SPOOFING
  // ─────────────────────────────────────────────
  url: [
    {
      id: 'ur001', category: 'url', difficulty: 'easy',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://www.sbi.co.in/web/personal-banking/accounts/saving-account',
        context: 'You want to check your SBI savings account online. You typed "SBI bank" in Google and clicked the first result.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is the official SBI website. HTTPS with valid lock, domain is sbi.co.in (the real domain), .co.in is a legitimate Indian domain. The path structure is consistent with a real bank\'s navigation.',
      redFlags: []
    },
    {
      id: 'ur002', category: 'url', difficulty: 'easy',
      scenario: {
        type: 'url',
        protocol: 'http',
        lock: false,
        url: 'http://sbi-netbanking-login.com/secure/account/verify',
        context: 'You received an SMS saying your SBI account needs verification. You clicked the link in the SMS.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'The real SBI domain is sbi.co.in — this uses a completely different domain "sbi-netbanking-login.com". HTTP means no encryption. Banks never ask you to verify accounts via SMS links. This is a classic smishing (SMS phishing) attack.',
      redFlags: ['Wrong domain (not sbi.co.in)', 'No HTTPS — connection is unencrypted', 'Came via SMS link — banks don\'t do this', '"secure" in URL path is a false trust signal']
    },
    {
      id: 'ur003', category: 'url', difficulty: 'medium',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://g00gle.com/free-recharge/claim?mobile=your-number',
        context: 'A WhatsApp forward says Google is giving free ₹500 recharge to celebrate their anniversary. You tapped the link.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'The domain is "g00gle.com" — zeros instead of the letter O. HTTPS only means the connection is encrypted, NOT that the site is safe. Google does not give away free recharges via WhatsApp forwards — this is a data harvesting scam.',
      redFlags: ['Homograph attack: g00gle vs google', 'HTTPS ≠ safe — just encrypted', 'Free recharge scam is extremely common in India', 'Spread via WhatsApp forward — a major red flag']
    },
    {
      id: 'ur004', category: 'url', difficulty: 'hard',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://accounts.google.com.phishing-site.ru/oauth/signin',
        context: 'You want to sign in to a third-party app using Google. This URL appeared in your browser.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This is a subdomain attack. The REAL domain here is "phishing-site.ru" — everything before it ("accounts.google.com") is just a subdomain. Your browser reads domains right-to-left from the TLD. Real Google OAuth is at accounts.google.com with nothing after .com except /path.',
      redFlags: ['Domain is phishing-site.ru, not google.com', 'accounts.google.com is just a subdomain of the malicious domain', 'Russian TLD (.ru) for a Google service', 'This tricks even technical users — read domains right-to-left']
    },
    {
      id: 'ur005', category: 'url', difficulty: 'medium',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://zoom.us/j/94821847362?pwd=meeting123',
        context: 'Your manager sent this Zoom meeting link via company email for a team standup.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is a legitimate Zoom meeting URL. zoom.us is Zoom\'s official domain, HTTPS is valid, the /j/ path is standard for Zoom meeting join links, and the numeric meeting ID format is correct. Sent via company email adds legitimacy.',
      redFlags: []
    }
  ],

  // ─────────────────────────────────────────────
  // 4. PASSWORD SAFETY
  // ─────────────────────────────────────────────
  password: [
    {
      id: 'pw001', category: 'password', difficulty: 'easy',
      scenario: {
        type: 'password_rank',
        question: 'Which password is the STRONGEST?',
        options: [
          { pw: 'password123', hint: 'Common word + numbers' },
          { pw: 'P@ssw0rd!', hint: 'L33tspeak substitution' },
          { pw: 'xK#9mRvL$2qN!8', hint: 'Random mixed characters' },
          { pw: 'qwerty2024', hint: 'Keyboard pattern + year' }
        ]
      },
      answer: 'option3',
      points: 100,
      explanation: 'xK#9mRvL$2qN!8 is strongest — 14 truly random characters with no dictionary words. Password crackers test dictionary words and common substitutions (l33tspeak) first. Random = unguessable. Always use a password manager to store such passwords.',
      redFlags: []
    },
    {
      id: 'pw002', category: 'password', difficulty: 'easy',
      scenario: {
        type: 'password_rank',
        question: 'Which practice is the MOST DANGEROUS?',
        options: [
          { pw: 'Using same password everywhere', hint: 'One breach = all accounts compromised' },
          { pw: 'Using a password manager', hint: 'Stores all passwords securely encrypted' },
          { pw: 'Enabling 2FA on all accounts', hint: 'Extra verification layer' },
          { pw: '16-character unique password per site', hint: 'Long, unique, no reuse' }
        ]
      },
      answer: 'option1',
      points: 100,
      explanation: 'Password reuse is the #1 account takeover method. Attackers take breached credentials and automatically try them across 100+ sites (credential stuffing). Billions of username/password combos are available on the dark web right now.',
      redFlags: []
    },
    {
      id: 'pw003', category: 'password', difficulty: 'medium',
      scenario: {
        type: 'password_rank',
        question: 'Which password is SAFEST against brute-force attacks?',
        options: [
          { pw: 'Raj@Mumbai1995', hint: 'Personal info + symbols' },
          { pw: 'correct-horse-battery-staple', hint: 'Four random words passphrase' },
          { pw: 'Admin@2024', hint: 'Common word + year + symbol' },
          { pw: 'iloveyou123!', hint: 'Common phrase + numbers' }
        ]
      },
      answer: 'option2',
      points: 120,
      explanation: '"correct-horse-battery-staple" style passphrases are extremely strong — 4 random words = ~44 bits of entropy, easy to remember but takes centuries to crack. Personal info (Raj@Mumbai1995) is guessable from social media. Length beats complexity every time.',
      redFlags: []
    },
    {
      id: 'pw004', category: 'password', difficulty: 'medium',
      scenario: {
        type: 'password_rank',
        question: 'A website asks: "Create a security question — What is your mother\'s maiden name?" What should you do?',
        options: [
          { pw: 'Answer truthfully with real maiden name', hint: 'Accurate and easy to remember' },
          { pw: 'Use a random fake answer and save it in password manager', hint: 'Fake but stored securely' },
          { pw: 'Leave it blank if possible', hint: 'Avoid the feature entirely' },
          { pw: 'Use your pet\'s name instead', hint: 'Different but still personal info' }
        ]
      },
      answer: 'option2',
      points: 120,
      explanation: 'Security questions are notoriously weak — answers are often findable on social media. Using a random fake answer (e.g., "purple-elephant-42") and storing it in your password manager gives security without exploitable personal data.',
      redFlags: []
    },
    {
      id: 'pw005', category: 'password', difficulty: 'hard',
      scenario: {
        type: 'password_rank',
        question: 'You receive: "Your password must be 8 characters, contain uppercase, lowercase, number, and symbol." Which meets requirements AND is strongest?',
        options: [
          { pw: 'Welcome1!', hint: '8 chars, all requirements met' },
          { pw: 'P4$$word', hint: '8 chars, l33tspeak' },
          { pw: 'Tr0ub4dor&', hint: '10 chars, modified word' },
          { pw: 'mN!8xQvL2$kR', hint: '12 chars, random' }
        ]
      },
      answer: 'option4',
      points: 150,
      explanation: 'mN!8xQvL2$kR wins — 12 truly random characters. "Welcome1!" is one of the most common passwords globally. Meeting minimum requirements ≠ strong password. Always use more than the minimum length. More random characters = exponentially harder to crack.',
      redFlags: []
    }
  ],

  // ─────────────────────────────────────────────
  // 5. SOCIAL ENGINEERING
  // ─────────────────────────────────────────────
  social: [
    {
      id: 'se001', category: 'social', difficulty: 'easy',
      scenario: {
        type: 'message',
        channel: 'WhatsApp',
        from: 'Unknown Number +91-XXXXXXXXXX',
        message: 'Hello, I am calling from TRAI. Your mobile number has been found involved in illegal activities. Your number will be disconnected in 2 hours unless you verify your Aadhaar by sharing the 8-digit OTP you just received on your phone.',
        context: 'You receive this WhatsApp message with an official-looking TRAI logo as profile picture.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'This is a TRAI impersonation scam — extremely common in India. TRAI never contacts users via WhatsApp. Never share OTPs with anyone — OTPs are the key to your accounts. Sharing an OTP is like handing over your house key.',
      redFlags: ['Government impersonation (TRAI)', 'OTP sharing request — NEVER share OTPs', 'Urgency: "2 hours or disconnected"', 'WhatsApp contact from unknown number claiming to be official']
    },
    {
      id: 'se002', category: 'social', difficulty: 'medium',
      scenario: {
        type: 'message',
        channel: 'LinkedIn Message',
        from: 'Sarah Chen — Recruiter at Google',
        message: 'Hi! I came across your profile and you\'re a great fit for a Senior Developer role at Google (₹45 LPA). Please complete this short skills assessment to fast-track your application: [assessment-google-jobs.com/test/apply?ref=linkedin]',
        context: 'Sarah has 500+ connections, Google logo in her profile, joined LinkedIn 2 weeks ago.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'This is a fake recruiter attack. Red flags: account only 2 weeks old, assessment link goes to "assessment-google-jobs.com" (not google.com), real Google recruiters use @google.com email and official Google Careers portal. The high salary bait creates excitement that bypasses critical thinking.',
      redFlags: ['New account (2 weeks old)', 'Assessment link not on google.com', 'Unsolicited high-salary offer', 'Real Google recruiters use official channels and @google.com email']
    },
    {
      id: 'se003', category: 'social', difficulty: 'medium',
      scenario: {
        type: 'phone_call',
        from: 'Call from: 022-XXXXXXXX (Mumbai)',
        script: '"Hello, this is Rohit from SBI Fraud Prevention. We detected a transaction of ₹24,999 on your card ending in XXXX. To block this fraudulent transaction immediately, please confirm your 16-digit card number and CVV for identity verification."',
        context: 'The caller knows your name and last 4 card digits (from a recent data breach).'
      },
      answer: 'threat',
      points: 130,
      explanation: 'Banks NEVER call asking for your full card number or CVV — they already have it. Knowing your name and last 4 digits makes this convincing but this info is easily obtained from data breaches. If a "bank" calls you, hang up and call the official number on your card.',
      redFlags: ['Bank asking for card number/CVV they already have', 'Inbound call — banks call you but never ask for full card details', 'Urgency: immediate transaction blocking', 'Knowing partial info (name, last 4 digits) used to build false trust']
    },
    {
      id: 'se004', category: 'social', difficulty: 'hard',
      scenario: {
        type: 'message',
        channel: 'Company Email',
        from: 'ceo@yourcompany.com',
        message: 'Hi [Your Name], I\'m in an urgent board meeting and can\'t talk. I need you to immediately purchase 5 × ₹10,000 Google Play gift cards for client gifts and WhatsApp me the card codes. This is time-sensitive — please don\'t discuss with anyone. I\'ll explain everything later. -Rajesh Kumar, CEO',
        context: 'Your CEO\'s name is indeed Rajesh Kumar. The email domain looks correct.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This is a "CEO fraud" / BEC (Business Email Compromise) attack — the fastest growing cybercrime. The "don\'t tell anyone" and "gift cards" are massive red flags. No real CEO buys client gifts via gift card codes. Always verify urgent financial requests via phone call to the person\'s known number.',
      redFlags: ['"Don\'t discuss with anyone" — isolates you from verification', 'Gift card codes = untraceable money transfer', 'Urgency prevents rational thinking', 'CEO email could be spoofed or hacked — always verify by phone']
    },
    {
      id: 'se005', category: 'social', difficulty: 'medium',
      scenario: {
        type: 'message',
        channel: 'SMS',
        from: 'VM-ICICIB (appears as official ICICI Bank)',
        message: 'Dear Customer, Your ICICI Bank account will be blocked today due to KYC non-compliance. Update KYC now: icicibankkyc-update.in/verify or visit your nearest branch within 3 days.',
        context: 'The SMS appears in the same thread as real ICICI Bank messages.'
      },
      answer: 'threat',
      points: 130,
      explanation: 'Even though this SMS appears in the same thread as real ICICI messages (attackers can spoof sender IDs), the link goes to "icicibankkyc-update.in" — not icicibank.com. Real KYC updates happen through official app or branch. Never click KYC links in SMS.',
      redFlags: ['Link domain is icicibankkyc-update.in, not icicibank.com', 'SMS sender ID can be spoofed to appear in real bank thread', 'KYC urgency is a common Indian banking scam', 'Visit branch is the legitimate option — always prefer that']
    }
  ],

  // ─────────────────────────────────────────────
  // 6. RANSOMWARE
  // ─────────────────────────────────────────────
  ransomware: [
    {
      id: 'rw001', category: 'ransomware', difficulty: 'medium',
      scenario: {
        type: 'screen',
        title: '🔒 YOUR FILES HAVE BEEN ENCRYPTED',
        body: 'All your documents, photos, videos, and databases have been encrypted with AES-256. To decrypt your files, send 0.05 BTC (≈₹1,80,000) to wallet: 1A2B3C4D... within 72 hours. After 72 hours, the price doubles. After 7 days, files are permanently deleted.',
        source: 'Full-screen message appeared after opening an email attachment'
      },
      question: 'What is the BEST immediate response?',
      options: [
        { text: 'Pay the ransom immediately to recover files', risk: 'high' },
        { text: 'Disconnect from network, do NOT pay, contact IT/cybersecurity team', risk: 'low' },
        { text: 'Restart your computer to clear the infection', risk: 'high' },
        { text: 'Try to crack the encryption yourself', risk: 'medium' }
      ],
      answer: 'option2',
      points: 130,
      explanation: 'Immediately disconnect from network to prevent spread to other systems. Never pay — only 40% of payers recover files, and you fund more attacks. Restarting can destroy forensic evidence. Contact IT or a cybersecurity incident response team.',
      redFlags: []
    },
    {
      id: 'rw002', category: 'ransomware', difficulty: 'easy',
      scenario: {
        type: 'prevention',
        question: 'Which action BEST protects against ransomware data loss?',
        options: [
          { text: 'Keep backups on an external drive permanently connected to your PC', risk: 'medium' },
          { text: 'Use Windows Defender only — it blocks all ransomware', risk: 'high' },
          { text: 'Follow the 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite/offline', risk: 'low' },
          { text: 'Store everything on cloud storage like Google Drive', risk: 'medium' }
        ]
      },
      answer: 'option3',
      points: 100,
      explanation: 'The 3-2-1 backup rule is the gold standard. A permanently connected external drive gets encrypted too. Cloud sync can sync the encrypted files over originals. Offline/offsite backup is the only ransomware-proof copy.',
      redFlags: []
    },
    {
      id: 'rw003', category: 'ransomware', difficulty: 'hard',
      scenario: {
        type: 'email',
        from: 'invoice@trusted-vendor.com',
        to: 'accounts@yourcompany.com',
        subject: 'Invoice INV-20245891 — Payment Due',
        body: 'Please find attached Invoice INV-20245891 for ₹2,45,000 due March 31. Kindly process payment at earliest. The invoice is password protected, password: inv2024\n\nAttachment: Invoice_20245891.pdf.exe',
        hasAttachment: true,
        attachmentName: 'Invoice_20245891.pdf.exe'
      },
      answer: 'threat',
      points: 150,
      explanation: 'The attachment extension is ".pdf.exe" — it appears to be a PDF but is actually an executable file. This is a ransomware delivery method. Legitimate invoices are never .exe files. The password-protection trick bypasses email security scanners.',
      redFlags: ['.pdf.exe double extension — executable disguised as PDF', 'Password on attachment bypasses email security scanning', 'Finance/accounts team targeted — common ransomware entry point', 'Legitimate invoices are PDFs, never executable files']
    },
    {
      id: 'rw004', category: 'ransomware', difficulty: 'medium',
      scenario: {
        type: 'screen',
        title: '⚠️ WARNING FROM YOUR IT DEPARTMENT',
        body: 'Your computer has been locked for security reasons. A suspicious application attempted to access company data. Please call IT Helpdesk at 1800-XXX-XXXX to unlock your computer.',
        source: 'Blue screen appeared while working, replaced normal desktop'
      },
      question: 'This screen appeared unexpectedly. What do you do?',
      options: [
        { text: 'Call the number displayed on screen immediately', risk: 'high' },
        { text: 'Verify the number against the official IT helpdesk number you already know, then call', risk: 'low' },
        { text: 'Enter your credentials to prove your identity', risk: 'high' },
        { text: 'Pay any fee shown to unlock the computer', risk: 'high' }
      ],
      answer: 'option2',
      points: 120,
      explanation: 'Always verify using a contact number you already know (from company directory) — not the number displayed on a suspicious screen. Scareware places fake numbers on screen. Real IT departments rarely lock screens with phone numbers.',
      redFlags: []
    },
    {
      id: 'rw005', category: 'ransomware', difficulty: 'hard',
      scenario: {
        type: 'prevention',
        question: 'Your organization received a ransom note but has not yet paid. A security vendor offers a free decryption tool for this specific ransomware variant. What should you verify FIRST?',
        options: [
          { text: 'Run the decryption tool immediately on all encrypted systems', risk: 'high' },
          { text: 'Verify the tool is from a legitimate source (nomoreransom.org, verified vendor), test on one isolated machine first', risk: 'low' },
          { text: 'The decryption tool is definitely safe if it\'s free', risk: 'high' },
          { text: 'Pay the ransom as backup while testing the tool', risk: 'high' }
        ]
      },
      answer: 'option2',
      points: 150,
      explanation: 'Attackers sometimes distribute fake "decryption tools" that install additional malware. Always verify tools from nomoreransom.org (legitimate free resource) or confirmed security vendors. Test on one isolated machine before deployment.',
      redFlags: []
    }
  ],

  // ─────────────────────────────────────────────
  // 7. QR CODE ATTACKS
  // ─────────────────────────────────────────────
  qrcode: [
    {
      id: 'qr001', category: 'qrcode', difficulty: 'easy',
      scenario: {
        type: 'qr',
        description: 'A QR code sticker has been placed over the original QR code at a popular restaurant for UPI payment.',
        previewUrl: 'upi://pay?pa=fraud-merchant@paytm&pn=Restaurant&am=&tn=Food',
        context: 'You scan the QR code to pay your bill. Your UPI app shows: "Pay to: fraud-merchant@paytm"'
      },
      answer: 'threat',
      points: 100,
      explanation: 'QR code sticker scams are rampant at restaurants and shops in India. Always verify the UPI ID shown matches the business name before confirming payment. Legitimate restaurant QR codes show the restaurant\'s registered business name.',
      redFlags: ['QR sticker placed over original — physical tampering', 'UPI ID doesn\'t match restaurant name', 'Always check recipient name before confirming UPI payment', 'Scammers place stickers on menus, counters, tables']
    },
    {
      id: 'qr002', category: 'qrcode', difficulty: 'medium',
      scenario: {
        type: 'qr',
        description: 'You receive a WhatsApp message: "Scan this QR code to verify your WhatsApp account and get WhatsApp Gold with extra features!"',
        previewUrl: 'https://web-whatsapp-verify.com/qr-login?session=abc123',
        context: 'The message was forwarded from a contact you trust.'
      },
      answer: 'threat',
      points: 120,
      explanation: '"WhatsApp Gold" does not exist — it\'s a persistent social media hoax. Scanning this QR code would log an attacker into your WhatsApp account via WhatsApp Web, giving them access to all your messages and contacts. Never scan QR codes claiming to "upgrade" or "verify" WhatsApp.',
      redFlags: ['WhatsApp Gold is a known hoax since 2016', 'QR code grants WhatsApp Web session access', 'Forwarded from trusted contact — they were also scammed', 'Verify by checking WhatsApp\'s official website']
    },
    {
      id: 'qr003', category: 'qrcode', difficulty: 'hard',
      scenario: {
        type: 'qr',
        description: 'A QR code in a public parking lot says: "Scan to Pay Parking Fine — Avoid ₹2,000 late fee." The QR leads to: https://mcd-parking-fine.in/pay',
        context: 'Your car does not have a parking ticket. The QR code is on a laminated notice on your windshield.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Government bodies (MCD, traffic police) do NOT collect fines via QR codes on windshields. Official fines come via registered post or official e-challan system (echallan.parivahan.gov.in). The domain "mcd-parking-fine.in" is unofficial. This is a payment fraud scheme.',
      redFlags: ['Government agencies don\'t collect fines via windshield QR codes', 'Official fines use echallan.parivahan.gov.in', 'Unofficial domain (mcd-parking-fine.in)', 'Fear tactic: "avoid late fee"']
    },
    {
      id: 'qr004', category: 'qrcode', difficulty: 'medium',
      scenario: {
        type: 'qr',
        description: 'At a job fair, a company representative asks you to scan a QR code to "submit your resume digitally."',
        previewUrl: 'https://careers.legitimatecompany.com/apply/jobfair2025',
        context: 'The representative has the company\'s branded badge, booth, and the URL shows the company\'s real domain.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is legitimate. The URL matches the company\'s real domain, context is appropriate (official job fair, branded booth), and the action (submitting resume) is expected behavior. QR codes at official company events are generally safe when the URL matches their known domain.',
      redFlags: []
    },
    {
      id: 'qr005', category: 'qrcode', difficulty: 'hard',
      scenario: {
        type: 'qr',
        description: 'A "Request Money" QR code is sent to you on UPI. Your contact says: "Scan this to receive your ₹5,000 refund from me."',
        context: 'The QR code is for receiving money according to your contact.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'In UPI, you NEVER scan a QR code to RECEIVE money — you only scan QR codes to SEND money. A "Request Money" QR will deduct money from your account, not add it. This is one of the most common UPI scams in India — scammers tell victims to "scan to receive refund."',
      redFlags: ['You never scan QR codes to receive UPI money', 'Scanning will DEDUCT money, not add it', 'Classic refund scam — extremely common in India', 'To receive money, share your UPI ID — never scan anything']
    }
  ],

  // ─────────────────────────────────────────────
  // 8. VISHING (VOICE PHISHING)
  // ─────────────────────────────────────────────
  vishing: [
    {
      id: 'vi001', category: 'vishing', difficulty: 'easy',
      scenario: {
        type: 'call_script',
        from: 'Call from: +91-11-XXXXXXXX',
        script: '"Hello, am I speaking with [Your Name]? I am Officer Sharma from CBI Cyber Crime Branch. We have detected that your Aadhaar card is being used in a money laundering case worth ₹2 crore. You will be arrested within 2 hours unless you transfer ₹50,000 to our safe account for verification. This call is being recorded."',
        redFlag_note: 'The caller knows your name and Aadhaar last 4 digits.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Government agencies NEVER call asking for money transfers. CBI/Police make arrests — they don\'t give advance calls for payment. "Transfer to safe account" is always fraud. Knowing your name/Aadhaar digits is easily obtained from data breaches. Hang up and call 1930 (Cyber Crime helpline).',
      redFlags: ['CBI/Police never call asking for money', '"Arrest in 2 hours" is a fear tactic', '"Safe account" transfer = fraud', 'Call 1930 Cyber Crime helpline to report']
    },
    {
      id: 'vi002', category: 'vishing', difficulty: 'medium',
      scenario: {
        type: 'call_script',
        from: 'Call from: 1800-XXX-XXXX (appears as toll-free)',
        script: '"Hello, this is Amazon Customer Support. We noticed your Prime subscription has been renewed for ₹8,999 accidentally. To cancel this charge, please install AnyDesk on your computer so our technician can process the refund directly. Your refund will appear in 10 minutes."',
        redFlag_note: 'You didn\'t request any Amazon support.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'This is a remote access scam. AnyDesk/TeamViewer gives callers FULL CONTROL of your computer and banking apps. Real Amazon refunds happen automatically — they never require you to install software. Once remote access is granted, scammers drain bank accounts.',
      redFlags: ['"Install AnyDesk" = remote access = full computer control', 'Amazon never asks you to install software for refunds', 'Unsolicited call about a subscription you may or may not have', 'Refunds are processed by Amazon servers, not screen-sharing']
    },
    {
      id: 'vi003', category: 'vishing', difficulty: 'hard',
      scenario: {
        type: 'call_script',
        from: 'Call from your manager\'s real phone number',
        script: '"Hey, it\'s Priya. I\'m stuck in a client meeting and my laptop died. Can you quickly transfer ₹15,000 to this account for a vendor payment? I\'ll reimburse you by EOD. It\'s urgent — the vendor won\'t release the delivery without payment today. Account: XXXXXXXXXX, IFSC: XXXXXX"',
        redFlag_note: 'The call is from your manager\'s actual saved number.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Phone numbers can be spoofed to display as any number. This could also be a compromised phone. Never transfer personal money for business purposes without a second verification. Call your manager on an alternate number or verify via company messaging system before any transfer.',
      redFlags: ['Caller ID can be spoofed to show any number', 'Urgent personal money transfer request', 'Verify via a second channel (walk to their desk, WhatsApp, email)', 'Any financial request deserves a verification call-back on a known number']
    },
    {
      id: 'vi004', category: 'vishing', difficulty: 'medium',
      scenario: {
        type: 'call_script',
        from: 'Call from: Your Bank\'s Official Number (displayed)',
        script: '"This is automated fraud alert from HDFC Bank. Transaction of ₹32,000 to an unknown merchant was flagged. Press 1 to approve or Press 2 to dispute this transaction." You press 2. "Please enter your 4-digit ATM PIN to verify your identity and block the transaction."',
        redFlag_note: 'The call came from HDFC\'s official 1800 number.'
      },
      answer: 'threat',
      points: 130,
      explanation: 'Banks NEVER ask for your ATM PIN, CVV, or OTP over phone — ever. Legitimate bank fraud alerts ask you to confirm via app notification or call the number on your card. Your ATM PIN is yours alone. The official-looking number is spoofed.',
      redFlags: ['Banks NEVER ask for ATM PIN/CVV/OTP over phone', 'Automated voice systems don\'t collect PINs for fraud verification', 'Caller ID spoofed to show official bank number', 'Hang up and call the number printed on your card']
    },
    {
      id: 'vi005', category: 'vishing', difficulty: 'easy',
      scenario: {
        type: 'call_script',
        from: 'Call from: +91-XXXXXXXXXX',
        script: '"Hello, I am from IRCTC customer care. Your train ticket booking refund of ₹1,240 is ready. Please share the OTP you just received on your registered mobile to process the refund to your account."',
        redFlag_note: 'You did get a refund OTP SMS from "VM-IRCTC" simultaneously.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'IRCTC refunds are automatic — they never call asking for OTPs. The caller triggered the OTP themselves by initiating a login/transaction on your IRCTC account. Sharing the OTP gives them access to your account. IRCTC refunds go automatically to source account within 5-7 days.',
      redFlags: ['IRCTC refunds are automatic — no OTP required', 'Caller triggered the OTP themselves', 'OTP sharing = account access', 'Refund via OTP is technically impossible — it\'s a login OTP, not refund OTP']
    }
  ],

  // ─────────────────────────────────────────────
  // 9. INSIDER THREATS
  // ─────────────────────────────────────────────
  insider: [
    {
      id: 'in001', category: 'insider', difficulty: 'medium',
      scenario: {
        type: 'workplace',
        situation: 'A colleague asks you to log into your workstation and leave for 10 minutes while they "quickly check something" because their computer is broken.',
        context: 'You know this colleague and they seem trustworthy. Their computer is indeed making unusual sounds.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Never share workstation access — even to trusted colleagues. Your login credentials create an audit trail of actions under your name. Insider threats are often people you trust. The colleague should contact IT for their own workstation. Log out before leaving any workstation.',
      redFlags: ['Your credentials = your legal responsibility for actions taken', 'IT department exists for broken computer situations', 'Insider threats most often involve trusted individuals', 'Always lock (Win+L) or log out when leaving workstation']
    },
    {
      id: 'in002', category: 'insider', difficulty: 'easy',
      scenario: {
        type: 'workplace',
        situation: 'You find a USB drive in the office parking lot labeled "Salary Hikes 2025 — Confidential." You are curious about the contents.',
        context: 'The USB looks like a standard corporate USB drive with your company logo on it.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Dropped USB drives are a classic attack vector — called "USB drop attack." The "Salary" label is specifically chosen to trigger curiosity and override caution. Plugging it in could install malware, ransomware, or a keylogger. Hand it to IT security without plugging it in.',
      redFlags: ['Dropped USB is a deliberate attack method', '"Salary" label = emotional bait to ensure it gets plugged in', 'Company logo can be printed by anyone', 'Hand to IT security without plugging in']
    },
    {
      id: 'in003', category: 'insider', difficulty: 'hard',
      scenario: {
        type: 'workplace',
        situation: 'A new employee who started last week requests access to the entire customer database saying they need it for their project. Their manager is currently traveling and unreachable.',
        context: 'You are the database admin. The project seems legitimate based on what you know.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This violates the principle of least privilege — access should only be granted for what is strictly necessary. Never grant access without manager approval, even if the project seems legitimate. Wait for manager confirmation. New employees are a high-risk period for insider threat detection.',
      redFlags: ['No manager approval — prerequisite for any access grant', 'New employee + full database access = excessive privilege', 'Principle of least privilege: give minimum necessary access', 'Manager unavailability shouldn\'t override security protocol']
    },
    {
      id: 'in004', category: 'insider', difficulty: 'medium',
      scenario: {
        type: 'workplace',
        situation: 'You notice a colleague regularly staying late, copying large amounts of data to personal USB drives, and recently was passed over for a promotion. When you ask, they say it\'s "personal backup."',
        context: 'The data includes customer records which are classified as confidential.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'These are classic insider threat behavioral indicators: unusual data access patterns, copying to personal devices, and recent grievance (promotion denial). Company confidential data should never be copied to personal devices. This should be reported to IT security/management immediately.',
      redFlags: ['Unusual data copying to personal device', 'After-hours activity with sensitive data', 'Recent grievance (promotion denial) = motivation', 'Customer records on personal device = data breach regardless of intent']
    },
    {
      id: 'in005', category: 'insider', difficulty: 'easy',
      scenario: {
        type: 'workplace',
        situation: 'You are working from a coffee shop and need to join a video call discussing confidential client financials. The coffee shop has free public WiFi.',
        context: 'You have your company laptop and your phone as a hotspot option.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Public WiFi is an insider and external threat risk — conversations can be recorded in a public place, and the WiFi can intercept unencrypted traffic. Use your phone\'s personal hotspot for confidential work. If you must use public WiFi, always use company VPN.',
      redFlags: ['Public place = audio eavesdropping risk for confidential calls', 'Public WiFi = potential network interception', 'Use personal hotspot for sensitive work', 'At minimum, use company VPN on any public network']
    }
  ],

  // ─────────────────────────────────────────────
  // 10. WI-FI HONEYPOTS
  // ─────────────────────────────────────────────
  wifi: [
    {
      id: 'wf001', category: 'wifi', difficulty: 'easy',
      scenario: {
        type: 'wifi',
        networks: [
          { ssid: 'Airport_Free_WiFi', security: 'Open', signal: '●●●●●', note: 'No password required' },
          { ssid: 'AirportWiFi_Official', security: 'WPA2', signal: '●●●●○', note: 'Available at info kiosks' },
          { ssid: 'Free_Fast_Internet', security: 'Open', signal: '●●●●●', note: 'No password required' }
        ],
        context: 'You are at the airport and want to check your email before boarding.'
      },
      question: 'Which network should you connect to?',
      answer: 'option2',
      points: 100,
      explanation: 'Always use the official, password-protected network over free open networks. Open WiFi networks allow anyone on the same network to intercept your traffic. The "official" network requires WPA2 authentication. When in doubt, use your phone\'s mobile data or hotspot.',
      redFlags: ['Open networks = no encryption = traffic visible to others', 'Identical-looking network names are honeypots', 'Verify official WiFi name from airport signage or staff', 'Best option: personal hotspot, especially for email/banking']
    },
    {
      id: 'wf002', category: 'wifi', difficulty: 'medium',
      scenario: {
        type: 'wifi',
        networks: [
          { ssid: 'Starbucks', security: 'Open', signal: '●●●●●', note: 'You are inside Starbucks' },
          { ssid: 'Starbucks_WiFi', security: 'Open', signal: '●●●●●', note: '' },
          { ssid: 'STARBUCKS', security: 'Open', signal: '●●●●○', note: '' }
        ],
        context: 'You want to use WiFi at Starbucks. You see three networks with similar names.'
      },
      question: 'This situation indicates what type of attack?',
      answer: 'threat',
      points: 120,
      explanation: 'Multiple networks with similar names is a classic Evil Twin attack. Attackers set up fake WiFi hotspots with names matching real businesses. Since all three are open networks, you cannot easily verify which is real. The safest choice is to ask staff for the exact network name or use mobile data.',
      redFlags: ['Multiple identically-named networks = Evil Twin attack', 'Open networks on all three = no way to verify authenticity', 'Ask staff for exact WiFi name before connecting', 'Even the "real" Starbucks WiFi is open — use VPN or mobile data']
    },
    {
      id: 'wf003', category: 'wifi', difficulty: 'medium',
      scenario: {
        type: 'wifi_captive',
        description: 'You connect to hotel WiFi. A captive portal appears asking: "Enter your full name, room number, email address, and create a 4-digit PIN to access internet."',
        context: 'You just checked into a legitimate hotel. The captive portal looks professional.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'Hotel captive portals requiring basic guest verification (name, room number) are standard and legitimate. This is how hotels verify paying guests. The 4-digit PIN is for session management. However — never use the same PIN as your bank or phone, and avoid banking on hotel WiFi regardless.',
      redFlags: []
    },
    {
      id: 'wf004', category: 'wifi', difficulty: 'hard',
      scenario: {
        type: 'wifi',
        situation: 'Your phone automatically reconnects to a network named "HomeNetwork" at a shopping mall because it matches your saved home WiFi name.',
        context: 'You are far from home. Your phone shows it\'s connected and browsing works normally.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This is an Evil Twin/KARMA attack. Attackers broadcast common network names (HomeNetwork, AndroidAP, iPhone Hotspot) knowing devices auto-connect to saved networks. Your phone cannot verify it\'s the same router. Turn off "auto-connect" for public networks and disable WiFi when not needed.',
      redFlags: ['Devices auto-connect to matching SSIDs regardless of location', 'Attacker broadcasts common home network names', 'Normal browsing does NOT confirm you are safe — MITM can be transparent', 'Disable auto-connect; turn off WiFi when not using it']
    },
    {
      id: 'wf005', category: 'wifi', difficulty: 'hard',
      scenario: {
        type: 'wifi_security',
        question: 'You MUST use public WiFi for an urgent work task. What is the MINIMUM security measure?',
        options: [
          { text: 'Use HTTPS websites only — the padlock icon means you\'re safe', risk: 'medium' },
          { text: 'Enable your company VPN before doing any work-related activity', risk: 'low' },
          { text: 'Ensure the WiFi is WPA2 encrypted', risk: 'medium' },
          { text: 'Use incognito/private browsing mode', risk: 'high' }
        ]
      },
      answer: 'option2',
      points: 150,
      explanation: 'VPN is the minimum requirement for any work activity on public WiFi. It encrypts ALL your traffic end-to-end. HTTPS only encrypts the content but the attacker can still see which sites you visit. Incognito mode only hides local browsing history — it does nothing for network security.',
      redFlags: []
    }
  ]
};

// Get random questions for a game session
const getQuestionsForSession = (category, count = 5, difficulty = 'all') => {
  let questions = QUESTION_BANK[category] || [];
  if (difficulty !== 'all') {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  // Shuffle
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get mixed questions across all categories
const getMixedQuestions = (count = 10, difficulty = 'all') => {
  const categories = Object.keys(QUESTION_BANK);
  const all = [];
  categories.forEach(cat => {
    let qs = QUESTION_BANK[cat];
    if (difficulty !== 'all') qs = qs.filter(q => q.difficulty === difficulty);
    all.push(...qs);
  });
  return [...all].sort(() => Math.random() - 0.5).slice(0, count);
};

const getAllCategories = () => Object.keys(QUESTION_BANK);
const getQuestionCount = () => Object.values(QUESTION_BANK).reduce((a, b) => a + b.length, 0);

// ─────────────────────────────────────────────
// 11. FAKE LOGIN PAGES
// ─────────────────────────────────────────────
QUESTION_BANK.fakelogin = [
  {
    id: 'fl001', category: 'fakelogin', difficulty: 'easy',
    scenario: {
      type: 'fakelogin',
      pageTitle: 'SBI NetBanking — Secure Login',
      favicon: '🏦',
      url: 'https://sbi-netbanking-secure.in/login',
      fields: ['Username / CIF Number', 'Login Password', 'Captcha'],
      logo: 'STATE BANK OF INDIA',
      extraNote: 'Enter your details to access your account securely.',
      context: 'You clicked a link in an SMS that said your SBI account needs re-verification.'
    },
    answer: 'threat',
    points: 120,
    explanation: 'The real SBI NetBanking URL is onlinesbi.sbi — this page uses "sbi-netbanking-secure.in" which is a fake domain. Clicking a link from an SMS and arriving at a login page is a classic credential harvesting attack.',
    redFlags: ['Wrong domain: sbi-netbanking-secure.in vs onlinesbi.sbi', 'Arrived via SMS link — never log in via SMS links', 'Domain uses hyphens to look official', 'No official SBI branding details visible']
  },
  {
    id: 'fl002', category: 'fakelogin', difficulty: 'easy',
    scenario: {
      type: 'fakelogin',
      pageTitle: 'Google Sign In',
      favicon: '🔵',
      url: 'https://accounts.google.com/signin/v2/identifier',
      fields: ['Email or phone', 'Password'],
      logo: 'Google',
      extraNote: 'Sign in to continue to Gmail',
      context: 'You went to gmail.com directly from your browser address bar and were redirected here.'
    },
    answer: 'safe',
    points: 100,
    explanation: 'This is the legitimate Google login page. The URL is accounts.google.com — the official Google authentication domain. You navigated directly via the address bar, so there is no phishing redirect involved.',
    redFlags: []
  },
  {
    id: 'fl003', category: 'fakelogin', difficulty: 'medium',
    scenario: {
      type: 'fakelogin',
      pageTitle: 'Facebook — Log In or Sign Up',
      favicon: '📘',
      url: 'https://www.faceb00k.com/login.php',
      fields: ['Email or Phone Number', 'Password'],
      logo: 'facebook',
      extraNote: 'Log in to connect with friends.',
      context: 'You searched "Facebook login" on Google and clicked the second result.'
    },
    answer: 'threat',
    points: 130,
    explanation: '"faceb00k.com" uses zeros instead of the letter O — a homograph attack. This page is a pixel-perfect clone of Facebook\'s login. Always type facebook.com directly in your browser. Clicking search results for login pages is risky.',
    redFlags: ['Homograph domain: faceb00k.com vs facebook.com', 'Zeros substituted for letter O', 'Search result login pages are risky — type URLs directly', 'Pixel-perfect clone designed to harvest credentials']
  },
  {
    id: 'fl004', category: 'fakelogin', difficulty: 'hard',
    scenario: {
      type: 'fakelogin',
      pageTitle: 'Microsoft 365 — Sign In',
      favicon: '🟦',
      url: 'https://login.microsoftonline.com.portal-auth.net/common/oauth2',
      fields: ['Email, phone, or Skype', 'Password', 'Stay signed in?'],
      logo: 'Microsoft',
      extraNote: 'Use your Microsoft account to sign in.',
      context: 'You received a meeting invite on email and clicked "Join Microsoft Teams Meeting."'
    },
    answer: 'threat',
    points: 150,
    explanation: 'The real domain here is "portal-auth.net" — everything before it is a subdomain designed to look like Microsoft. Read URLs right-to-left from the TLD. This is a sophisticated AiTM (Adversary-in-the-Middle) attack that can bypass 2FA.',
    redFlags: ['Real domain is portal-auth.net, not microsoftonline.com', 'microsoftonline.com is just a subdomain prefix', 'Meeting invite phishing is a top enterprise attack vector', 'AiTM attacks can intercept 2FA tokens in real-time']
  },
  {
    id: 'fl005', category: 'fakelogin', difficulty: 'medium',
    scenario: {
      type: 'fakelogin',
      pageTitle: 'HDFC Bank NetBanking',
      favicon: '🔴',
      url: 'https://netbanking.hdfcbank.com/netbanking/',
      fields: ['Customer ID', 'IPIN (Password)'],
      logo: 'HDFC BANK',
      extraNote: 'We welcome you to HDFC Bank NetBanking.',
      context: 'You typed "hdfcbank.com" in your browser and navigated to NetBanking from their official homepage.'
    },
    answer: 'safe',
    points: 100,
    explanation: 'This is legitimate. netbanking.hdfcbank.com is HDFC Bank\'s official NetBanking subdomain. You navigated from their homepage directly — not via any SMS or email link. The URL structure is consistent with HDFC Bank\'s real infrastructure.',
    redFlags: []
  }
];

module.exports = { QUESTION_BANK, getQuestionsForSession, getMixedQuestions, getAllCategories, getQuestionCount };
