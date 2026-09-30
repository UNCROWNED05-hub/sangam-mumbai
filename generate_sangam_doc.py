import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def create_sangam_document():
    # Load base document or create new
    doc = docx.Document()
    
    # 1. Page Margins (Matching FitQuest template: 0.65" top/bottom, 0.75" left/right)
    section = doc.sections[0]
    section.top_margin = Inches(0.65)
    section.bottom_margin = Inches(0.65)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)
    
    # Base font setup
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(0x26, 0x26, 0x26)
    
    # Configure Heading 1
    if 'Heading 1' in doc.styles:
        h1 = doc.styles['Heading 1']
        h1.font.name = 'Calibri'
        h1.font.size = Pt(14)
        h1.font.bold = True
        h1.font.color.rgb = RGBColor(0x36, 0x5F, 0x91) # Exact Blue from template
        h1.paragraph_format.space_before = Pt(12)
        h1.paragraph_format.space_after = Pt(4)
        
    # Configure Heading 2
    if 'Heading 2' in doc.styles:
        h2 = doc.styles['Heading 2']
        h2.font.name = 'Calibri'
        h2.font.size = Pt(12.5)
        h2.font.bold = True
        h2.font.color.rgb = RGBColor(0x4F, 0x81, 0xBD) # Exact Secondary Blue
        h2.paragraph_format.space_before = Pt(8)
        h2.paragraph_format.space_after = Pt(2)

    # Helper function for adding styled bullet
    def add_bullet(text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.size = Pt(10.5)

    # Helper function for adding styled numbered item
    def add_num(text):
        p = doc.add_paragraph(style='List Number')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.size = Pt(10.5)

    # Helper for adding regular paragraph text
    def add_body(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.size = Pt(10.5)

    # ==================== TITLE BLOCK ====================
    # Title: SANGAM
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run_title = p_title.add_run("SANGAM")
    run_title.font.size = Pt(34)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    # Subtitle: Business Plan & Market Strategy
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    run_sub = p_sub.add_run("Business Plan & Market Strategy")
    run_sub.font.size = Pt(18)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(0x59, 0x59, 0x59)

    # Tagline: Someone near you already has a plan. Just show up.
    p_tag = doc.add_paragraph()
    p_tag.paragraph_format.space_before = Pt(0)
    p_tag.paragraph_format.space_after = Pt(2)
    run_tag = p_tag.add_run("Someone near you already has a plan. Just show up.")
    run_tag.font.size = Pt(13)
    run_tag.font.italic = True
    run_tag.font.color.rgb = RGBColor(0x26, 0x26, 0x26)

    # Category Pillars: Live Maps • Real-World Meetups • Anti-Social Platform • Zero Feeds
    p_pil = doc.add_paragraph()
    p_pil.paragraph_format.space_before = Pt(0)
    p_pil.paragraph_format.space_after = Pt(14)
    run_pil = p_pil.add_run("Live Maps • Real-World Meetups • Anti-Social Platform • Zero Feeds")
    run_pil.font.size = Pt(11)
    run_pil.font.color.rgb = RGBColor(0x7F, 0x7F, 0x7F)

    # ==================== 1. EXECUTIVE SUMMARY ====================
    doc.add_heading("1. Executive Summary", level=1)
    add_bullet("Sangam is a browser-based, map-centric social platform that connects people through spontaneous, real-world activities happening nearby today.")
    add_bullet("Replaces endless algorithmic feeds, follower metrics, and doomscrolling with a live, interactive city map.")
    add_bullet("Core promise: find verified public plans within a 10-minute walk, join in one tap, and step outside.")
    add_bullet("Primary audience: Indian college students, young working professionals, fitness/sports hobbyists, and newcomers to metropolitan cities like Mumbai.")
    add_bullet("Business direction: freemium consumer platform with venue/cafe partnerships, verified group ticketing, and corporate/college community circles.")
    add_bullet("Positioning: an accessible anti-social-media tool designed to get users off screens and into real life, not a traditional follower-based network.")

    # ==================== 2. MISSION & VISION ====================
    doc.add_heading("2. Mission & Vision", level=1)
    doc.add_heading("Mission", level=2)
    add_bullet("Combat urban loneliness and digital isolation by making real-world social interaction as frictionless as opening a map.")
    doc.add_heading("Vision", level=2)
    add_bullet("Build an India-first hyper-local platform where anyone can find or host an activity in their neighborhood in under 20 seconds.")
    doc.add_heading("Key Offerings", level=2)
    add_bullet("Live interactive city map with real-time neighborhood activity clusters")
    add_bullet("One-tap frictionless join (no friend requests, no awkward approvals)")
    add_bullet("Ephemeral group chats unlocking immediately upon joining for transparent coordination")
    add_bullet("TimeScrubber for chronological filtering (Happening Now, Tonight, Tomorrow, Weekend)")
    add_bullet("20-second plan composer with interactive crosshair pin dropping")
    add_bullet("Strict public-only verified meetup locations for maximum user safety")

    # ==================== 3. MARKET OPPORTUNITY ====================
    doc.add_heading("3. Market Opportunity", level=1)
    doc.add_heading("Target Market", level=2)
    add_bullet("College students seeking affordable, short, local study circles, sports partners, and casual hangout groups")
    add_bullet("Young professionals and migrants dealing with urban loneliness in dense Tier-1 cities")
    add_bullet("Fitness, sports, and outdoor enthusiasts needing missing players (badminton doubles, turf football, cycling)")
    add_bullet("Colleges, corporate HR wellness teams, local cafes, board game lounges, and sports complexes as institutional partners")
    doc.add_heading("Customer Pain Points", level=2)
    add_bullet("Modern social media apps increase loneliness and anxiety while pretending to connect people")
    add_bullet("Organizing plans over WhatsApp or Telegram leads to endless chatter, decision fatigue, and high flake rates")
    add_bullet("Existing event platforms (e.g., Meetup) are clunky, desktop-heavy, formal, and lack spontaneous real-time discovery")
    add_bullet("Dating and friend-finding apps (Bumble BFF) feel awkward, interview-like, and carry high social pressure")
    add_bullet("Decision fatigue: people want simple, immediate answers to 'What can I do within a 10-minute walk right now?'")
    doc.add_heading("Opportunity", level=2)
    add_bullet("While traditional social networks compete to harvest user screen time, Sangam captures the rapidly growing counter-movement toward digital detox, real-life presence, and spontaneous local community building in Indian cities.")

    # ==================== 4. PRODUCT / SERVICE OFFERING ====================
    doc.add_heading("4. Product / Service Offering", level=1)
    doc.add_heading("Core Product", level=2)
    add_bullet("A map-first responsive web application that turns physical neighborhood streets into live hubs of shared human activity.")
    doc.add_heading("Product Flow", level=2)
    add_num("Open the platform or enter the live interactive city demo")
    add_num("View live activity bubbles placed across neighborhoods (Bandra, Marine Drive, Juhu, Dadar)")
    add_num("Filter by category (Sports, Food/Coffee, Outdoors, Games, Creative, Music) or scrub time")
    add_num("Tap any plan bubble to view location, starting countdown, and confirmed attendees")
    add_num("Tap 'Join' in one click—instant group chat unlocks immediately without friend requests")
    add_num("Coordinate arrival, equipment, and meetup details in a transparent, public group room")
    add_num("Show up at the public location, meet verified people, and do the activity")
    add_num("Check in on-site to earn community trust and momentum badges")
    doc.add_heading("Key Differentiators", level=2)
    add_bullet("Live map interface instead of algorithmic vertical feeds")
    add_bullet("Spontaneous 'happening today' focus instead of events scheduled months away")
    add_bullet("Zero follower bias—every user's plan gets equal geographic visibility")
    add_bullet("Strict public-only meetup policy for verified safety")
    add_bullet("Ephemeral design: close the app in 2 minutes and go outside")
    add_bullet("Localized Indian context (cutting chai debates, seaside cycles, turf cricket, board game cafes)")

    # ==================== 5. TECHNOLOGY & R&D ====================
    doc.add_heading("5. Technology & R&D", level=1)
    doc.add_heading("Technology Stack", level=2)
    add_bullet("Frontend: modern responsive web interface (React 19 + TypeScript + Vite)")
    add_bullet("Mapping Engine: Leaflet engine with high-resolution OpenStreetMap and Esri World Canvas raster tiles (zero API key bottlenecks)")
    add_bullet("Animations: GSAP ScrollTrigger for pinned landing sequences + Framer Motion for tactile spring physics")
    add_bullet("State Management: Zustand reactive store + simulated real-time activity engine")
    add_bullet("Real-time Messaging: WebSockets / Server-Sent Events for instant group room messaging")
    add_bullet("Geocoding & Spatial Logic: GeoJSON spatial clustering and radial distance indexing")
    doc.add_heading("Location & Safety Pipeline", level=2)
    add_bullet("User pin action → Geolocation anchor lookup → Public venue verification check → Capacity reservation → Ephemeral chat channel creation → Spatial radius broadcast.")
    add_bullet("Strict anchor filtering: only approved public locations (parks, cafes, turfs, libraries) can be pinned.")
    add_bullet("Automated spam and profanity detection on plan titles and descriptions.")
    add_bullet("Privacy boundaries: zero continuous background location tracking; coordinates are only processed when creating or locating plans.")
    doc.add_heading("R&D Roadmap", level=2)
    add_bullet("Progressive Web App (PWA) with native mobile push notifications")
    add_bullet("Live public transit integration (Mumbai suburban local railway & metro arrival times)")
    add_bullet("Community trust scoring algorithms & multi-city expansion (Bengaluru, Delhi NCR, Pune)")

    # ==================== 6. BUSINESS MODEL ====================
    doc.add_heading("6. Business Model", level=1)
    doc.add_heading("Revenue Model", level=2)
    add_bullet("Freemium: unlimited browsing, joining, and hosting of public daily plans")
    add_bullet("Sangam Plus subscription: unlimited concurrent hosted circles, custom badge flair, priority map placement, and private circles")
    add_bullet("Sponsored Venue Pins: local cafes, bakeries, and sports turfs pay for highlighted map bubbles offering community perks/discounts")
    add_bullet("Ticketed Community Workshops: 5-8% platform convenience fee on paid workshops, art walks, and masterclasses")
    doc.add_heading("Pricing Strategy", level=2)
    add_bullet("Keep entry cost zero for students and everyday hobbyists to maximize local network density")
    add_bullet("Affordable ₹99-₹199/month for active community organizers and super-hosts")
    add_bullet("Value-based ₹499-₹1,499/month for verified commercial venue partners driving footfall")
    add_bullet("Let users experience the entire web platform freely before ever seeing a paid tier")
    doc.add_heading("Sales Channels", level=2)
    add_bullet("Direct web app discovery and viral word-of-mouth")
    add_bullet("College campus ambassador networks and sports club partnerships")
    add_bullet("Hyper-local cafe, roastery, and turf owner tie-ups")
    add_bullet("City lifestyle creators sharing 'Things to do in Mumbai tonight' content")

    # ==================== 7. GO-TO-MARKET / MARKETING STRATEGY ====================
    doc.add_heading("7. Go-to-Market / Marketing Strategy", level=1)
    doc.add_heading("Launch Strategy", level=2)
    add_bullet("Initial focus on dense youth and student clusters: Bandra, Marine Drive, Dadar, and Colaba")
    add_bullet("Seed initial plans with active college sports clubs, cycling groups, and board game meetups")
    add_bullet("Leverage real-time odometer counters ('3,400+ people out right now') to build instant social proof")
    add_bullet("Iterate based on real student feedback around timing, court availability, and group size")
    doc.add_heading("Digital Marketing", level=2)
    add_bullet("Short videos contrasting 'Reel scrolling on the couch' vs 'Joining badminton in 10 mins'")
    add_bullet("Anti-doomscrolling cultural messaging ('Touch grass', 'The city is outside', 'Real life > algorithms')")
    add_bullet("User-generated post-meetup photos, cutting chai moments, and community highlights")
    add_bullet("Hyper-local reels tagging specific Mumbai neighborhood hotspots")
    doc.add_heading("Campus Marketing", level=2)
    add_bullet("Student ambassadors across top colleges (St. Xavier's, NMIMS, HR, Podar, Jai Hind)")
    add_bullet("Inter-hostel sports circles and campus activity challenge weeks")
    add_bullet("Orientation week onboarding booths for outstation students relocating to Mumbai")
    add_bullet("Referral perks and free circle hosting passes")
    doc.add_heading("Partnerships", level=2)
    add_bullet("Local cafes and eateries (e.g., Subko, Blue Tokai, Pizza by the Bay) offering group discounts")
    add_bullet("Sports complexes, YMCA courts, and indoor turf facilities")
    add_bullet("Youth cultural organizations, heritage walk organizers, and amateur acoustic jam clubs")

    # ==================== 8. COMPETITIVE ANALYSIS ====================
    doc.add_heading("8. Competitive Analysis", level=1)
    doc.add_heading("Meetup.com", level=2)
    add_bullet("Known for formal, pre-planned corporate talks, paid subscriptions, and desktop-first interface.")
    add_bullet("Sangam focus: spontaneous today-only activities, youth-friendly, map-first, zero barriers.")
    doc.add_heading("Bumble BFF / Dating Platforms", level=2)
    add_bullet("Focused on 1-on-1 awkward matching, interview-style swiping, and high ghosting rates.")
    add_bullet("Sangam focus: low-pressure group activities centered around a shared hobby rather than romantic or individual evaluation.")
    doc.add_heading("WhatsApp / Telegram Groups", level=2)
    add_bullet("Chaotic notification floods, endless chatting without action, high flake rates, and zero geographic visualization.")
    add_bullet("Sangam focus: visual live map, real-time participant counts, automatic coordination chat that unlocks only when attending.")
    add_body("Competitive position: Sangam does not compete with social networks for screen attention. Its competitive moat is hyper-local spatial discovery and an anti-feed philosophy that values real-world attendance.")

    # ==================== 9. FINANCIAL PROJECTIONS ====================
    doc.add_heading("9. Financial Projections", level=1)
    doc.add_heading("Main Cost Areas", level=2)
    add_bullet("Cloud hosting, CDN, and high-concurrency WebSocket messaging infrastructure")
    add_bullet("Map tile infrastructure and spatial database maintenance")
    add_bullet("Content moderation, safety verification, and customer support")
    add_bullet("Domain, monitoring, analytics, and software services")
    add_bullet("Hyper-local campus ambassador incentives and launch marketing")
    add_bullet("Product development and continuous deployment")
    doc.add_heading("Revenue Roadmap", level=2)
    add_bullet("Year 1: establish user density in Mumbai; validate retention and venue partnership pilots")
    add_bullet("Year 2: launch Sangam Plus and scale sponsored venue pins across Mumbai, Bengaluru, and Pune")
    add_bullet("Year 3: expand to 8 Tier-1 Indian cities, introduce ticketed community events and corporate wellness circles")
    doc.add_heading("Break-Even Approach", level=2)
    add_bullet("Zero expensive AI GPU inference overhead—lightweight, highly scalable open web stack")
    add_bullet("Prioritize organic hyper-local word-of-mouth rather than high paid customer acquisition costs")
    add_bullet("Combine individual subscriptions with institutional venue sponsorship revenue")
    add_bullet("Reach break-even when recurring revenue consistently exceeds technology, operations, and marketing costs")

    # ==================== 10. FUNDING REQUIREMENTS ====================
    doc.add_heading("10. Funding Requirements", level=1)
    doc.add_heading("Use of Funds", level=2)
    add_bullet("Product engineering and native mobile app development (iOS & Android)")
    add_bullet("Community operations, venue onboarding, and safety screening")
    add_bullet("Campus ambassador programs and targeted local awareness campaigns")
    add_bullet("Infrastructure scaling, security audits, and low-latency spatial servers")
    add_bullet("Future regional language localization and tier-2 city expansion")
    doc.add_heading("Investment Logic", level=2)
    add_bullet("Capitalize on a powerful global counter-trend: Gen-Z and millennials actively seeking alternatives to passive screen feeds")
    add_bullet("Validate real user density, organic retention, college club pilots, and venue monetization")
    add_bullet("Scale infrastructure and marketing dynamically according to actual city-by-city network liquidity")

    # ==================== 11. CUSTOMER RETENTION & ENGAGEMENT ====================
    doc.add_heading("11. Customer Retention & Gamification", level=1)
    doc.add_heading("Trust & Reputation Badges", level=2)
    add_bullet("Verified attendee badges, Reliable Host status, and punctuality ratings")
    add_bullet("Starter → Regular → Trusted Host → Community Anchor")
    doc.add_heading("Daily & Weekly Circles", level=2)
    add_bullet("Recurring morning cycles on Marine Drive, sunset music jams, weekend chess clubs")
    add_bullet("Seasonal city challenges (Monsoon Trek circles, Kala Ghoda art walks, Bandra run clubs)")
    add_bullet("Return after a quiet week encouragement")
    doc.add_heading("Flexible Motivation", level=2)
    add_bullet("No guilt-based streaks—the platform applauds spontaneous attendance whenever free")
    add_bullet("Recognition for welcoming first-time attendees to a circle")
    add_bullet("Positive community feedback loop after each completed meetup")
    add_bullet("Instant photo memory drop inside the completed circle chat")

    # ==================== 12. AI & LOCATION INTELLIGENCE ENGINE ====================
    doc.add_heading("12. AI & Location Intelligence Engine", level=1)
    add_bullet("Smart neighborhood clustering that groups nearby activities when zoomed out (<11.5 zoom)")
    add_bullet("Contextual recommendations based on time of day, current weather, and user proximity")
    add_bullet("Automated safety checks: flags inappropriate wording, enforces public-venue boundaries")
    add_bullet("Real-time transit buffer: calculates realistic walking times to ensure timely arrivals")
    add_bullet("Does not harvest personal user data for behavioral advertising; coordinates are strictly ephemeral")
    add_bullet("Uses rule-based safety filters, restricted venue coordinates, and fallback moderation")

    # ==================== 13. RISKS & MITIGATION ====================
    doc.add_heading("13. Risks & Mitigation", level=1)
    add_bullet("Safety & Stranger Danger → Strict public-only meetup policy; verified photo profiles; transparent group chats with zero anonymous private DMs.")
    add_bullet("Flaking / No-Shows → Real-time countdowns ('Starts in 15m'); capped participant counts; one-click check-in at the venue.")
    add_bullet("Cold Start in New Areas → Anchor-first strategy focusing on 5 prime youth sectors; venue-hosted daily circles guaranteeing active plans.")
    add_bullet("Weather & Monsoons → Dynamic indoor/outdoor venue filtering (e.g., badminton indoor courts vs outdoor promenade walks).")
    add_bullet("Content Quality → Host reputation tracking, automated filtering, and one-tap community reporting for inappropriate circles.")
    add_bullet("Privacy Concerns → Zero background location tracking; platform only reads location during active plan search or hosting.")

    # ==================== 14. MILESTONES & FUTURE GROWTH ====================
    doc.add_heading("14. Milestones & Future Growth", level=1)
    add_bullet("MVP (Current): interactive Mumbai map, live plan bubbles, 1-tap join, live group chat, time scrubber, tactile UI, and responsive demo")
    add_bullet("Near-term: native mobile applications, user profiles with hobby tags, and initial cafe partnership pilot in Bandra")
    add_bullet("Medium-term: expansion across Mumbai MMR (Navi Mumbai, Thane), ticketed community workshops, and verified college networks")
    add_bullet("Long-term: pan-India presence across top student cities (Bengaluru, Pune, Delhi NCR, Hyderabad) and international urban hubs")

    # ==================== 15. ONE-LINE BUSINESS PITCH ====================
    doc.add_heading("15. One-Line Business Pitch", level=1)
    add_body("Sangam is a live map-centric platform that gets people off screens and into real life by connecting them to spontaneous, public activities happening in their city today—with zero feeds, zero followers, and zero algorithms.")

    # Save the output file
    output_filename = "Sangam_Business_Plan_PS.docx"
    doc.save(output_filename)
    print(f"Successfully generated {output_filename} with {len(doc.paragraphs)} paragraphs.")

if __name__ == "__main__":
    create_sangam_document()
