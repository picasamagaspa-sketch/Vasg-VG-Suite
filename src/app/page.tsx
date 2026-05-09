'use client';

import { useState, useEffect } from 'react';
import { useProUpgrade } from '@/lib/useProUpgrade';
import UpgradeModal from '@/components/UpgradeModal';
import UsageCounter from '@/components/UsageCounter';

type NicheType = 'tech' | 'fitness' | 'beauty' | 'lifestyle' | 'business' | 'gaming' | 'comedy' | 'education';
type ContentType = 'hook' | 'caption' | 'script' | 'thumbnail' | 'planner' | 'faceCreator';

const niches: { id: NicheType; label: string; emoji: string }[] = [
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'lifestyle', label: 'Lifestyle', emoji: '✨' },
  { id: 'business', label: 'Business', emoji: '📊' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'comedy', label: 'Comedy', emoji: '😂' },
  { id: 'education', label: 'Education', emoji: '📚' },
];

const contentPrompts = {
  hook: {
    tech: 'Generate a scroll-stopping hook about the latest AI or tech trend that hooks viewers in 3 seconds',
    fitness: 'Create a viral hook about a surprising fitness transformation or workout hack',
    beauty: 'Generate a beauty hook about a trending skincare routine or makeup technique',
    lifestyle: 'Create a lifestyle hook about daily routines or self-improvement habits',
    business: 'Generate a business hook about entrepreneurship or productivity hacks',
    gaming: 'Create a gaming hook about an epic moment or gaming strategy',
    comedy: 'Generate a comedy hook about a funny observation or relatable situation',
    education: 'Create an educational hook about learning a new skill quickly',
  },
  caption: {
    tech: 'Write a compelling tech caption that encourages shares and saves',
    fitness: 'Create an engaging fitness caption with call-to-action',
    beauty: 'Write a beauty caption that drives comments and engagement',
    lifestyle: 'Create a lifestyle caption with personality and relatability',
    business: 'Write a business caption that inspires action',
    gaming: 'Create a gaming caption that hypes the community',
    comedy: 'Write a comedy caption that extends the joke',
    education: 'Create an educational caption that adds value',
  },
  script: {
    tech: 'Write a short TikTok/Reel script about a tech demo or concept (20-30 seconds)',
    fitness: 'Create a fitness transformation script for a short-form video',
    beauty: 'Write a beauty tutorial script (30 seconds)',
    lifestyle: 'Create a lifestyle vlog script (20-30 seconds)',
    business: 'Write a motivational business script',
    gaming: 'Create a gaming highlight script',
    comedy: 'Write a comedy sketch script',
    education: 'Create an educational explainer script',
  },
  thumbnail: {
    tech: 'Suggest 3 eye-catching thumbnail title ideas for a tech video',
    fitness: 'Suggest 3 high-CTR thumbnail titles for a fitness video',
    beauty: 'Suggest 3 compelling thumbnail titles for a beauty video',
    lifestyle: 'Suggest 3 engaging thumbnail titles for a lifestyle video',
    business: 'Suggest 3 conversion-focused thumbnail titles',
    gaming: 'Suggest 3 hype-building thumbnail titles',
    comedy: 'Suggest 3 funny thumbnail titles',
    education: 'Suggest 3 curiosity-driven thumbnail titles',
  },
  planner: {
    tech: 'Create a 30-day tech content plan with posting schedule, trending topics, and engagement strategy',
    fitness: 'Generate a 30-day fitness content calendar with workout transformations, tips, and challenges',
    beauty: 'Create a 30-day beauty content plan with skincare routines, makeup tutorials, and trend ideas',
    lifestyle: 'Generate a 30-day lifestyle content calendar with daily routines, habits, and self-improvement content',
    business: 'Create a 30-day business content plan with entrepreneur tips, case studies, and growth hacks',
    gaming: 'Generate a 30-day gaming content calendar with game releases, highlights, and streaming strategy',
    comedy: 'Create a 30-day comedy content plan with joke themes, collaboration ideas, and trend opportunities',
    education: 'Generate a 30-day educational content calendar with learning topics, tutorials, and skill-building series',
  },
  faceCreator: {
    tech: 'Generate 5 AI-powered tech expert personas perfect for tech content with unique angles and styles',
    fitness: 'Create 5 diverse fitness coach personas with different specialties and engagement styles',
    beauty: 'Generate 5 beauty influencer personas with distinct makeup/skincare philosophies and aesthetics',
    lifestyle: 'Create 5 lifestyle creator personas with unique daily routines and content angles',
    business: 'Generate 5 entrepreneur personas with different business styles and expertise areas',
    gaming: 'Create 5 gaming streamer personas with unique personalities and gaming specialties',
    comedy: 'Generate 5 comedy creator personas with different humor styles and comedic angles',
    education: 'Create 5 educator personas with unique teaching styles and subject specialties',
  },
};

