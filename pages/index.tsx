<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Me Famous - No Marketing Budget? No Problem. AI Ranks Your Idea.</title>
    <style>
        @font-face {
            font-family: 'DrukWide';
            src: url('/fonts/Druk-HeavyItalic-Trial.otf') format('opentype');
            font-weight: 900;
            font-style: italic;
            font-display: swap;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: white;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
        }
        
        /* Header */
        header {
            background: white;
            border-bottom: 2px solid black;
            padding: 20px 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 24px;
            font-weight: 900;
            font-style: italic;
        }
        
        .nav-links {
            display: flex;
            gap: 40px;
            list-style: none;
        }
        
        .nav-links a {
            color: black;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Hero Section */
        .hero {
            background: black;
            color: white;
            padding: 120px 0;
            text-align: center;
        }
        
        .hero h1 {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: clamp(48px, 6vw, 96px);
            font-weight: 900;
            font-style: italic;
            line-height: 0.95;
            letter-spacing: -0.02em;
            margin-bottom: 40px;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero h1 .highlight {
            color: #FACC15;
        }
        
        .hero .subtitle {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            line-height: 1.6;
            opacity: 0.9;
            max-width: 800px;
            margin: 0 auto;
            letter-spacing: 0.5px;
        }
        
        /* Value Props Section */
        .value-props {
            background: white;
            border-bottom: 8px solid #FACC15;
            padding: 80px 0;
        }
        
        .value-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 60px;
        }
        
        .value-card {
            text-align: center;
            padding: 0 20px;
        }
        
        .value-icon {
            font-size: 48px;
            margin-bottom: 30px;
            display: block;
            opacity: 0.8;
        }
        
        .value-title {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        
        .value-desc {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.8;
            color: #666;
        }
        
        /* Comparison Section */
        .comparison {
            background: #1e293b;
            color: white;
            padding: 80px 0;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .comparison h2 {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 48px;
            font-weight: 900;
            font-style: italic;
            margin-bottom: 40px;
            letter-spacing: -0.02em;
        }
        
        .comparison ul {
            list-style: none;
            space-y: 24px;
        }
        
        .comparison li {
            display: flex;
            gap: 16px;
            font-size: 18px;
            line-height: 1.6;
            align-items: flex-start;
        }
        
        /* Leaderboard Section */
        .leaderboard-preview {
            padding: 80px 0;
            background: #f8f8f8;
        }
        
        .leaderboard-header {
            background: black;
            color: white;
            padding: 30px;
            margin-bottom: 0;
        }
        
        .leaderboard-header h2 {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 42px;
            font-weight: 900;
            font-style: italic;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        
        .leaderboard-table {
            background: white;
            border: 4px solid black;
            box-shadow: 10px 10px 0 rgba(0,0,0,0.1);
        }
        
        .idea-row {
            padding: 30px;
            border-bottom: 3px solid #eee;
            transition: background 0.2s;
            cursor: pointer;
            position: relative;
        }
        
        .idea-row:hover {
            background: #f9f9f9;
        }
        
        .rank-badge {
            position: absolute;
            top: -15px;
            left: -15px;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 24px;
            font-weight: 900;
            transform: rotate(5deg);
        }
        
        .rank-1 { background: #FACC15; color: black; }
        .rank-2 { background: #9CA3AF; color: white; }
        .rank-3 { background: #EA580C; color: white; }
        .rank-default { background: #1F2937; color: white; }
        
        .idea-content {
            padding-left: 60px;
        }
        
        .idea-title {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }
        
        .idea-meta {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
            text-transform: uppercase;
        }
        
        .idea-desc {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        
        .score-item {
            text-align: center;
        }
        
        .score-value {
            font-family: 'Courier New', monospace;
            font-size: 32px;
            font-weight: bold;
            color: #1e3a8a;
        }
        
        .score-label {
            font-family: 'Bahnschrift', sans-serif;
            font-size: 12px;
            text-transform: uppercase;
            color: #999;
            letter-spacing: 1px;
        }
        
        /* How It Works */
        .how-it-works {
            background: white;
            padding: 100px 0;
        }
        
        .how-it-works h2 {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 56px;
            font-weight: 900;
            font-style: italic;
            text-align: center;
            margin-bottom: 80px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        
        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 60px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .step-card {
            text-align: center;
            padding: 0 20px;
        }
        
        .step-number {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 72px;
            font-weight: 900;
            font-style: italic;
            color: #FACC15;
            margin-bottom: 20px;
        }
        
        .step-title {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }
        
        .step-desc {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }
        
        /* Warning Box */
        .warning-box {
            max-width: 800px;
            margin: 80px auto 0;
            background: #DC2626;
            border: 4px solid #991B1B;
            padding: 40px;
            color: white;
            text-align: center;
        }
        
        .warning-box h3 {
            font-family: 'Bahnschrift', sans-serif;
            font-size: 24px;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        
        .warning-box p {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            line-height: 1.6;
        }
        
        /* CTA Section */
        .cta-section {
            background: linear-gradient(to right, #1e3a8a, #1e40af);
            padding: 100px 0;
            text-align: center;
            color: white;
        }
        
        .cta-section h2 {
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 64px;
            font-weight: 900;
            font-style: italic;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        
        .cta-section p {
            font-family: 'Bahnschrift', sans-serif;
            font-size: 24px;
            margin-bottom: 50px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cta-button {
            display: inline-block;
            background: #FACC15;
            color: black;
            padding: 24px 60px;
            font-family: 'DrukWide', Impact, sans-serif;
            font-size: 28px;
            font-weight: 900;
            font-style: italic;
            text-decoration: none;
            transition: transform 0.3s;
            text-transform: uppercase;
        }
        
        .cta-button:hover {
            transform: scale(1.05);
            background: #FDE047;
        }
        
        /* Footer */
        footer {
            background: black;
            color: white;
            padding: 40px 0;
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .container {
                padding: 0 20px;
            }
            
            .comparison-grid {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            
            .score-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .steps-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo">MAKE ME FAMOUS</div>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/how-it-works">How It Works</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
                <li><a href="/submit">Submit</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>
                NO MONEY? NO PROBLEM.<br>
                <span class="highlight">LET AI JUDGE YOUR IDEA</span>
            </h1>
            <p class="subtitle">
                SKIP THE EXPENSIVE MARKETING. SUBMIT YOUR IDEA. GET RANKED BY AI. WIN CASH PRIZES.
            </p>
        </div>
    </section>

    <!-- Value Proposition -->
    <section class="value-props">
        <div class="container">
            <div class="value-grid">
                <div class="value-card">
                    <h3 class="value-title">No Kickstarter Budget?</h3>
                    <p class="value-desc">
                        Other platforms need $10K+ for marketing to get noticed. Here? <strong>$0</strong>. 
                        Your idea speaks for itself.
                    </p>
                </div>
                <div class="value-card">
                    <h3 class="value-title">Instant AI Ranking</h3>
                    <p class="value-desc">
                        No waiting for backers. Our harsh AI scores you immediately. 
                        Good ideas rise to the top <strong>automatically</strong>.
                    </p>
                </div>
                <div class="value-card">
                    <h3 class="value-title">Monthly Cash Prizes</h3>
                    <p class="value-desc">
                        Top ideas win <strong>real money</strong>. Investors browse the leaderboard. 
                        Every month is a new chance.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Comparison Section -->
    <section class="comparison">
        <div class="container">
            <div class="comparison-grid">
                <div>
                    <h2 style="color: #EF4444;">THE OLD WAY IS BROKEN</h2>
                    <ul>
                        <li>
                            <span style="color: #EF4444; font-weight: bold;">×</span>
                            <span>Kickstarter: Need $10K+ marketing budget to get seen</span>
                        </li>
                        <li>
                            <span style="color: #EF4444; font-weight: bold;">×</span>
                            <span>IndieGoGo: Pay for ads or get buried</span>
                        </li>
                        <li>
                            <span style="color: #EF4444; font-weight: bold;">×</span>
                            <span>ProductHunt: Need existing audience to win</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 style="color: #10B981;">OUR WAY: MERIT ONLY</h2>
                    <ul>
                        <li>
                            <span style="color: #10B981; font-weight: bold;">✓</span>
                            <span>AI judges quality, not marketing spend</span>
                        </li>
                        <li>
                            <span style="color: #10B981; font-weight: bold;">✓</span>
                            <span>Great ideas automatically rank high</span>
                        </li>
                        <li>
                            <span style="color: #10B981; font-weight: bold;">✓</span>
                            <span>Investors see the best ideas first</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Leaderboard Preview -->
    <section class="leaderboard-preview">
        <div class="container">
            <div class="leaderboard-table">
                <div class="leaderboard-header">
                    <h2>THIS WEEK'S BATTLEGROUND</h2>
                </div>
                
                <!-- Idea 1 -->
                <div class="idea-row">
                    <div class="rank-badge rank-1">#1</div>
                    <div class="idea-content">
                        <h3 class="idea-title">Neon Nights</h3>
                        <div class="idea-meta">Type: Movie • By: Michael Rodriguez</div>
                        <p class="idea-desc">
                            A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven't happened yet...
                        </p>
                        <div class="score-grid">
                            <div class="score-item">
                                <div class="score-value">8.73</div>
                                <div class="score-label">AI Score</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">9.1</div>
                                <div class="score-label">Public (23)</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">8.92</div>
                                <div class="score-label">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Idea 2 -->
                <div class="idea-row">
                    <div class="rank-badge rank-2">#2</div>
                    <div class="idea-content">
                        <h3 class="idea-title">GreenEats</h3>
                        <div class="idea-meta">Type: Business • By: David Park</div>
                        <p class="idea-desc">
                            Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts...
                        </p>
                        <div class="score-grid">
                            <div class="score-item">
                                <div class="score-value">8.43</div>
                                <div class="score-label">AI Score</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">8.7</div>
                                <div class="score-label">Public (18)</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">8.57</div>
                                <div class="score-label">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Idea 3 -->
                <div class="idea-row">
                    <div class="rank-badge rank-3">#3</div>
                    <div class="idea-content">
                        <h3 class="idea-title">Battle Royale Chess</h3>
                        <div class="idea-meta">Type: Game • By: James Mitchell</div>
                        <p class="idea-desc">
                            100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins...
                        </p>
                        <div class="score-grid">
                            <div class="score-item">
                                <div class="score-value">8.04</div>
                                <div class="score-label">AI Score</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">8.3</div>
                                <div class="score-label">Public (31)</div>
                            </div>
                            <div class="score-item">
                                <div class="score-value">8.17</div>
                                <div class="score-label">Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
        <div class="container">
            <h2>The Battleground Rules</h2>
            
            <div class="steps-grid">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <h3 class="step-title">Submit Your Weapon</h3>
                    <p class="step-desc">Your idea is your weapon. 30-500 words. Make it count.</p>
                </div>
                
                <div class="step-card">
                    <div class="step-number">2</div>
                    <h3 class="step-title">Face the AI Judge</h3>
                    <p class="step-desc">Brutal AI scores 0-10. No mercy. Most fail.</p>
                </div>
                
                <div class="step-card">
                    <div class="step-number">3</div>
                    <h3 class="step-title">Survive Public Vote</h3>
                    <p class="step-desc">Community votes. Weak ideas die. Strong ideas rise.</p>
                </div>
                
                <div class="step-card">
                    <div class="step-number">4</div>
                    <h3 class="step-title">Claim Your Prize</h3>
                    <p class="step-desc">$5,000 monthly prizes. Real investors watching.</p>
                </div>
            </div>

            <div class="warning-box">
                <h3>Warning</h3>
                <p>
                    The AI doesn't care about your feelings. Most ideas score 3-6. 
                    If you can't handle brutal truth, leave now.
                </p>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <h2>No Budget? No Problem.</h2>
            <p>Stop begging for money. Let your idea prove itself.</p>
            <a href="/submit" class="cta-button">Submit Now →</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2024 MAKE ME FAMOUS. WHERE IDEAS FIGHT TO WIN.</p>
    </footer>
</body>
</html>
