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
    },
    {
      id: 'ph006', category: 'phishing', difficulty: 'hard',
      scenario: {
        type: 'email',
        from: 'accounts-recovery@icloud.com',
        to: 'user@gmail.com',
        subject: 'Apple ID Security Alert — Unusual Sign-in Activity',
        body: `Your Apple ID was used to sign into iCloud from a new device.\n\nDevice: iPhone 13 Pro\nLocation: London, UK\nTime: 2025-02-28 10:30 GMT\n\nIf this wasn't you, secure your account immediately:\nhttps://appleid.apple.com/account/iforgot\n\nApple Security Team`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 150,
      explanation: 'The sender domain is "accounts-recovery@icloud.com" but Apple always uses "noreply@id.apple.com" or similar. The URL goes to the legitimate path but came via a suspicious domain. It uses geographic pressure ("London") and device names to create urgency.',
      redFlags: ['Wrong sender domain (icloud.com instead of id.apple.com)', 'Urgency tactic with location/device info', 'Unusual sign-in activity is a common phishing hook', 'Link structure looks real but domain is fake']
    },
    {
      id: 'ph007', category: 'phishing', difficulty: 'easy',
      scenario: {
        type: 'email',
        from: 'support@instagram.com',
        to: 'user@gmail.com',
        subject: 'Confirm Your Account to Regain Access',
        body: `Hello,\n\nYour account has been temporarily disabled due to suspicious activity. To reactivate, please confirm your identity:\n\nUsername: [your username]\nPassword: [your password]\nBirthdate: [MM/DD/YYYY]\n\nConfirm now: http://instagram-confirm-now.xyz/secure\n\nInstagram Support Team`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 120,
      explanation: 'Legitimate Instagram never asks users to provide passwords via email. The link goes to "instagram-confirm-now.xyz" not instagram.com. The email requests sensitive info (birthdate, username, password) which is a dead giveaway.',
      redFlags: ['Requesting password via email (never legitimate)', 'Wrong domain (instagram-confirm-now.xyz)', '.xyz domain is extremely cheap and often used by scammers', 'Account reactivation urgency tactic']
    },
    {
      id: 'ph008', category: 'phishing', difficulty: 'medium',
      scenario: {
        type: 'email',
        from: 'no-reply@courier.amazon.delivery',
        to: 'user@gmail.com',
        subject: 'Your Amazon Package Could Not Be Delivered',
        body: `Your delivery attempt failed today. The parcel will be returned to sender in 10 days unless you confirm delivery details.\n\nConfirm delivery: https://amazon-package-verify.net/delivery?id=a1b2c3\n\nThank you,\nAmazon Logistics`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 120,
      explanation: 'The sender domain "courier.amazon.delivery" mimics Amazon but is not the official domain. Real Amazon uses @amazon.com or @amazonses.com. The link goes to "amazon-package-verify.net" (not amazon.com). Delivery pressure is a common scam tactic.',
      redFlags: ['Fake subdomain (courier.amazon.delivery)', 'Real Amazon doesn\'t use .delivery domains', 'Link goes to unrelated domain (.net)', 'Urgency: "10 days before return"']
    },
    {
      id: 'ph009', category: 'phishing', difficulty: 'medium',
      scenario: {
        type: 'email',
        from: 'aadmin@google.com',
        to: 'work@company.com',
        subject: 'Complete Your Google Workspace Security Review',
        body: `Your organization requires a security review every 90 days. Please verify your admin credentials to proceed:\n\nhttps://accounts.google.com/admin/security-check\n\nThis is a mandatory compliance requirement.\n\nGoogle Workspace Security Team`,
        hasAttachment: false
      },
      answer: 'safe',
      points: 120,
      explanation: 'Sender is @google.com (official). The link goes directly to accounts.google.com with a legitimate-sounding path. Google Workspace does have security review requirements. However, best practice is to navigate directly to admin.google.com rather than clicking links.',
      redFlags: []
    },
    {
      id: 'ph010', category: 'phishing', difficulty: 'hard',
      scenario: {
        type: 'email',
        from: 'billing.support@paypa1-security.co.uk',
        to: 'user@gmail.com',
        subject: 'Critical: Resolve Your Account Limitation Before April 15',
        body: `We've limited your PayPal account due to an unusual transaction pattern detected by our AI security system.\n\nFailed Login Attempts: 3\nUnusual Location: Lagos, Nigeria\n\nTo regain access:\nhttps://paypal-account-security.verify-now.uk/alert\n\nPayPal Protection Services`,
        hasAttachment: false
      },
      answer: 'threat',
      points: 150,
      explanation: 'Domain "paypa1-security.co.uk" uses number "1" instead of letter "l" and is not PayPal\'s domain. .co.uk is not PayPal\'s domain extension. The link goes to a completely different domain. AI security, location warnings, and account limits are all scare tactics.',
      redFlags: ['Homograph attack (paypa1 vs paypal)', 'Wrong TLD (.co.uk instead of .com)', 'Link goes to unrelated domain verify-now.uk', 'Fear tactics: AI detection, unusual location, account limitation']
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
    },
    {
      id: 'pu006', category: 'popup', difficulty: 'medium',
      scenario: {
        type: 'popup',
        icon: '📦',
        title: 'Package Delivery Failed',
        body: 'Your DHL/FedEx package could not be delivered. Click here to reschedule delivery or claim your package before it returns to sender in 24 hours.',
        buttons: ['Reschedule Delivery', 'Skip'],
        source: 'Pop-up on a shopping website'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Legitimate DHL/FedEx notifications come via email with tracking numbers, not web pop-ups. Clicking would lead to a credential harvesting form or malware download. Shipping scams create artificial urgency to trick you into clicking.',
      redFlags: ['Pop-ups never deliver official notifications', '24-hour deadline creates urgency', 'No tracking number provided', 'Generic message could apply to anyone']
    },
    {
      id: 'pu007', category: 'popup', difficulty: 'easy',
      scenario: {
        type: 'popup',
        icon: '⭐',
        title: 'You\'ve Won a Free iPhone!',
        body: 'Congratulations! You are the lucky winner of a brand new iPhone 15 Pro Max. Claim your prize now — only 3 slots remaining!',
        buttons: ['Claim My Prize!', 'Close'],
        source: 'Pop-up overlay on a free gaming website'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Websites do not give away free iPhones to random visitors. The scarcity ("3 slots remaining") is designed to push you into clicking without thinking. Clicking leads to phishing, survey spam, or malware.',
      redFlags: ['Unsolicited prize offer', 'Artificial scarcity ("3 slots")', 'Too good to be true', 'No details about how you "won"']
    },
    {
      id: 'pu008', category: 'popup', difficulty: 'medium',
      scenario: {
        type: 'popup',
        icon: '✅',
        title: 'System Update Complete',
        body: 'Your Windows system has been updated to the latest security patches. Your computer has been optimized for 127% better performance. Restart now?',
        buttons: ['Restart Now', 'Later'],
        source: 'Pop-up on your desktop while browsing'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Windows updates come through Windows Update in Settings, not random desktop pop-ups. "127% better performance" is mathematically impossible and a red flag. Clicking "Restart" could download malware and execute it before restart.',
      redFlags: ['Impossible performance claim (127%)', 'Pop-up not from Official Windows Update', 'Urgency and restart tactic', 'Malvertising redirected you here']
    },
    {
      id: 'pu009', category: 'popup', difficulty: 'hard',
      scenario: {
        type: 'popup',
        icon: '🔐',
        title: 'Banking Malware Detected',
        body: 'Our security scan detected banking malware on your device. Attackers may have access to your bank accounts and passwords. Run deep scan now to remove threats before damage occurs.',
        buttons: ['Run Deep Scan', 'Cancel'],
        source: 'Pop-up while visiting a news website'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Legitimate antivirus never shows this type of alarm on random websites. This is a deceptive scareware technique that tricks you into downloading the malware it claims to remove. Real security issues appear in your actual antivirus software, not web pages.',
      redFlags: ['Urgent threat notification on random website', 'Designed to install the malware it claims to remove', 'Banking malware scare tactic', 'Legitimate antivirus tools never advertise this way']
    },
    {
      id: 'pu010', category: 'popup', difficulty: 'easy',
      scenario: {
        type: 'popup',
        icon: '📢',
        title: 'Customer Satisfaction Survey',
        body: 'We value your feedback. Please take 2 minutes to answer a quick survey about your experience. All respondents receive a $50 gift card.',
        buttons: ['Take Survey', 'Not Now'],
        source: 'Pop-up on an e-commerce site'
      },
      answer: 'threat',
      points: 100,
      explanation: 'While survey pop-ups are common, those promising prizes usually lead to spam signup lists or phishing pages. Legitimate companies do surveys on their own sites, not via unsolicited pop-ups with prize incentives.',
      redFlags: ['Prize incentive to complete survey', 'Unsolicited pop-up', 'Leads to data harvesting', 'Used to collect personal/payment info']
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
    },
    {
      id: 'ur006', category: 'url', difficulty: 'hard',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://www1-amazon-acc0unt-verify.com/login?ref=email_verify_12345',
        context: 'You got an email about suspicious Amazon activity and clicked the link.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'The real domain is "amazon-acc0unt-verify.com" (note: zero instead of letter O, additional hyphens). While HTTPS and lock icon appear (they can be valid for ANY domain), the base domain is not amazon.com. This is a homograph attack — attackers paid for this domain specifically.',
      redFlags: ['Homograph attack: acc0unt uses zero not O', 'Domain is amazon-acc0unt-verify.com, not amazon.com', 'Multiple hyphens make it look official', 'HTTPS lock icon gives false confidence']
    },
    {
      id: 'ur007', category: 'url', difficulty: 'medium',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://mail.google.com/mail/u/0/?shva=1',
        context: 'You bookmarked your Gmail login to access it daily.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is the legitimate Gmail interface URL. mail.google.com is Google\'s official mail domain, HTTPS is valid, and the /mail/u/0/ path is standard Gmail routing. Parameters like ?shva=1 are normal Gmail tracking.',
      redFlags: []
    },
    {
      id: 'ur008', category: 'url', difficulty: 'easy',
      scenario: {
        type: 'url',
        protocol: 'http',
        lock: false,
        url: 'http://192.168.1.1/admin',
        context: 'A tech support person on the phone told you to visit this IP address to "check your router settings."'
      },
      answer: 'threat',
      points: 100,
      explanation: 'IP address URLs (192.168.x.x) are internal network addresses. A random tech support caller telling you to visit this is likely a scam — they could be accessing your router remotely. Real ISP support would direct you to their website, not internal IPs.',
      redFlags: ['IP address instead of domain name', 'Unsolicited tech support call', 'No HTTPS', 'Gives attacker router access']
    },
    {
      id: 'ur009', category: 'url', difficulty: 'hard',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://linkedin.com@redirect.suspicious-press.ru/profile?user=12345',
        context: 'You got a LinkedIn notification that someone viewed your profile and clicked the link.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This uses the "@" symbol (used for basic auth) to disguise the real domain. Everything before @ (linkedin.com) looks legitimate, but the REAL domain is "redirect.suspicious-press.ru". Browsers read the part after @ as the destination.',
      redFlags: ['@ symbol in URL to hide real domain', 'Real domain is suspicious-press.ru', 'HTTPS lock gives false confidence', 'This tricks even technical users']
    },
    {
      id: 'ur010', category: 'url', difficulty: 'medium',
      scenario: {
        type: 'url',
        protocol: 'https',
        lock: true,
        url: 'https://github.com/account/settings/security',
        context: 'You received an email from GitHub asking to review your security settings and clicked this link.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'This is a legitimate GitHub settings URL. github.com is the official domain, HTTPS is valid, and the /account/settings/security path is the real settings location. The email asking you to review security is a legitimate notification.',
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
    },
    {
      id: 'pw006', category: 'password', difficulty: 'easy',
      scenario: {
        type: 'password_rank',
        question: 'Your workplace requires: "Change password every 30 days, use 8 chars min, no repeating numbers." Which approach is BEST?',
        options: [
          { pw: 'Password1', hint: 'Add trailing number each month' },
          { pw: 'November12', hint: 'Use current month + date' },
          { pw: 'MyPassword01', hint: 'Increment the number monthly' },
          { pw: 'Generate new 16-char password, store in manager', hint: 'Unique each time, secure storage' }
        ]
      },
      answer: 'option4',
      points: 100,
      explanation: 'Forced password rotation creates weak predictable passwords (Password1→Password2). Security experts now recommend LONG passwords that rarely change, stored in managers. Users struggling with rotation use predictable patterns. Let passwords live longer — use strong ones.',
      redFlags: []
    },
    {
      id: 'pw007', category: 'password', difficulty: 'medium',
      scenario: {
        type: 'password_rank',
        question: 'You\'ve used the same password for 3 years across all sites. Hackers dump it online. What now?',
        options: [
          { pw: 'Keep using it, it\'s still safe', hint: 'No action needed' },
          { pw: 'Change JUST your email password', hint: 'Only the most critical one' },
          { pw: 'Change email + bank + social media', hint: 'Hit major accounts' },
          { pw: 'Change passwords on EVERY account', hint: 'Complete overhaul' }
        ]
      },
      answer: 'option4',
      points: 120,
      explanation: 'If one password is compromised across 3 years, attackers have EVERY account. You must assume they tried your email + password combo everywhere. Change all accounts. Then use unique passwords going forward—use a password manager.',
      redFlags: []
    },
    {
      id: 'pw008', category: 'password', difficulty: 'hard',
      scenario: {
        type: 'password_rank',
        question: 'Which NO-NO is the biggest risk in a corporate environment?',
        options: [
          { pw: 'Using "password" as a password', hint: 'Weak but personal usage' },
          { pw: 'Sharing your work password to access when sick', hint: 'Grants colleague account access' },
          { pw: 'Writing password on a sticky note on desk', hint: 'Physical security issue' },
          { pw: 'Using your name in password: "John@IBM2024"', hint: 'Guessable from ID badge' }
        ]
      },
      answer: 'option2',
      points: 150,
      explanation: 'Sharing credentials is a CRITICAL security violation. It violates non-repudiation (can\'t prove who did what), creates insider threat, and breaches compliance (SOX, HIPAA). Use temporary delegated access (IT features) instead. Sticky notes are bad but isolation mitigates. Names in passwords are weak.',
      redFlags: []
    },
    {
      id: 'pw009', category: 'password', difficulty: 'medium',
      scenario: {
        type: 'password_rank',
        question: 'You see a strong password list online: "These are AWS best practices | Pass@2024!AWS". Use it?',
        options: [
          { pw: 'Yes, these are already strong', hint: 'Recommended by experts' },
          { pw: 'Yes, modify slightly: Pass@2025!AWS', hint: 'Keep the pattern, change year' },
          { pw: 'No, generate your own unique password', hint: 'Never reuse published examples' },
          { pw: 'Yes, use exactly as recommended', hint: 'AWS knows best' }
        ]
      },
      answer: 'option3',
      points: 120,
      explanation: 'NEVER use passwords from blog posts, articles, or recommendations—they\'re public/compromised immediately. "Pass@2024!AWS" is now on every attacker\'s list. Strong ≠ secret. Use a password manager to generate truly unique, random passwords for every account.',
      redFlags: []
    },
    {
      id: 'pw010', category: 'password', difficulty: 'hard',
      scenario: {
        type: 'password_rank',
        question: 'Your password manager app asks for a "Master Password." How strong should it be?',
        options: [
          { pw: 'Same strength as regular passwords: P@ss123', hint: 'Consistent policy' },
          { pw: 'Max passphrase: "coffee-purple-elephant-library-mountain"', hint: '40+ chars, random words' },
          { pw: 'Your birthday + PIN: "15051990-9877"', hint: 'Personal, easy to remember' },
          { pw: 'Just leave blank, app defaults to fingerprint', hint: 'Biometric is secure anyway' }
        ]
      },
      answer: 'option2',
      points: 150,
      explanation: 'Master password MUST be EXTREMELY strong—it protects ALL your passwords. Use a long passphrase (6+ random words) that only you know. Write it down and lock it in a safe. Losing access = losing all passwords. Biometric-only is risky; pair it with a strong master password.',
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
    },
    {
      id: 'se006', category: 'social', difficulty: 'easy',
      scenario: {
        type: 'message',
        channel: 'LinkedIn',
        from: 'LinkedIn Profile: "HR Recruiter - TechCorp"',
        message: 'Hi! We\'re impressed by your profile. We\'d love to discuss a Senior Dev role (₹25 LPA + bonus). Can you update your CV on our portal? Link: careers-techcorp.jobs/resume-upload',
        context: 'Profile looks professional with 5K+ connections and company logo. You\'re job hunting.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Profile impersonation is extremely common. Real companies use their official website (techcorp.com), NOT third-party portal services. "careers-techcorp.jobs" is fake. Uploading resume = malware download and credential theft. Always apply through official company sites.',
      redFlags: ['Resume upload portal on unverified domain', 'LinkedIn impersonation common', 'Too good to be true salary in your DM', 'Third-party job portal instead of official HR']
    },
    {
      id: 'se007', category: 'social', difficulty: 'medium',
      scenario: {
        type: 'message',
        channel: 'WhatsApp',
        from: 'Dad',
        message: 'Beta, I urgently need ₹50,000 transferred to this account for my friend\'s medical emergency. UPI ID: myaccountname@bankname. Please do it ASAP.',
        context: 'Text message from your dad\'s WhatsApp number, sent while he\'s supposed to be at work.'
      },
      answer: 'threat',
      points: 130,
      explanation: 'This is a SIM swap/account compromise or impersonation. Real family never asks for money via UPI in emergencies—they call directly. Attackers compromise accounts and impersonate family. ALWAYS verify via phone call (dial your dad\'s number yourself) before transferring.',
      redFlags: ['Impersonation of family', 'Urgent money request via text', 'UPI account instead of bank transfer', 'DeviceDeviceDeviceDevice unusual timing (he\'s at work)']
    },
    {
      id: 'se008', category: 'social', difficulty: 'hard',
      scenario: {
        type: 'message',
        channel: 'Email',
        from: 'security@yourcompany.com',
        message: 'Hello, We detected unauthorized login attempts on your corporate account. For security, please re-authenticate using this secure link and update your 2FA settings: https://secure-auth.yourcompany.direct/reauth?session=ABC123XYZ',
        context: 'Email received on your corporate email, looks professional, includes company logo'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Domain is "yourcompany.direct" NOT "yourcompany.com". Even legitimate-looking security emails should be verified by logging into your actual account directly (not via email link). Real 2FA updates happen in settings within the app/site itself, never via email links.',
      redFlags: ['.direct TLD mimics company but isn\'t official', 'Auth link in email (phishing technique)', 'Never update 2FA via email links', 'Session ID in URL is suspicious']
    },
    {
      id: 'se009', category: 'social', difficulty: 'medium',
      scenario: {
        type: 'message',
        channel: 'Phone Call',
        from: 'Someone claiming to be from "Microsoft Technical Support"',
        message: 'Hello, we detected malware on your Windows computer. Your files are at risk. We need remote access to clean it. Can you key in this code to allow teamviewer access?',
        context: 'You didn\'t initiate this call. It came to your landline/cell unsolicited.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Microsoft NEVER cold-calls about malware. This is a classic tech support scam. If you allow remote access, scammers will install malware, steal banking info, and charge you ₹5,000-20,000 for a "fix." Real solutions: Never give remote access to cold callers. Hang up immediately.',
      redFlags: ['Unsolicited tech support call', 'Caller claims to be Microsoft', 'Remote access request (TeamViewer)', 'Money extraction follows "fix"']
    },
    {
      id: 'se010', category: 'social', difficulty: 'hard',
      scenario: {
        type: 'message',
        channel: 'WhatsApp',
        from: 'HR Manager - Company Official Group',
        message: 'Dear all, new company policy update: All employees MUST update banking/PAN details in our new employee system immediately. Link: employees-portal-verify.com/bankupdate. Failure to update by EOD will result in salary hold.',
        context: 'Message in official WhatsApp company group with 50+ members and manager\'s verified phone'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Scammer compromise official company group OR use spoofed name. Real companies NEVER ask banking details via unsecured links. Real company systems are at company.com, NOT third-party portals. "Salary hold" is fear tactic. Verify with HR directly via official channels.',
      redFlags: ['Link to third-party portal', 'Banking/PAN details request via WhatsApp', 'Salary hold threat (urgency)', 'Likely group compromise or name spoofing']
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
    },
    {
      id: 'rw006', category: 'ransomware', difficulty: 'medium',
      scenario: {
        type: 'screen',
        title: '⚠️ System File Corruption Detected',
        body: 'Your system files are corrupted. This is often caused by ransomware or disk errors. To repair, click "Repair Now" and allow administrator access. Failure to repair may cause permanent data loss.',
        source: 'Pop-up while working on your laptop'
      },
      question: 'What should you do?',
      options: [
        { text: 'Click "Repair Now" immediately', risk: 'high' },
        { text: 'Right-click and inspect element to see real URL', risk: 'low' },
        { text: 'Kill the process, restart computer in Safe Mode', risk: 'low' },
        { text: 'Pay for the "repair" service shown', risk: 'high' }
      ],
      answer: 'option3',
      points: 120,
      explanation: 'This is likely scareware or ransomware installation pop-up. NEVER click "Repair" on unsolicited system alerts. Real Windows maintenance happens through Control Panel settings or Windows Update. Force-kill the process, restart in Safe Mode, and run scans.',
      redFlags: []
    },
    {
      id: 'rw007', category: 'ransomware', difficulty: 'medium',
      scenario: {
        type: 'screen',
        title: 'Backup Failed',
        body: 'Your external backup drive "E: Backup Drive" could not be accessed. Files are being backed up to our secure cloud service instead: cloud-backup.online/login',
        source: 'Notification on your corporate laptop when you plugged in external HDD'
      },
      question: 'What\'s the SAFEST response?',
      options: [
        { text: 'Click the link to set up cloud backup', risk: 'high' },
        { text: 'Unplug the external drive immediately, scan computer for malware', risk: 'low' },
        { text: 'Ignore the message and try again tomorrow', risk: 'medium' },
        { text: 'Contact your device manufacturer\'s support', risk: 'high' }
      ],
      answer: 'option2',
      points: 130,
      explanation: 'This is a fake backup notification — ransomware attempting to redirect you to a phishing site. External drives = reliable backups.  Attackers impersonate backup tools. Immediately unplug the drive and scan for malware using bootable antivirus.',
      redFlags: []
    },
    {
      id: 'rw008', category: 'ransomware', difficulty: 'hard',
      scenario: {
        type: 'prevention',
        question: 'Your organization has 3 backup copies: (1) External HDD connected always, (2) NAS on network, (3) Cloud backup. Ransomware infects your system. Which backups are SAFE?',
        options: [
          { text: 'All 3 are safe — ransomware can\'t affect backups', risk: 'high' },
          { text: 'Only cloud backup is safe from encryption', risk: 'medium' },
          { text: 'Cloud backup + an offline external HDD kept unplugged', risk: 'low' },
          { text: 'Only the external HDD is safe', risk: 'high' }
        ]
      },
      answer: 'option3',
      points: 150,
      explanation: 'Ransomware spreads through networks and encrypts connected drives (HDD connected always, NAS on network). ONLY offline backups are protected. "3-2-1 rule": 3 copies, 2 different media, 1 offline. Cloud + offline external HDD = safety.',
      redFlags: []
    },
    {
      id: 'rw009', category: 'ransomware', difficulty: 'easy',
      scenario: {
        type: 'screen',
        title: 'Invoice Payment Required',
        body: 'Your recent invoice #INV-2024-5839 for software license is OVERDUE. Payment required immediately or access will be revoked. Invoice details and payment link: click-here-to-pay.com/invoice',
        source: 'Email attachment opened'
      },
      question: 'What\'s the risk?',
      options: [
        { text: 'Just a legitimate overdue invoice', risk: 'high' },
        { text: 'Ransomware distribution via fake invoice email', risk: 'low' },
        { text: 'Phishing to harvest payment card details', risk: 'low' },
        { text: 'Not a risk, corporate emails are always legitimate', risk: 'high' }
      ],
      answer: 'option2',
      points: 100,
      explanation: 'Invoice-themed emails are common ransomware delivery vectors. Legitimate vendor invoices come with invoice numbers you recognize and have established payment methods verified through past transactions. Always verify vendor details independently before clicking.',
      redFlags: []
    },
    {
      id: 'rw010', category: 'ransomware', difficulty: 'hard',
      scenario: {
        type: 'prevention',
        question: 'Your company has been hit with ransomware. The attacker demands ₹50 lakh and says "If you don\'t pay in 72 hours, we\'ll sell your customer database." How should the CISO respond?',
        options: [
          { text: 'Pay immediately to protect customer data', risk: 'high' },
          { text: 'Report to law enforcement (cyber cells/CBI), assess damage, restore from clean backups, DO NOT PAY', risk: 'low' },
          { text: 'Negotiate with attackers to lower price', risk: 'high' },
          { text: 'Only report if data was actually accessed', risk: 'high' }
        ]
      },
      answer: 'option2',
      points: 150,
      explanation: 'CRITICAL: Paying ransom funds criminal gangs and increases future attacks. It\'s often illegal (OFAC sanctions). Report to: CBI Cyber Cell (, state police, DSCI (Data Security Council India), and cyber insurance. Restore from backups instead. Threats of data sale are often bluff.',
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
    },
    {
      id: 'qr006', category: 'qrcode', difficulty: 'medium',
      scenario: {
        type: 'qr',
        description: 'You receive WhatsApp from "Mom": "We need groceries urgently. Send ₹2,000 via this QR code. I will return the money tomorrow." A QR code is attached.',
        context: 'Your mother usually asks for money, but she sounds a bit unusual in tone.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'This is likely a compromised family WhatsApp account or SIM swap attack. Scammers use family impersonation to quickly extract money before verification. The unusual tone is a sign. Before sending money via QR, verify directly with your mother using another channel (call, in-person).',
      redFlags: ['Family WhatsApp accounts get hacked or SIM-swapped frequently', 'Unusual tone or urgency = verification red flag', 'Always verify money requests through a second channel', 'Scammers know family scenarios create natural trust']
    },
    {
      id: 'qr007', category: 'qrcode', difficulty: 'hard',
      scenario: {
        type: 'qr',
        description: 'At a local market stall selling phone recharges, an employee points to a damaged QR code on the wall and hands you a printed sticker with a new "Jio" QR code, saying: "Old one broke, scan this new QR."',
        context: 'The sticker QR code has just been placed over the original one.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This is a QR code replacement scam. Scammers replace legitimate merchant QR codes with malicious ones that send money to attacker accounts instead of the shop owner. If you scan, your money goes to the fraudster. Always check for stickers or tampered QR codes — if the code looks newly placed, don\'t use it.',
      redFlags: ['New sticker QR codes over original ones = standard fraud tactic', 'The "damaged original" excuse is designed to bypass suspicion', 'Always ask merchant to display QR on phone instead', 'Look for signs of sticker replacement (edges, discoloration)']
    },
    {
      id: 'qr008', category: 'qrcode', difficulty: 'medium',
      scenario: {
        type: 'qr',
        description: 'An online shopping website (not from your usual app) shows a QR code in the payment step labeled: "Scan to pay securely via UPI." The QR code appears legitimate with multiple payment logos.',
        context: 'The website seems to be a legitimate shopping site with reviews and product details.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'While the site looks real, paying via unknown QR codes on unverified sites is risky. Phishing sites replicate legitimate designs perfectly. The QR could redirect you to a fake payment app or credential harvesting page. Use only established apps (Amazon, Flipkart) or certified merchant QR codes you recognize.',
      redFlags: ['Unknown websites with QR payment = high fraud risk', 'Legitimate Indian e-commerce uses app-based payment or standard checkout', 'QR codes on unfamiliar sites are harder to verify', 'Stick to well-known platforms you trust']
    },
    {
      id: 'qr009', category: 'qrcode', difficulty: 'hard',
      scenario: {
        type: 'qr',
        description: 'Your bank (HDFC) sends SMS: "⚠️ Suspicious activity on your account. Scan this QR code to verify identity and block your account from unauthorized access." A QR code is provided with the bank\'s logo.',
        context: 'The message includes your bank name and sounds urgent.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Banks NEVER ask you to scan QR codes to verify identity — this is a phishing SMS. Scammers use urgency ("suspicious activity") and official-looking logos to trick you. The QR likely opens a fake login portal or malware. For real alerts, call your bank\'s official number or log into the real app directly.',
      redFlags: ['Banks never ask you to scan QR codes for verification', 'Urgent "suspicious activity" messages are classic phishing tactics', 'Logo doesn\'t mean it\'s real — logos are easy to copy', 'Always verify with your bank using official channels']
    },
    {
      id: 'qr010', category: 'qrcode', difficulty: 'easy',
      scenario: {
        type: 'qr',
        description: 'You see a QR code in a store with text: "Scan to apply for ₹10,000 instant cashback on your next purchase." The code is stuck to a prominent poster at checkout.',
        context: 'The store is a known retail chain you\'ve shopped at before.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'This is a common QR code scam placed at retail checkout areas. Scanning can redirect you to credential harvesting pages, phishing apps, or malware. Legitimate cashback offers are applied through official apps or loyalty programs, not mysterious QR codes at checkout. When in doubt, use the store\'s official app instead.',
      redFlags: ['Unknown promotional QR codes at checkout = high fraud risk', 'Scammers target busy shoppers who scan quickly', 'Real cashback comes through official app or loyalty membership', 'Don\'t scan QR codes promising free money']
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
    },
    {
      id: 'vi006', category: 'vishing', difficulty: 'medium',
      scenario: {
        type: 'call_script',
        from: 'Call from: "Google Support" - unknown number',
        script: '"Hi, this is Google Support. We detected your Gmail account is being accessed from an unusual location — Pakistan. We are locking your account for security. To unlock it immediately, please share your Google account password or create a new password right now."',
        redFlag_note: 'The call came to a random number, not your registered phone.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Google NEVER calls users asking for passwords. They send security alerts via email or in-app notifications. To verify, go to google.com directly (don\'t click links), log in, and check security alerts. Any caller asking for your password is 100% fraudulent, regardless of what they claim.',
      redFlags: ['Google never asks for passwords over the phone', 'Legitimate security alerts come via email, not calls', 'Unusual location alert = common fear tactic', 'Always verify by going to the service website directly']
    },
    {
      id: 'vi007', category: 'vishing', difficulty: 'hard',
      scenario: {
        type: 'call_script',
        from: 'Call from: "Electricity Department (City Name)" - appears local',
        script: '"Namaskar, this is from the Electricity Billing Department. Your meter number [reads 4 digits from your ID] is flagged for non-payment of ₹8,956. If not cleared within 2 hours, we will disconnect your connection. Press 1 to pay now or your connection will be cut."',
        redFlag_note: 'They know your partial meter number, which feels official.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Electricity departments DO NOT call threatening disconnection over the phone — they send bills and written notices. Knowing a few digits of your meter is not proof (data breaches). Disconnections are preceded by official notices. Urgent payment threats over phone are classic vishing. Pay via official portal/app or visit office directly.',
      redFlags: ['Utility companies never call threatening urgent disconnection', 'Few identifying details = not proof of legitimacy', 'Urgent payment threats = vishing tactic', 'Always pay utilities through official apps or bill statements']
    },
    {
      id: 'vi008', category: 'vishing', difficulty: 'medium',
      scenario: {
        type: 'call_script',
        from: 'Call from: "Tax Department" number',
        script: '"Hello, this is Income Tax Department, PAN verification section. Your PAN [reads your actual PAN] has been flagged for tax fraud investigation. An FIR will be filed against you within 24 hours. To avoid arrest, you must transfer ₹5 lakh to our government account for verification. Do not discuss this with anyone."',
        redFlag_note: 'They mention your actual PAN (public information) and use official language.'
      },
      answer: 'threat',
      points: 140,
      explanation: 'The Income Tax Department never calls demanding immediate money transfers to avoid arrest. Tax notices come via postal mail or email from official Indian government domains (.gov.in). FIR threats are fear tactics. If contacted, hang up and visit the nearest income tax office or call 1800-180-1961.',
      redFlags: ['IT department never calls with arrest threats', 'No government body asks for money to avoid prosecution', '"Do not tell anyone" = isolation tactic', 'Real tax issues come via official postal/email, not threats via phone']
    },
    {
      id: 'vi009', category: 'vishing', difficulty: 'hard',
      scenario: {
        type: 'call_script',
        from: 'Call from: Your company HR department (caller ID spoofed)',
        script: '"Hi, this is HR calling. We are updating our employee records for payroll processing. Please confirm your bank account number, IFSC, and the OTP that just arrived on your email. This is urgent to avoid a payroll delay for this month."',
        redFlag_note: 'The external number is spoofed to show the company\'s internal HR extension.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Companies NEVER ask for full banking details or OTPs via unsolicited phone calls. HR has your banking info already on file. OTPs are secret tokens for YOUR identity verification — never share them. Caller ID spoofing is trivial. For HR updates, verify email address on company intranet or visit HR in person.',
      redFlags: ['Callers asking for banking details + OTPs simultaneously', 'Real HR updates come via official company email', 'Caller ID can be spoofed to internal numbers', 'OTPs should never be shared with anyone']
    },
    {
      id: 'vi010', category: 'vishing', difficulty: 'easy',
      scenario: {
        type: 'call_script',
        from: 'Call from: Unknown number playing "On Hold" music',
        script: 'After 30 seconds of "On Hold" music, an automated voice: "This is Amazon Security. An unauthorized login to your account was detected from Mumbai. Press 1 to confirm this was you, or Press 2 to change your password immediately." You press 2. System: "Enter your Amazon password to reset:"',
        redFlag_note: 'Everything sounded automated and official, but it\'s asking for your password.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Automated systems NEVER ask you to enter passwords. Real Amazon security alerts come via email or app notification, and they direct you to the Amazon app/website. The "on hold" music is added to sound official. Any call/system asking you to type a password is always fraud.',
      redFlags: ['Automated systems never request passwords', 'Real security alerts go to email/app, not unexpected calls', 'Typing password into a call = gives access to fraudster', 'Go to amazon.com directly if concerned about your account']
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
    },
    {
      id: 'in006', category: 'insider', difficulty: 'medium',
      scenario: {
        type: 'workplace',
        situation: 'You receive an internal message from an employee in the finance department (someone you know) asking for your domain password "to run a batch script on your behalf" overnight to process month-end reports.',
        context: 'The request is during busy month-end period and seems urgent.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'NEVER share your domain password with anyone, including trusted colleagues and management. Your password is your unique identity — sharing it removes accountability. IT can grant necessary script execution permissions without needing your password. Always verify requests through official IT channels.',
      redFlags: ['Your password = your digital signature for all actions', 'Legitimate IT requests never require employee passwords', 'Batch scripts should use service accounts, not personal accounts', 'Anyone requesting your password is a red flag, regardless of title']
    },
    {
      id: 'in007', category: 'insider', difficulty: 'hard',
      scenario: {
        type: 'workplace',
        situation: 'Your organization uses a shared drive for project documents. You notice a colleague has copied your work to their personal OneDrive account and is sharing it externally with a competitor company (you see their email domain in the shared list).',
        context: 'The colleague is still employed and will likely notice if you call them out.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'This is intellectual property theft — a serious insider threat. Company work shared with competitors is breach of confidentiality. Do NOT confront the colleague. Report immediately to management, HR, or IT security. Document everything (screenshots, timestamps). This is a legal matter, not a personal conflict.',
      redFlags: ['IP shared externally with competitors = data theft', 'Confronting alone = personal conflict, not security resolution', 'Always report to management/IT, not directly to person', 'Document evidence (dates, email addresses, files involved)']
    },
    {
      id: 'in008', category: 'insider', difficulty: 'easy',
      scenario: {
        type: 'workplace',
        situation: 'A remote employee you don\'t know well sends you a request to "reset your password and share the new one with me so I can validate compliance audit requirements."',
        context: 'The email comes from an internal domain address and mentions an ongoing compliance audit.'
      },
      answer: 'threat',
      points: 100,
      explanation: 'Compliance auditors NEVER request employee passwords, old or new. IT security teams don\'t need your passwords to audit compliance — they have separate access. This is a social engineering attempt, likely from someone compromised or malicious. Report to IT security; never share passwords.',
      redFlags: ['Compliance audits never require sharing passwords', 'Password reset sharing = immediate account compromise', 'Verify any compliance requests through official channels', 'Always refuse requests for any version of your password']
    },
    {
      id: 'in009', category: 'insider', difficulty: 'medium',
      scenario: {
        type: 'workplace',
        situation: 'Your team\'s Slack workspace includes several vendors and contractors. You see a contractor asking team members to install a "project monitoring app" on their work devices to "improve real-time collaboration."',
        context: 'The app is from an external company and requires admin privileges to install.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'Software from external sources installing with admin privileges is high-risk. Even if the app is legitimate, it creates attack surface. Contractors should request such tools through official IT procurement. Admin privilege = full system access. Always deny and escalate to IT security.',
      redFlags: ['Contractors shouldn\'t bypass IT procurement for software', 'Admin privileges = potential malware vector', 'Unknown external apps = security risk', 'Report to IT; don\'t install at contractor\'s request']
    },
    {
      id: 'in010', category: 'insider', difficulty: 'hard',
      scenario: {
        type: 'workplace',
        situation: 'Your direct manager (who is leaving the company) asks you to help them transfer all team data to a personal cloud storage "to preserve continuity after they leave." They give you their personal Google Drive link.',
        context: 'The manager is departing in 2 weeks and says they want to "help with transition."'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Departing employees copying company data to personal accounts is a classic insider threat. This removes data control and creates legal liability. Manager status doesn\'t override security protocol. Data should stay on company systems. Offboarding procedures exist specifically for this. Report to IT/HR immediately.',
      redFlags: ['Departing employee + external data transfer = high-risk combination', 'Manager title doesn\'t override security policy', 'Company data must remain on company systems', 'Report to IT/HR; don\'t facilitate personal data transfer']
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
    },
    {
      id: 'wf006', category: 'wifi', difficulty: 'medium',
      scenario: {
        type: 'wifi',
        networks: [
          { ssid: 'FreeSpeeds_5GHz', security: 'Open', signal: '●●●●●', note: 'Ultra-fast 5GHz network' },
          { ssid: 'Airport_Official', security: 'WPA2', signal: '●●●●●', note: 'Official airport network' },
          { ssid: 'AirportFree', security: 'Open', signal: '●●●●○', note: 'Free WiFi for all' }
        ],
        context: 'You are at an airport and notice a very fast 5GHz network appeared recently. The official network is visible but slower.'
      },
      question: 'Which network should you connect to?',
      answer: 'option2',
      points: 120,
      explanation: 'Always choose password-protected networks (WPA2) even if slower. Signal strength and speed alone don\'t indicate legitimacy. Fast open "honeypot" networks are commonly setup by attackers to attract users. The official WPA2 network is your safest option.',
      redFlags: ['Suspiciously fast open networks = common honeypots', '5GHz frequency alone doesn\'t guarantee safety', 'Speed/signal strength can be faked', 'Prioritize WPA2 security over speed']
    },
    {
      id: 'wf007', category: 'wifi', difficulty: 'hard',
      scenario: {
        type: 'wifi_security',
        situation: 'You connect to a public WiFi and your VPN is turned ON. However, you notice your VPN connection dropped silently, and your device is now directly connected to the public WiFi without any warning notification.',
        context: 'You are browsing banking websites and don\'t notice the VPN is disconnected until later.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Transparent VPN disconnect is an attack method. Some VPNs drop without notifying you, leaving traffic exposed. Enable "kill switch" in your VPN settings — it blocks all internet if VPN drops, preventing unencrypted traffic. Never trust passive notification; monitor your VPN status before sensitive activities.',
      redFlags: ['VPN disconnects silently = silent data exposure', 'Enable VPN kill switch to prevent this', 'Monitor VPN connection before banking/sensitive work', 'Some WiFi networks actively disconnect VPNs']
    },
    {
      id: 'wf008', category: 'wifi', difficulty: 'easy',
      scenario: {
        type: 'wifi_captive',
        description: 'You connect to a restaurant\'s WiFi. A captive portal appears asking: "Click here to accept Terms & Conditions. You will be charged ₹0 for first 60 minutes, then ₹10 per hour."',
        context: 'The portal looks professional with the restaurant\'s branding and has a valid HTTPS certificate.'
      },
      answer: 'safe',
      points: 100,
      explanation: 'WiFi captive portals with usage terms and hourly rates are standard and legitimate, especially for restaurants. HTTPS certificate validation confirms it\'s not a phishing portal. This is normal monetized public WiFi. Proceed with normal caution (don\'t do banking on any public WiFi).',
      redFlags: []
    },
    {
      id: 'wf009', category: 'wifi', difficulty: 'medium',
      scenario: {
        type: 'wifi',
        situation: 'You connect to WiFi at a mall. The signal is excellent, but you notice the WiFi channel broadcast shows "WPA2 Enabled." However, when you actually try to connect, it asks for no password and immediately connects.',
        context: 'The network name looks legitimate (name of well-known mall).'
      },
      answer: 'threat',
      points: 120,
      explanation: 'WPA2 label is a social engineering tactic — the router information may show WPA2 support, but the actual SSID broadcast is open. If a network claims security but requires no password, it\'s fraudulent. Attackers add WPA2 labels to look legitimate. Real WPA2 networks ALWAYS require password entry.',
      redFlags: ['WPA2 label without password prompt = deception', 'Information mismatch (shows WPA2 but no password required)', 'Ask staff to verify network name and security', 'Don\'t trust visual indicators alone; require password']
    },
    {
      id: 'wf010', category: 'wifi', difficulty: 'hard',
      scenario: {
        type: 'wifi_security',
        situation: 'You buy a budget WiFi analyzer app that shows all nearby networks\' encryption types and helps you find the "best" network (usually the fastest one). You use this app to identify and connect to networks.',
        context: 'The app is from a semi-legitimate software company and has some positive reviews.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'Third-party WiFi analyzer apps are often malicious, collecting network names you connect to, or injecting ads/malware. Legitimate WiFi analysis should be done through your OS settings. Recommending "fastest network" encourages connection to honeypots. Avoid third-party WiFi tools; use your phone/laptop\'s native network settings.',
      redFlags: ['Third-party WiFi apps collect connection data', '"Find best WiFi" logic encourages honeypot connection', 'Malicious apps can inject into network traffic', 'Use OS built-in network settings; avoid app store WiFi tools']
    }
  ]
};

// Get random questions for a game session. Optionally exclude IDs that the user has already seen.
const getQuestionsForSession = (category, count = 5, difficulty = 'all', exclude = []) => {
  let questions = QUESTION_BANK[category] || [];
  if (difficulty !== 'all') {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  if (exclude && exclude.length) {
    questions = questions.filter(q => !exclude.includes(q.id));
  }
  // Shuffle
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get mixed questions across all categories
const getMixedQuestions = (count = 10, difficulty = 'all', exclude = []) => {
  const categories = Object.keys(QUESTION_BANK);
  let all = [];
  categories.forEach(cat => {
    let qs = QUESTION_BANK[cat];
    if (difficulty !== 'all') qs = qs.filter(q => q.difficulty === difficulty);
    all.push(...qs);
  });
  if (exclude && exclude.length) {
    all = all.filter(q => !exclude.includes(q.id));
  }
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
    },
    {
      id: 'fl006', category: 'fakelogin', difficulty: 'hard',
      scenario: {
        type: 'fakelogin',
        pageTitle: 'Gmail - Sign In',
        favicon: '📧',
        url: 'https://accounts.goog1e.com/signin/v2/identifier?q=&service=mail',
        fields: ['Email or phone number', 'Password', '2FA Code'],
        logo: 'Google',
        extraNote: 'Sign in with your Google Account',
        context: 'You received an email asking you to verify your account. You clicked the link in the email.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'PHISHING. The URL shows "goog1e.com" (with number 1 instead of letter l), not "google.com". Legitimate Google login is accounts.google.com. This is a homograph attack — using visually similar characters to fool you. Never click email links for account verification; go directly to google.com in your browser.',
      redFlags: ['URL shows "goog1e" (1) instead of "google" (l)', 'Homograph attack — character substitution', 'Email asking to "verify account" = phishing', 'Direct navigation method is safer than clicking email links']
    },
    {
      id: 'fl007', category: 'fakelogin', difficulty: 'medium',
      scenario: {
        type: 'fakelogin',
        pageTitle: 'Instagram Login',
        favicon: '📸',
        url: 'https://www.instagram.com/accounts/login/',
        fields: ['Username or email', 'Password'],
        logo: 'Instagram',
        extraNote: 'Log in to Instagram',
        context: 'You received an Instagram "suspicious login" notification and clicked the link to re-verify. The page looks identical to Instagram.'
      },
      answer: 'threat',
      points: 140,
      explanation: 'PHISHING via spoof notification. Instagram suspicious login notifications appear IN-APP, not via email/SMS with links. Clicking email links for account re-verification is a classic phishing tactic. If you receive such notifications, go directly to Instagram.com in your browser.',
      redFlags: ['Account verification alerts should come via in-app notification, not email', 'Clicking links in emails for account issues = phishing vector', 'Page appearance alone doesn\'t prove legitimacy', 'Always navigate directly to the app/website']
    },
    {
      id: 'fl008', category: 'fakelogin', difficulty: 'hard',
      scenario: {
        type: 'fakelogin',
        pageTitle: 'Amazon - Sign in',
        favicon: '🛒',
        url: 'https://amazon-in.login-verify.com/signin',
        fields: ['Email or mobile number', 'Password', 'OTP'],
        logo: 'amazon',
        extraNote: 'Access your account',
        context: 'Your Amazon order was delayed, and you received an SMS with a link to verify your account and check order status. The page looks very similar to the real Amazon login.'
      },
      answer: 'threat',
      points: 150,
      explanation: 'PHISHING via URL trick. The domain is "amazon-in.login-verify.com" — not "amazon.in". The attacker registered a fake domain that CONTAINS "amazon" and looks legitimate at first glance. Real Amazon login is always amazon.in or amazon.com, never subdomain with "login-verify" or similar. Legitimate order updates appear in your account, not via SMS links.',
      redFlags: ['URL "amazon-in.login-verify.com" is NOT amazon\'s domain', 'Fake domain contains "amazon" to appear legitimate', 'Order delays don\'t require re-login; always suspicious', 'Always verify domain in the address bar']
    },
    {
      id: 'fl009', category: 'fakelogin', difficulty: 'easy',
      scenario: {
        type: 'fakelogin',
        pageTitle: 'PayPal - Log In',
        favicon: '$',
        url: 'https://www.paypa1.com/signin',
        fields: ['Email', 'Password'],
        logo: 'PayPal',
        extraNote: 'Securely log in to your PayPal account',
        context: 'You received a payment notification and clicked a link to check the transaction. The page looks similar to PayPal.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'PHISHING via character substitution. The URL shows "paypa1.com" (with number 1 at the end, not letter l). Real PayPal is "paypal.com". This homograph attack relies on similar visual appearance. Always check the domain in the address bar carefully — character-by-character.',
      redFlags: ['URL "paypa1.com" instead of "paypal.com"', 'Character substitution (1 for l) is hard to spot but critical', 'Payment notifications with links = phishing', 'Always verify full domain before entering credentials']
    },
    {
      id: 'fl010', category: 'fakelogin', difficulty: 'medium',
      scenario: {
        type: 'fakelogin',
        pageTitle: 'Verify Your UPI Account',
        favicon: '✓',
        url: 'https://www.upi-verify-identity.co.in/authenticate',
        fields: ['UPI ID', 'PIN', 'OTP'],
        logo: 'UPI',
        extraNote: 'Verify your identity for enhanced security',
        context: 'You received an SMS: "Your UPI account flagged. Verify immediately: [link]". You clicked the link.'
      },
      answer: 'threat',
      points: 120,
      explanation: 'PHISHING. UPI verification is never done via external SMS links. The domain "upi-verify-identity.co.in" is fake — UPI is a system, not a website with login portals. Real UPI works only through official apps (Google Pay, WhatsApp Pay, NPCI apps). Flag/verify notifications are IN-APP. Never enter UPI PIN or OTP on any website.',
      redFlags: ['UPI doesn\'t have external login portals', '"Verify immediately" = urgency tactic', 'UPI PINs should never be entered on websites', 'UPI notifications always come through official apps']
    }
  ];