interface GeneratedContent {
  type: ContentType;
  niche: NicheType;
  content: string;
  loading: boolean;
  timestamp: number;
}

export default function Home() {
  const [niche, setNiche] = useState<NicheType>('tech');
  const [contentType, setContentType] = useState<ContentType>('hook');
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [userInput, setUserInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [userId] = useState('demo-user');

  const {
    isLimitExceeded,
    remainingGenerations,
    remainingDailyAccess,
    isPro,
    recordUsage,
    showUpgradeModal,
    closeUpgradeModal,
  } = useProUpgrade(userId);

  const handleGenerate = async () => {
    if (!isPro && isLimitExceeded) {
      return;
    }

    setGenerating(true);
    await recordUsage('generation');

    // Simulate API call
    setTimeout(() => {
      const mockContent: Record<ContentType, Record<NicheType, string>> = {
        hook: {
          tech: '🤖 Wait until you see what happens when you combine AI with productivity...',
          fitness: '💪 This one exercise changed EVERYTHING in 30 days...',
          beauty: '✨ Dermatologists hate this one skincare secret...',
          lifestyle: '🌅 The morning routine that guarantees 10x better days...',
          business: '📈 How a $0 investment turned into $100k revenue...',
          gaming: "🎮 You won't believe this glitch just saved my rank...",
          comedy: '😂 Why do people do this? It makes absolutely no sense...',
          education: '📚 Nobody teaches this in school but they should...',
        },
        caption: {
          tech: 'Which one are you using? 👀 Drop a comment 💬',
          fitness: 'Tag someone you want to go through this with 💪',
          beauty: 'Save this for later! 📌 Who needs this?',
          lifestyle: 'Would you try this tomorrow? Let me know! 👇',
          business: 'This changed my business forever. You?',
          gaming: 'This needs to be nerfed ASAP 😅',
          comedy: 'I felt this in my soul 💀',
          education: 'Share this with someone who needs to learn this',
        },
        script: {
          tech: "[0s] 'I just discovered an AI tool that...' [5s] Show use case [10s] 'Here's the crazy part...' [15s] Results demo [20s] Call to action",
          fitness: '[0s] "Everyone does this wrong" [5s] Show common mistake [8s] Correct form [15s] Results/benefits [25s] "Try this tomorrow"',
          beauty: '[0s] Close-up of product [5s] "This changed my skin" [10s] Application demo [15s] Before/after [20s] "Link in bio"',
          lifestyle: '[0s] Morning shot [5s] First habit [10s] Second habit [15s] Third habit [20s] "Your turn!"',
          business: '[0s] Hook statement [5s] Problem [10s] Solution overview [15s] Key benefit [20s] Call to action',
          gaming: "[0s] Gameplay [3s] 'Did you see that?!' [8s] Replay in slow-mo [15s] 'That's insane' [20s] Next clip",
          comedy: '[0s] Setup [3s] Build tension [8s] Punchline [12s] Reaction [18s] Outro joke',
          education: '[0s] Intro question [5s] Lesson starts [10s] Key concept 1 [15s] Key concept 2 [20s] Summary + CTA',
        },
        thumbnail: {
          tech: '1. "AI SHOCKED ME" 2. "INSANE TECH HACK" 3. "THIS SHOULD NOT EXIST"',
          fitness: '1. "7 DAY TRANSFORMATION" 2. "THIS MUSCLE HACK WORKS" 3. "LEAN IN 30 DAYS"',
          beauty: '1. "GLOWING SKIN HACK" 2. "DERMATOLOGIST REVEALS" 3. "CLEAR SKIN IN DAYS"',
          lifestyle: '1. "MORNING ROUTINE GENIUS" 2. "CHANGE YOUR LIFE NOW" 3. "THIS WORKS 100%"',
          business: '1. "$0 to $100K PROOF" 2. "BUSINESS SECRETS" 3. "THIS ACTUALLY WORKS"',
          gaming: '1. "RANK UP FAST" 2. "PRO REVEALED THIS" 3. "BANNED FOR THIS HACK"',
          comedy: '1. "I DIED 💀" 2. "THIS IS HILARIOUS" 3. "SO RELATABLE"',
          education: '1. "LEARN IN 5 MIN" 2. "TEACHERS HATE THIS" 3. "FINALLY EXPLAINED"',
        },
        planner: {
          tech: '📅 Week 1: Mon - AI productivity hack, Wed - Coding tutorial, Fri - Tech review. Week 2: Mon - App showcase, Wed - Future predictions, Fri - Developer tips. Week 3: Mon - Tool comparison, Wed - Industry news, Fri - Career advice. Week 4: Mon - Project showcase, Wed - Learning resources, Fri - Community spotlight.',
          fitness: '📅 Week 1: Mon - Workout routine, Wed - Nutrition guide, Fri - Progress update. Week 2: Mon - Home exercises, Wed - Motivation tips, Fri - Success story. Week 3: Mon - Advanced techniques, Wed - Recovery methods, Fri - Goal setting. Week 4: Mon - Equipment reviews, Wed - Healthy recipes, Fri - Community challenge.',
          beauty: '📅 Week 1: Mon - Skincare routine, Wed - Makeup tutorial, Fri - Product review. Week 2: Mon - Hair care tips, Wed - Self-care day, Fri - Beauty hacks. Week 3: Mon - Trend analysis, Wed - DIY treatments, Fri - Expert interviews. Week 4: Mon - Seasonal looks, Wed - Wellness focus, Fri - Community Q&A.',
          lifestyle: '📅 Week 1: Mon - Morning routine, Wed - Productivity hacks, Fri - Weekend plans. Week 2: Mon - Home organization, Wed - Hobby exploration, Fri - Social connections. Week 3: Mon - Financial tips, Wed - Travel ideas, Fri - Relationship advice. Week 4: Mon - Personal growth, Wed - Creative projects, Fri - Reflection time.',
          business: '📅 Week 1: Mon - Business strategy, Wed - Marketing tips, Fri - Sales techniques. Week 2: Mon - Leadership skills, Wed - Networking events, Fri - Financial planning. Week 3: Mon - Innovation ideas, Wed - Team building, Fri - Customer success. Week 4: Mon - Industry trends, Wed - Personal branding, Fri - Growth mindset.',
          gaming: '📅 Week 1: Mon - Game reviews, Wed - Strategy guides, Fri - Tournament highlights. Week 2: Mon - Character builds, Wed - Esports news, Fri - Community events. Week 3: Mon - Mod showcases, Wed - Achievement hunts, Fri - Developer interviews. Week 4: Mon - Gaming setup, Wed - Skill improvement, Fri - Future releases.',
          comedy: '📅 Week 1: Mon - Joke of the day, Wed - Improv tips, Fri - Comedy clips. Week 2: Mon - Stand-up stories, Wed - Meme creation, Fri - Funny observations. Week 3: Mon - Character sketches, Wed - Timing practice, Fri - Audience interaction. Week 4: Mon - Comedy writing, Wed - Performance prep, Fri - Community laughs.',
          education: '📅 Week 1: Mon - Study techniques, Wed - Subject breakdown, Fri - Quiz time. Week 2: Mon - Learning resources, Wed - Skill development, Fri - Knowledge sharing. Week 3: Mon - Career guidance, Wed - Research methods, Fri - Teaching tips. Week 4: Mon - Future trends, Wed - Personal projects, Fri - Community learning.',
        },
        faceCreator: {
          tech: '👤 Tech Innovator Alex: 5+ years in AI/ML, specializes in productivity tools. Content focuses on emerging tech, coding tutorials, and developer insights. Personality: Curious problem-solver with a passion for democratizing technology.',
          fitness: '👤 Fitness Coach Maya: Certified trainer with 8 years experience, specializes in strength training and nutrition. Content focuses on workout routines, healthy eating, and motivation. Personality: Energetic and encouraging, believes fitness is for everyone.',
          beauty: '👤 Beauty Expert Sarah: Licensed esthetician with 6 years in skincare and makeup. Content focuses on product reviews, tutorials, and self-care routines. Personality: Approachable and knowledgeable, loves helping others feel confident.',
          lifestyle: '👤 Life Coach Jordan: Mindfulness practitioner with experience in personal development. Content focuses on daily habits, productivity, and work-life balance. Personality: Empathetic and insightful, helps others create meaningful lives.',
          business: '👤 Entrepreneur Marcus: Serial entrepreneur with multiple successful exits. Content focuses on business strategy, marketing, and leadership. Personality: Strategic and ambitious, passionate about helping others build successful ventures.',
          gaming: '👤 Gaming Pro Riley: Competitive gamer with esports experience across multiple titles. Content focuses on strategy guides, game reviews, and skill improvement. Personality: Competitive yet approachable, loves sharing gaming knowledge.',
          comedy: '👤 Comedian Jamie: Stand-up comedian with 4 years of stage experience. Content focuses on observational humor, funny stories, and comedy techniques. Personality: Witty and relatable, finds humor in everyday situations.',
          education: '👤 Educator Dr. Taylor: PhD in educational psychology with 10+ years teaching. Content focuses on learning methods, study skills, and academic success. Personality: Patient and encouraging, dedicated to making education accessible.',
        },
      };

      const content = mockContent[contentType][niche] || 'Generated content will appear here';

      setGenerated({
        type: contentType,
        niche,
        content,
        loading: false,
        timestamp: Date.now(),
      });
      setGenerating(false);
    }, 800);
  };

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">VASG-VG AI SUITE</span>
          <h1>Generate viral content for your niche instantly.</h1>
          <p>Pick your niche, choose your content type, and let AI craft hooks, captions, scripts, and thumbnails optimized for maximum engagement.</p>
        </div>
        <div className="hero-visual">
          <div className="usage-info">
            {!isPro && (
              <UsageCounter
                remaining={remainingDailyAccess}
                limit={2}
                label="Daily uses"
              />
            )}
            {isPro && (
              <div className="usage-counter">
                <span>🚀 PRO MEMBER</span>
                <strong>Unlimited</strong>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="generator-section">
        <div className="generator-container">
          <div className="generator-panel">
            <div className="section-heading">
              <span className="section-label">Select Your Niche</span>
              <h2>Choose your content category</h2>
            </div>

            <div className="niche-grid">
              {niches.map((n) => (
                <button
                  key={n.id}
                  className={`niche-card ${niche === n.id ? 'active' : ''}`}
                  onClick={() => setNiche(n.id)}
                >
                  <span className="niche-emoji">{n.emoji}</span>
                  <span className="niche-label">{n.label}</span>
                </button>
              ))}
            </div>

            <div className="section-heading" style={{ marginTop: '32px' }}>
              <span className="section-label">Content Type</span>
              <h2>What do you want to generate?</h2>
            </div>

            <div className="content-grid">
              {(['hook', 'caption', 'script', 'thumbnail', 'planner', 'faceCreator'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  className={`content-card ${contentType === type ? 'active' : ''}`}
                  onClick={() => setContentType(type)}
                >
                  <div className="content-icon">
                    {type === 'hook' && '🎣'}
                    {type === 'caption' && '💬'}
                    {type === 'script' && '🎬'}
                    {type === 'thumbnail' && '🖼️'}
                    {type === 'planner' && '📅'}
                    {type === 'faceCreator' && '👤'}
                  </div>
                  <span>
                    {type === 'faceCreator' ? 'Face Creator' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            <div className="input-section">
              <label>Optional: Add your specific idea or topic</label>
              <textarea
                placeholder="E.g., 'about my new product launch' or 'fitness journey update'"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="content-input"
              />
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleGenerate}
              disabled={generating || (!isPro && isLimitExceeded)}
              style={{ width: '100%' }}
            >
              {generating ? 'Generating... ✨' : '✨ Generate Content'}
            </button>
          </div>

          <div className="output-panel">
            {generated ? (
              <div className="generated-output">
                <div className="output-header">
                  <div>
                    <span className="output-badge">Generated</span>
                    <h3>
                      {contentType === 'hook' && '🎣 Your Hook'}
                      {contentType === 'caption' && '💬 Your Caption'}
                      {contentType === 'script' && '🎬 Your Script'}
                      {contentType === 'thumbnail' && '🖼️ Thumbnail Ideas'}
                      {contentType === 'planner' && '📅 Content Plan'}
                      {contentType === 'faceCreator' && '👤 Creator Personas'}
                    </h3>
                    <p className="output-subtitle">{niche.toUpperCase()} niche</p>
                  </div>
                  <button className="copy-btn" onClick={() => {
                    navigator.clipboard.writeText(generated.content);
                  }}>
                    📋 Copy
                  </button>
                </div>
                <div className="output-content">
                  <p>{generated.content}</p>
                </div>
                <div className="output-actions">
                  <button className="btn btn-ghost" onClick={() => setGenerated(null)}>
                    ← Generate Another
                  </button>
                  <button className="btn btn-secondary" onClick={handleGenerate}>
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <h3>Your AI creation awaits</h3>
                <p>Select a niche and content type, then hit generate to create viral-ready content tailored to your audience.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {!isPro && (
        <section className="upgrade-card-section">
          <div className="upgrade-card-container">
            <div className="upgrade-card">
              <div className="upgrade-header">
                <span className="upgrade-badge">🚀 UNLOCK PRO</span>
                <h2>Get Unlimited Generations</h2>
                <p>Stop worrying about daily limits. Upgrade to Pro for unlimited content creation.</p>
              </div>

              <div className="upgrade-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">♾️</span>
                  <div>
                    <strong>Unlimited Daily Access</strong>
                    <p>Use the app as much as you want</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <div>
                    <strong>Unlimited Generations</strong>
                    <p>Create unlimited hooks, captions, scripts</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎯</span>
                  <div>
                    <strong>Priority Support</strong>
                    <p>Get help from our expert team</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📊</span>
                  <div>
                    <strong>Advanced Analytics</strong>
                    <p>Track performance of generated content</p>
                  </div>
                </div>
              </div>

              <div className="upgrade-pricing">
                <div className="price-display">
                  <span className="currency">$</span>
                  <span className="amount">29</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-note">Cancel anytime, no commitment</p>
              </div>

              <button className="btn btn-primary btn-large" onClick={() => window.location.href = '/checkout'}>
                Upgrade to Pro Now
              </button>
            </div>

            <div className="upgrade-side-info">
              <div className="info-item">
                <span className="check-mark">✓</span>
                <div>
                  <strong>Used by 10K+ creators</strong>
                  <p>Join creators who saved 100+ hours with VASG-VG</p>
                </div>
              </div>
              <div className="info-item">
                <span className="check-mark">✓</span>
                <div>
                  <strong>Money-back guarantee</strong>
                  <p>Try risk-free for 7 days</p>
                </div>
              </div>
              <div className="info-item">
                <span className="check-mark">✓</span>
                <div>
                  <strong>Lightning fast generation</strong>
                  <p>Get content in seconds, not minutes</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        remainingGenerations={remainingGenerations}
        remainingDailyAccess={remainingDailyAccess}
        monthlyPrice="$29.99"
      />

      <footer className="footer-panel">
        <p>VASG-VG AI Suite | Create. Automate. Connect. Grow.</p>
      </footer>
    </div>
  );
}
