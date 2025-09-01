<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hyoka - AI Idea Evaluation Platform</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #fafafa;
            color: #0d1117;
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
        }

        /* Animated Background */
        .background-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .background-image {
            position: absolute;
            width: 120%;
            height: 120%;
            top: -10%;
            left: -10%;
            background-image: url('/bg1.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: blur(3px);
            opacity: 0.15;
            animation: slowDrift 30s ease-in-out infinite;
        }

        @keyframes slowDrift {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            25% {
                transform: translate(-2%, -1%) scale(1.02);
            }
            50% {
                transform: translate(1%, -2%) scale(1.01);
            }
            75% {
                transform: translate(-1%, 1%) scale(1.02);
            }
        }

        /* Header */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e1e5e9;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            height: 70px;
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #0d1117;
            text-decoration: none;
            letter-spacing: -1px;
        }

        .nav {
            display: flex;
            gap: 32px;
        }

        .nav-link {
            color: #656d76;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: color 0.2s;
        }

        .nav-link:hover {
            color: #0d1117;
        }

        .submit-btn {
            background: #0d1117;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }

        .submit-btn:hover {
            background: #1d1d1d;
            transform: translateY(-1px);
        }

        /* Main Content */
        .main-content {
            margin-top: 70px;
            padding: 40px 24px;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Hero Section */
        .hero {
            text-align: center;
            margin-bottom: 60px;
            padding: 60px 0;
        }

        .hero-title {
            font-size: 48px;
            font-weight: 800;
            color: #0d1117;
            margin-bottom: 16px;
            letter-spacing: -2px;
        }

        .hero-subtitle {
            font-size: 18px;
            color: #656d76;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Categories Container */
        .categories-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 60px;
        }

        /* Category Column */
        .category-column {
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e1e5e9;
        }

        .category-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f6f8fa;
        }

        .category-title {
            font-size: 20px;
            font-weight: 700;
            color: #0d1117;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .category-icon {
            font-size: 24px;
        }

        .category-count {
            background: #f6f8fa;
            color: #656d76;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        /* Idea Cards */
        .idea-card {
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            margin-bottom: 12px;
            transition: all 0.3s;
            overflow: hidden;
        }

        .idea-card:hover {
            border-color: #2563eb;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
            transform: translateY(-2px);
        }

        .card-main {
            padding: 16px;
            cursor: pointer;
        }

        .card-rank {
            position: absolute;
            top: 12px;
            right: 12px;
            background: #dc2626;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
        }

        .card-title {
            font-size: 15px;
            font-weight: 600;
            color: #0d1117;
            margin-bottom: 8px;
            padding-right: 30px;
        }

        .card-author {
            font-size: 12px;
            color: #656d76;
            margin-bottom: 12px;
        }

        .scores-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 12px;
        }

        .score-item {
            background: #f6f8fa;
            padding: 8px;
            border-radius: 6px;
            text-align: center;
        }

        .score-value {
            font-size: 18px;
            font-weight: 700;
            color: #0d1117;
            display: block;
        }

        .score-label {
            font-size: 10px;
            color: #656d76;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .expand-btn {
            width: 100%;
            background: transparent;
            border: 1px solid #e1e5e9;
            padding: 8px;
            border-radius: 6px;
            color: #656d76;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .expand-btn:hover {
            background: #f6f8fa;
            border-color: #2563eb;
            color: #2563eb;
        }

        /* Expanded Content */
        .card-expanded {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            background: #f6f8fa;
            border-top: 1px solid #e1e5e9;
        }

        .card-expanded.active {
            max-height: 500px;
        }

        .expanded-content {
            padding: 16px;
        }

        .brief-text {
            font-size: 13px;
            color: #656d76;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .detailed-scores {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .detailed-score-item {
            background: white;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #e1e5e9;
        }

        .detailed-score-label {
            font-size: 11px;
            color: #656d76;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .detailed-score-value {
            font-size: 16px;
            font-weight: 600;
            color: #0d1117;
        }

        .verdict-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 12px;
        }

        .verdict-invest {
            background: #dcfce7;
            color: #16a34a;
        }

        .verdict-maybe {
            background: #fef3c7;
            color: #d97706;
        }

        .verdict-pass {
            background: #fee2e2;
            color: #dc2626;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .categories-container {
                grid-template-columns: 1fr;
                gap: 32px;
            }
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 32px;
            }
            
            .nav {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Animated Background -->
    <div class="background-container">
        <div class="background-image"></div>
    </div>

    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <a href="/" class="logo">Hyoka</a>
            <nav class="nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/explore" class="nav-link">Explore</a>
                <a href="/leaderboard" class="nav-link">Leaderboard</a>
                <a href="/analytics" class="nav-link">Analytics</a>
                <a href="/about" class="nav-link">About</a>
            </nav>
            <a href="/submit" class="submit-btn">Submit Idea</a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Hero Section -->
        <section class="hero">
            <h1 class="hero-title">Professional AI Idea Evaluation</h1>
            <p class="hero-subtitle">
                Get comprehensive AI analysis of market potential, innovation level, 
                and execution complexity for your ideas.
            </p>
        </section>

        <!-- Categories Grid -->
        <div class="categories-container">
            <!-- Movies Column -->
            <div class="category-column">
                <div class="category-header">
                    <h2 class="category-title">
                        <span class="category-icon">🎬</span>
                        Movies
                    </h2>
                    <span class="category-count">5 ideas</span>
                </div>

                <!-- Movie Cards -->
                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">1</span>
                        <h3 class="card-title">Memory Vault</h3>
                        <p class="card-author">Elena Rodriguez</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">89</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.7</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                In 2090, memories are extracted and stored as digital assets. A black market memory dealer 
                                discovers someone is planting false memories in the global database, threatening the nature 
                                of human identity and truth itself.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">91</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">86</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">90</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">1,203</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">2</span>
                        <h3 class="card-title">The Algorithm War</h3>
                        <p class="card-author">David Zhang</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">81</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.1</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Corporate espionage thriller where tech companies wage secret battles through AI algorithms. 
                                A data scientist discovers her recommendation engine is being weaponized to manipulate 
                                global elections and financial markets.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">84</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">78</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">82</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">892</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">3</span>
                        <h3 class="card-title">Echoes of Tomorrow</h3>
                        <p class="card-author">Jennifer Williams</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">78</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.9</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Archaeologists discover future artifacts buried in the past. Each artifact reveals humanity's 
                                fate through mind-bending time paradoxes that question the nature of causality and free will.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">75</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">82</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">77</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">567</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-maybe">MAYBE</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">4</span>
                        <h3 class="card-title">Digital Souls</h3>
                        <p class="card-author">Marcus Chen</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">72</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.5</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                When consciousness can be uploaded, a detective must solve murders where the victims 
                                are still technically alive in the cloud. The line between life and death blurs.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">74</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">69</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">73</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">432</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-maybe">MAYBE</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">5</span>
                        <h3 class="card-title">The Last Sunrise</h3>
                        <p class="card-author">Sarah Kim</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">68</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.2</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Earth's rotation is slowing. Scientists have 72 hours of daylight to solve the crisis 
                                before eternal night falls. A race against physics itself.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">71</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">65</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">68</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">298</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-pass">PASS</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Business Column -->
            <div class="category-column">
                <div class="category-header">
                    <h2 class="category-title">
                        <span class="category-icon">💼</span>
                        Business
                    </h2>
                    <span class="category-count">5 ideas</span>
                </div>

                <!-- Business Cards -->
                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">1</span>
                        <h3 class="card-title">Neural Market Predictor</h3>
                        <p class="card-author">Dr. Sarah Chen</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">94</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">9.2</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                AI-powered platform that analyzes 10,000+ market signals in real-time to predict price 
                                movements with 89% accuracy. Combines sentiment analysis, technical indicators, and 
                                macroeconomic data for institutional and retail investors.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">96</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">92</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">89</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">847</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">2</span>
                        <h3 class="card-title">EcoChain Network</h3>
                        <p class="card-author">James Foster</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">85</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.3</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Blockchain-based carbon credit marketplace with IoT verification. Automated sensors 
                                validate environmental impact in real-time, creating transparent and fraud-proof 
                                carbon trading for net-zero compliance.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">88</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">84</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">83</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">756</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">3</span>
                        <h3 class="card-title">AI Resume Coach</h3>
                        <p class="card-author">Lisa Anderson</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">81</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.5</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                SaaS that analyzes job postings and automatically tailors your resume to match keywords 
                                and requirements. Uses GPT to rewrite descriptions for maximum ATS compatibility.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">84</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">78</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">80</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">934</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">4</span>
                        <h3 class="card-title">SmartFarm IoT</h3>
                        <p class="card-author">Maria Santos</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">79</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.9</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Comprehensive agricultural IoT platform combining soil sensors, weather prediction, 
                                drone monitoring, and AI crop optimization. Increases yield by 35% while reducing 
                                water usage by 50%.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">86</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">74</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">77</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">678</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-maybe">MAYBE</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">5</span>
                        <h3 class="card-title">QuickLearn AI</h3>
                        <p class="card-author">Alex Thompson</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">74</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.6</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Personalized microlearning platform that adapts to each user's learning style. 
                                Delivers 5-minute lessons optimized for retention using spaced repetition and AI.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">78</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">71</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">73</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">512</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-maybe">MAYBE</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Games Column -->
            <div class="category-column">
                <div class="category-header">
                    <h2 class="category-title">
                        <span class="category-icon">🎮</span>
                        Games
                    </h2>
                    <span class="category-count">5 ideas</span>
                </div>

                <!-- Game Cards -->
                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">1</span>
                        <h3 class="card-title">Quantum Chess Arena</h3>
                        <p class="card-author">Marcus Webb</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">91</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.9</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Revolutionary chess variant where pieces exist in quantum superposition states until 
                                observed. Features simultaneous move possibilities, probability-based captures, and 
                                tournament modes with global leaderboards.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">85</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">98</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">88</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">623</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">2</span>
                        <h3 class="card-title">Neural VR Therapy</h3>
                        <p class="card-author">Dr. Lisa Park</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">83</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.8</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Immersive VR platform for treating PTSD, anxiety, and phobias through controlled 
                                exposure therapy. Features biometric monitoring, AI-adapted scenarios, and clinical 
                                integration for mental health professionals.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">79</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">89</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">81</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">567</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">3</span>
                        <h3 class="card-title">Battle Royale Chess</h3>
                        <p class="card-author">James Mitchell</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">80</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">8.1</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                100 players start on a giant chess board. Capture pieces to gain their powers. 
                                Last player standing wins. Real-time strategy meets classic chess with streaming potential.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">82</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">81</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Execution</div>
                                    <div class="detailed-score-value">77</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Votes</div>
                                    <div class="detailed-score-value">892</div>
                                </div>
                            </div>
                            <span class="verdict-badge verdict-invest">INVEST</span>
                        </div>
                    </div>
                </div>

                <div class="idea-card">
                    <div class="card-main" onclick="toggleExpand(this)">
                        <span class="card-rank">4</span>
                        <h3 class="card-title">Mind Maze VR</h3>
                        <p class="card-author">Emily Davis</p>
                        <div class="scores-grid">
                            <div class="score-item">
                                <span class="score-value">78</span>
                                <span class="score-label">AI Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">7.9</span>
                                <span class="score-label">Public</span>
                            </div>
                        </div>
                        <button class="expand-btn">View Details</button>
                    </div>
                    <div class="card-expanded">
                        <div class="expanded-content">
                            <p class="brief-text">
                                Puzzle VR game where each level is based on psychological concepts. Solve your own 
                                mind to escape. Features adaptive difficulty based on player behavior patterns.
                            </p>
                            <div class="detailed-scores">
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Market</div>
                                    <div class="detailed-score-value">75</div>
                                </div>
                                <div class="detailed-score-item">
                                    <div class="detailed-score-label">Innovation</div>
                                    <div class="detailed-score-value">83</div>
                                </div>
                                <div class="detail
