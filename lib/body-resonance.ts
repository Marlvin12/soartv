export interface BodyArea {
  label: string;
  emoji: string;
  resonance: {
    core: string;
    interpretation: string[];
    reorientation: string;
  };
  nervous_system: {
    /** Short autonomic state label */
    state: string;
    /** Full polyvagal / somatic explanation */
    description: string;
  };
  movies: string[];
  food: string[];
  brand_map: Record<string, string>;
  soartv_tags: string[];
  /** Exact body-part/location words — very high match weight */
  bodySignals: string[];
  /** Thematic / feeling keywords — standard match weight */
  keywords: string[];
  /** Somatic pattern this area maps to */
  somatic_pattern: string;
}

export interface SomaticPattern {
  name: string;
  subtitle: string;
  description: string;
  emoji: string;
}

export const SOMATIC_PATTERNS: Record<string, SomaticPattern> = {
  Activation: {
    name: "Activation Pattern",
    emoji: "⚡",
    subtitle: "Something needs to be resolved",
    description: "Head / jaw / ribs / shoulders firing together — the body is preparing for something it hasn't acted on yet.",
  },
  Processing: {
    name: "Processing Pattern",
    emoji: "🌊",
    subtitle: "System shifting from thinking to feeling",
    description: "Energy moving downward — head → chest → stomach. The body is integrating what the mind has been holding.",
  },
  Discharge: {
    name: "Discharge Pattern",
    emoji: "🔓",
    subtitle: "Energy releasing instead of being acted out",
    description: "Shaking, twitching, or movement sensations — stored motor patterns completing their cycle.",
  },
  Integration: {
    name: "Integration Pattern",
    emoji: "🫧",
    subtitle: "Old identity or attachment dissolving",
    description: "Sadness, heaviness, or stillness — not collapse. Something is reorganizing at a deep level.",
  },
  Stabilization: {
    name: "Stabilization Pattern",
    emoji: "🌿",
    subtitle: "Loop completed, no action required",
    description: "Peace or neutrality — the system has finished processing and is returning to baseline.",
  },
};

export const BODY_RESONANCE: Record<string, BodyArea> = {
  chest: {
    label: "Chest",
    emoji: "🫀",
    resonance: {
      core: "expansion meets protection at the same time",
      interpretation: [
        "Something in you is opening, but your system is treating it like exposure.",
        "There's growth happening, but protection arrives at the same time.",
      ],
      reorientation: "Stay with openness without collapsing it.",
    },
    nervous_system: {
      state: "Sympathetic–Ventral Vagal boundary",
      description: "Your chest is where your nervous system decides whether it's safe to open up. When something real is happening, it pulls in two directions at once — toward openness and toward protection. Breathing a little deeper into the lower ribs sends a signal to your nervous system that opening up this time won't hurt you.",
    },
    movies: ["Rocky", "Black Panther", "The Pursuit of Happyness"],
    food: ["warm meals", "carbs", "grounding comfort foods"],
    brand_map: {
      Nike: "expansion under pressure",
      Headspace: "nervous system stabilization",
      Apple: "identity transition and integration",
    },
    soartv_tags: ["growth", "pressure", "becoming", "breakthrough"],
    somatic_pattern: "Processing",
    bodySignals: [
      "chest", "lungs", "breath", "breathing", "sternum", "ribcage", "inhale", "exhale",
      "chest pain", "chest ache", "chest pressure", "tight chest", "chest tension",
      "chest tightness", "pressure in my chest", "constriction", "shortness of breath",
      "hard to breathe", "can't breathe", "chest feels heavy", "heavy chest",
      "upper chest", "upper chest tight", "upper chest tightness", "faint tightness in my chest",
      "deep tightness", "long-held tightness", "top of ribs", "top of my ribs",
      "lower ribs", "lower rib", "right side ribs", "rib ache", "ribs ache",
      "tight band around ribs", "band around my ribs", "rib band", "ribs front to back",
      "front to back tightness", "rib tension", "rib tightness", "ribs feel tight",
    ],
    keywords: [
      "open", "opening", "expand", "expanding", "expansion", "vulnerable", "exposed",
      "growing", "becoming", "brave", "breakthrough", "constricted",
      "heart open", "wide open", "unprotected", "tender", "soft",
      "something opening", "opening up", "cracking open", "puffed up",
      "squeezing", "compression", "compressed", "suffocating", "holding my breath",
      "emotional protection", "long-held protection", "hypervigilance", "bracing",
      "anticipating what's next", "waiting", "life force", "fear-based", "containment",
      "vulnerability accessed", "not reacted", "scanning forward",
    ],
  },

  shoulders: {
    label: "Shoulders",
    emoji: "🏋️",
    resonance: {
      core: "pre-loading responsibility",
      interpretation: [
        "You're carrying weight before it arrives.",
        "The system is bracing for imagined demand.",
      ],
      reorientation: "Let reality arrive before you carry it.",
    },
    nervous_system: {
      state: "Chronic sympathetic activation — fight-freeze hybrid",
      description: "The moment your nervous system senses a threat — even an imagined one — your shoulders load up and get ready. When the threat is abstract or ongoing, that load never gets to come down. Slow rolls and deep exhales aren't just stretches — they help your body complete the stress cycle it started and never got to finish.",
    },
    movies: ["The Martian", "Iron Man", "Moneyball"],
    food: ["protein-rich meals", "steady energy foods"],
    brand_map: {
      "Under Armour": "discipline under pressure",
      Amazon: "systems holding complexity",
    },
    soartv_tags: ["responsibility", "pressure", "performance"],
    somatic_pattern: "Activation",
    bodySignals: [
      "shoulders", "shoulder", "neck", "traps", "trapezius",
      "shoulder pain", "neck pain", "shoulder ache", "neck ache", "sore shoulders",
      "sore neck", "shoulder soreness", "stiff neck", "stiff shoulders",
      "knot in my shoulder", "knots in my shoulders", "tight shoulders", "tight neck",
      "neck tension", "shoulder tension",
      "top of my shoulders", "both shoulders",
      "right side neck", "right neck", "neck to shoulder", "neck and shoulder",
      "neck shoulder line", "right side tightness", "shifting shoulder pain",
      "pain shifting", "pain moving from left to right", "pain moving shoulders",
      "load on my shoulders",
    ],
    keywords: [
      "heavy", "weight", "burden", "carry", "carrying", "too much", "overwhelmed",
      "responsible", "responsibility", "tense", "tension", "stressed",
      "pressure", "holding it all", "exhausted", "bracing",
      "anticipating", "dreading", "worried", "obligations",
      "demands", "expectations", "loaded", "stiff", "knots", "aching",
      "execution pressure", "external responsibility", "managing outcomes",
      "visibility", "performance load", "expectation load", "redistribution",
      "rebalancing", "system-wide", "load shifting", "identity shift",
    ],
  },

  head: {
    label: "Mind / Head",
    emoji: "🧠",
    resonance: {
      core: "perception exceeding current reality",
      interpretation: [
        "Your mind is running simulations beyond what's actually happening.",
        "You sense things others haven't noticed yet — but the gap can feel isolating.",
      ],
      reorientation: "Trust the signal. Let the pattern speak slowly.",
    },
    nervous_system: {
      state: "Dorsal vagal dissociation / sympathetic top-loading",
      description: "When the body doesn't feel fully safe, it sends everything upward into thinking as a way to stay in control. The more the mind races, the more disconnected you feel from your body below — watching from a distance, struggling to feel anything below the neck. Feet flat on the floor, jaw soft, weight in the chair — these bring the signal back down to where it can actually settle.",
    },
    movies: ["The Matrix", "Inception"],
    food: ["brain-supporting foods", "omega-rich meals", "green tea"],
    brand_map: {
      Apple: "clarity through design",
      Tesla: "vision materializing ahead of its time",
      Meta: "perception reconstructed at scale",
    },
    soartv_tags: ["awareness", "questioning", "intelligence", "awakening"],
    somatic_pattern: "Activation",
    bodySignals: [
      "head", "mind", "brain", "thoughts", "skull", "forehead", "temple", "cognitive", "mental",
      "headache", "migraine", "head pain", "head hurts", "my head hurts", "head is pounding",
      "throbbing head", "pounding headache", "tension headache", "pressure in my head",
      "temples throbbing", "jaw", "jaw tension", "jaw clenching", "clenching my jaw",
      "grinding teeth", "teeth grinding", "brain fog", "foggy", "fog",
      "crown", "crown of my head", "crown of head", "top of my head", "top of head",
      "crown pressure", "crown tightness", "pressure on top of head",
      "full head", "band around my head", "band around head", "head band",
      "head feels like a band", "tight band around my head", "global head pressure",
      "back of my head", "back of head", "back of skull", "left side of head",
      "right side of head", "side of head", "temple pressure", "temple tightness",
      "jaw left", "jaw right", "jaw side", "side of jaw", "side of face",
      "face tension", "face tight",
    ],
    keywords: [
      "thinking", "overthinking", "confused", "clarity", "racing mind",
      "awake", "awareness", "questioning", "reality", "perception",
      "simulation", "noise", "spiraling", "can't stop thinking",
      "understand", "pattern", "see things", "isolating",
      "alone in it", "no one sees", "waking up", "conscious", "realizing",
      "noise in my head", "mind won't stop", "my thoughts", "thought loops",
      "cloudy", "fuzzy", "dissociated", "disconnected", "numb", "blank",
      "throbbing", "pounding", "pressure",
      "cognitive load", "holding too much", "too many streams", "multiple threads",
      "organizing", "stabilizing", "integration effort", "control effort",
      "monitoring", "background vigilance", "residual vigilance", "subconscious",
      "held expression", "restraint", "not expressed", "relational monitoring",
    ],
  },

  heart: {
    label: "Heart",
    emoji: "❤️",
    resonance: {
      core: "courage held in tension with authenticity",
      interpretation: [
        "You feel the pull between showing up fully and staying safe.",
        "The heart knows the right move — the body is just deciding whether it's worth the risk.",
      ],
      reorientation: "Authenticity isn't reckless. It's the most precise thing you have.",
    },
    nervous_system: {
      state: "Ventral vagal activation under sympathetic co-regulation",
      description: "Your heart is where two things run at once — part of you wants to fully show up and be seen, and part of you is on guard because being seen has felt risky before. Both the reaching toward connection and the protecting yourself are trying to help you. Your heart already knows what it wants. Your nervous system is just still checking whether it's safe.",
    },
    movies: ["Mulan", "Wonder Woman", "Hidden Figures"],
    food: ["nourishing home meals", "tea rituals", "fresh whole foods"],
    brand_map: {
      Patagonia: "values lived, not performed",
      REI: "integrity in action",
      Nike: "courage as a daily practice",
    },
    soartv_tags: ["courage", "authenticity", "integrity", "vulnerability"],
    somatic_pattern: "Integration",
    bodySignals: [
      "heart", "heartbeat", "pulse", "heart area", "left side", "cardiac",
      "heavy heart", "heart feels heavy", "heartache", "heart ache",
      "heart is heavy", "aching heart", "broken heart", "heartbroken",
      "heart racing", "racing heart", "heart pounding",
    ],
    keywords: [
      "authentic", "authenticity", "true self", "genuine", "honest",
      "courage", "courageous", "vulnerability", "vulnerable", "show up",
      "showing up", "fear", "love", "integrity", "values", "conflicted",
      "torn", "feel deeply", "care too much",
      "don't fit", "not myself", "be myself", "hide", "hiding", "safe vs real",
      "broken", "grief", "grieving", "longing", "ache", "aching",
      "letting go", "old attachments", "old identity", "letting go of who I was",
      "identity dissolving", "integration emotion", "sadness that isn't bad",
    ],
  },

  solar_plexus: {
    label: "Solar Plexus",
    emoji: "⚡",
    resonance: {
      core: "instinct compressed into composure",
      interpretation: [
        "You operate with more precision than you let others see.",
        "Control is your intelligence — not your limitation.",
      ],
      reorientation: "Let instinct lead. Composure will follow.",
    },
    nervous_system: {
      state: "Enteric nervous system — gut-brain axis under conscious override",
      description: "Your gut has its own nervous system — millions of neurons picking up information and sending it upward before your conscious mind catches up. When instinct gets compressed into composure, your gut sent a clear signal and your head overrode it. Pause and ask yourself what you already knew before you talked yourself out of it.",
    },
    movies: ["James Bond", "Mission Impossible", "The Bourne Identity"],
    food: ["fine dining", "high-protein performance meals", "balanced cocktails"],
    brand_map: {
      "Hugo Boss": "mastery expressed through elegance",
      Omega: "precision as identity",
      "Aston Martin": "power held with restraint",
    },
    soartv_tags: ["mastery", "control", "instinct", "precision"],
    somatic_pattern: "Activation",
    bodySignals: [
      "gut", "stomach", "belly", "abdomen", "solar plexus", "navel", "core", "diaphragm",
      "stomach pain", "gut pain", "belly pain", "stomach ache", "stomachache",
      "nausea", "nauseous", "feeling sick", "sick to my stomach",
      "knot in my stomach", "butterflies in my stomach", "butterflies",
      "stomach turning", "gut twisting", "stomach cramps", "stomach is tight",
      "queasy", "unsettled stomach", "stomach tension", "gut tension",
      "upper stomach", "upper stomach sadness", "upper stomach ache", "upper belly",
      "sadness in my stomach", "ache in my upper stomach", "stomach sadness",
      "lower stomach", "lower stomach buzz", "lower belly", "lower abdomen",
      "buzz in my lower stomach", "dull ache lower stomach", "lower stomach dull ache",
      "identity in my stomach", "chest to stomach", "chest stomach pull",
      "chest pulling to stomach", "heart to stomach", "gut connection",
    ],
    keywords: [
      "control", "controlled", "sharp", "precise", "precision", "focused", "instinct",
      "gut feeling", "composure", "composed", "calm", "calculated", "strategic",
      "power", "in control", "executing", "mastery", "confident",
      "decisive", "efficient", "direct", "no noise", "knot", "pit of my stomach",
      "uneasy", "unsettled", "dread", "foreboding",
      "identity processing", "core self", "reorganizing", "identity level",
      "new reality", "old identity", "attachments", "dissolving", "who am I",
      "heart safety", "safety integration", "openness with safety",
    ],
  },

  whole_body: {
    label: "Whole Body",
    emoji: "✨",
    resonance: {
      core: "the nervous system broadcasting across every surface at once",
      interpretation: [
        "When the whole body shakes, trembles, tingles, itches, or buzzes — that isn't malfunction. That's the nervous system expressing itself at a whole-system level.",
        "Widespread sensation across the skin — itching, crawling, prickling, electric aliveness — means the nervous system is on high alert and broadcasting outward rather than focusing inward. Something activated the entire system at once.",
        "Discharge is the process. Aliveness — or relief — is what waits on the other side of it.",
      ],
      reorientation: "Widespread sensation means the system is trying to complete something. You don't need to stop it — just notice where it's loudest, and let your breath reach that place.",
    },
    nervous_system: {
      state: "Sympathetic broadcast — full-body activation seeking resolution",
      description: "When sensation spreads across the whole body — itching, buzzing, shaking, or crawling — the nervous system has moved out of focused response into a broadcast state. It's treating the entire surface as the signal. Itching and crawling-skin sensations often reflect sympathetic arousal expressed through the integumentary system: the body on high alert through every pore. Slow, deliberate breath into the belly interrupts the broadcast signal and begins to bring the system back into focus.",
    },
    movies: ["Willy Wonka", "Alice in Wonderland", "The Lego Movie"],
    food: ["playful meals", "seasonal fruits", "anything surprising"],
    brand_map: {
      LEGO: "structure that enables infinite possibility",
      Nintendo: "play as the point, not the reward",
      "Ben & Jerry's": "delight as philosophy",
    },
    soartv_tags: ["play", "wonder", "creativity", "aliveness"],
    somatic_pattern: "Discharge",
    bodySignals: [
      "whole body", "everywhere", "all over", "full body", "tingling", "electric", "lit up",
      "body feels alive", "feel everything", "sensation everywhere", "buzzing all over",
      "vibrating", "trembling", "shaking", "shaky",
      "arm shaking", "arms shaking", "left arm shaking", "right arm shaking",
      "both arms shaking", "arm shake", "shaking arms", "arms shake",
      "twitching", "twitch", "muscle twitch", "muscle twitching",
      "shoulder twitching", "shoulder twitch", "hip twitching", "hip twitch",
      "nerve sensation", "nerve firing", "nerves firing", "motor pattern",
      "body completing", "discharge", "releasing energy", "energy releasing",
      "stored energy releasing", "old response", "body finishing", "completion",
      "itching", "itch", "itchy", "itching all over", "itchy all over", "body itching",
      "skin itching", "skin itches", "skin crawling", "crawling skin", "crawls",
      "skin crawls", "prickling", "prickling all over", "prickle", "prickly",
      "skin prickling", "skin sensitive", "skin hypersensitive", "sensitive skin",
      "goosebumps", "goose bumps", "hair standing up", "hair on arms standing",
    ],
    keywords: [
      "alive", "aliveness", "joy", "joyful", "play", "playful", "light",
      "fun", "buzzing", "energized", "creative", "creativity",
      "happy", "free", "freedom", "expansive", "full of life", "magic", "wonder",
      "curious", "delight", "no limits", "infinite", "tremor", "shiver",
      "discharge", "releasing", "completing", "mobilized energy", "finishing",
      "old pattern completing", "motor release", "nervous system releasing",
      "crawling", "prickling", "skin", "surface", "broadcast", "hyperalert",
    ],
  },

  throat: {
    label: "Throat",
    emoji: "🗣️",
    resonance: {
      core: "expression meeting suppression at the passage point",
      interpretation: [
        "Something in you wants to be said, and the body is holding it at the threshold.",
        "The throat is where truth waits when the nervous system doesn't feel safe enough to let it through.",
      ],
      reorientation: "What you're not saying is taking up physical space. One honest sentence — to yourself — is enough to begin.",
    },
    nervous_system: {
      state: "Vagal-laryngeal circuit under stress — social engagement suppressed",
      description: "The same nerve that regulates your heartbeat also controls your voice — which is why fear or overwhelm makes the voice thin, tight, or disappear entirely. Throat tightness and that lump feeling are your body holding something that wanted to come out but didn't feel safe. A sigh, a few honest words, even just naming what's true out loud — this starts letting the pressure through.",
    },
    movies: ["The King's Speech", "Dead Poets Society", "A Beautiful Mind"],
    food: ["warm liquids", "honey and lemon", "herbal teas", "soothing broths"],
    brand_map: {
      Spotify: "voice given frequency and reach",
      Moleskine: "what the voice couldn't say, the hand writes",
      "Apple Podcasts": "the human voice as the most powerful signal",
    },
    soartv_tags: ["expression", "voice", "suppression", "truth"],
    somatic_pattern: "Processing",
    bodySignals: [
      "throat", "throat pain", "throat is hurting", "throat hurts", "throat is sore",
      "sore throat", "lump in my throat", "throat tight", "tight throat",
      "throat tightness", "throat constriction", "can't swallow", "swallowing pain",
      "voice", "losing my voice", "lost my voice", "voiceless",
      "can't speak", "words stuck", "vocal", "larynx", "hyoid",
    ],
    keywords: [
      "unsaid", "unexpressed", "suppress", "suppressed", "swallow it",
      "hold back", "hold it in", "can't say it", "words won't come",
      "crying", "can't cry", "choked up", "choked", "speechless",
      "no words", "struggling to speak", "freeze when speaking",
      "held expression", "restraint", "not expressing", "relational tension",
      "something monitored", "not said", "usually relational",
    ],
  },

  hips: {
    label: "Hips / Pelvis",
    emoji: "🔄",
    resonance: {
      core: "survival energy held at the root of movement",
      interpretation: [
        "Your hips carry what the body prepared for but never got to complete.",
        "The tightness here is stored momentum — the nervous system's readiness that never found its release.",
      ],
      reorientation: "This isn't just a flexibility issue. Slow movement with breath — letting the hips open on their own terms — helps the nervous system discharge what it's been holding.",
    },
    nervous_system: {
      state: "Psoas-locked sympathetic activation — fight/flight charge without discharge",
      description: "The psoas — the deep muscle connecting your spine to your legs — is one of the first things your body recruits in fight-or-flight. In modern life, that response fires dozens of times a day for emails, conversations, and decisions, and rarely gets to complete the physical action it prepared for. What you're feeling isn't a flexibility problem — it's stored readiness, your body's record of everything it geared up to do but never got to finish.",
    },
    movies: ["Crouching Tiger Hidden Dragon", "Billy Elliot", "Black Swan"],
    food: ["grounding root vegetables", "warming soups", "slow-cooked meals"],
    brand_map: {
      Lululemon: "the body as a site of intelligence and release",
      Peloton: "movement as the completion of what the body started",
      Goop: "somatic wisdom taken seriously",
    },
    soartv_tags: ["movement", "release", "grounding", "body", "flow"],
    somatic_pattern: "Discharge",
    bodySignals: [
      "hip", "hips", "hip flexor", "hip flexors", "psoas", "groin",
      "pelvis", "pelvic", "sacrum", "sacral", "sit bones",
      "hip tight", "tight hips", "hips are tight", "hip pain",
      "hip tightness", "hip stiffness", "hip ache", "hip hurts",
      "lower back and hips", "hips and lower back",
    ],
    keywords: [
      "stuck", "frozen", "braced", "contracted", "guarded",
      "can't move", "held in place", "survival", "flee", "root",
      "grounded", "ungrounded", "unstable", "collapsed",
      "moving forward", "step into", "next phase", "forward sensitivity",
      "testing safety", "foundation", "stability", "support",
      "grounding resistance", "micro-adjustment", "refining how I move",
      "hesitation", "movement hesitation",
    ],
  },

  arms: {
    label: "Arms / Wrists / Hands",
    emoji: "🤲",
    resonance: {
      core: "action held without completion",
      interpretation: [
        "Your arms and wrists are where the body's impulse to act lives — to reach, push, protect, or create.",
        "Tightness here means the nervous system mobilized for something and that energy never finished its movement. It's not weakness. It's stored readiness.",
      ],
      reorientation: "Let the arms move slowly — not to stretch, but to complete what the body started. Even a small, deliberate movement can begin to release what's held.",
    },
    nervous_system: {
      state: "Sympathetic mobilization — action impulse arrested in the extremities",
      description: "Your arms are your primary action limbs — the first things your body recruits when it prepares to respond, defend, reach, or create. When activation fires and no action completes, that energy stays in the tissues, especially the forearms and wrists where the grip reflex holds. This isn't a muscular problem — it's a nervous system completion problem. Slow, intentional movement helps the body finish what it started.",
    },
    movies: ["The Karate Kid", "Mad Max: Fury Road", "Kill Bill"],
    food: ["magnesium-rich foods", "anti-inflammatory foods", "warm broths"],
    brand_map: {
      Theragun: "the body completing what it started",
      Moleskine: "the hand as the channel for what couldn't be spoken",
      "Under Armour": "readiness held in the body",
    },
    soartv_tags: ["action", "release", "movement", "holding", "completion"],
    somatic_pattern: "Discharge",
    bodySignals: [
      "wrist", "wrists", "left wrist", "right wrist", "wrist tightness", "wrist tension",
      "wrist pain", "wrist ache", "wrist tight", "tight wrist", "tight in my wrist",
      "tightness in my wrist", "tightness in left wrist", "tightness in right wrist",
      "arm", "arms", "left arm", "right arm", "forearm", "forearms",
      "forearm tightness", "forearm tension", "tight forearm", "forearm ache",
      "elbow", "elbows", "left elbow", "right elbow", "elbow pain", "elbow tension",
      "hand", "hands", "left hand", "right hand", "tight hand", "hand tension",
      "fingers", "finger", "finger tension", "tight fingers", "clenched",
      "knuckles", "knuckle", "palm", "palms", "grip", "gripping",
      "upper arm", "lower arm", "bicep", "biceps", "tricep", "triceps",
      "clenching my fist", "fist", "fists", "clenched fist",
    ],
    keywords: [
      "holding back", "held back", "wanting to act", "can't act", "restrained",
      "bracing", "gripping", "gripped", "clenched", "tense arms",
      "action impulse", "wanting to do something", "stopped myself",
      "interrupted", "suppressed action", "didn't finish", "incomplete",
      "reach", "reaching", "push back", "push away", "protect",
    ],
  },

  upper_back: {
    label: "Upper Back",
    emoji: "🪨",
    resonance: {
      core: "effort held under visibility",
      interpretation: [
        "You're holding something that has to look a certain way from the outside.",
        "The middle of the back between the shoulder blades carries what the body prepares when performance and pressure meet — the weight of being seen while still working.",
      ],
      reorientation: "You don't have to carry the outcome. Do the work and let the result move through you.",
    },
    nervous_system: {
      state: "Sympathetic activation — effort under sustained external expectation",
      description: "The muscles between your shoulder blades hold a different kind of tension — not the braced-for-impact tension of anticipation, but the sustained effort of maintaining form under observation. When you're being evaluated — even by yourself — this region loads up and stays loaded. The release isn't about stopping the effort. It's about letting breath move through the back body and noticing the work doesn't require the tension.",
    },
    movies: ["Whiplash", "The Social Network", "Black Swan"],
    food: ["magnesium-rich foods", "dark leafy greens", "anti-inflammatory meals"],
    brand_map: {
      "Under Armour": "performance held in the body",
      Rolex: "precision under sustained pressure",
      LinkedIn: "visibility and the weight it carries",
    },
    soartv_tags: ["performance", "visibility", "effort", "pressure"],
    somatic_pattern: "Activation",
    bodySignals: [
      "between my shoulder blades", "between the shoulder blades", "between shoulder blades",
      "middle of my back", "middle back", "mid back", "mid-back",
      "upper back", "upper back pain", "upper back tight", "upper back tightness",
      "shoulder blade", "shoulder blades", "shoulder blade pain", "shoulder blade tightness",
      "right shoulder blade", "left shoulder blade", "both shoulder blades",
      "upper back pain and tightness", "thoracic", "thoracic spine",
      "between my shoulders", "the middle of my back", "back between my shoulders",
      "rhomboids", "mid trap", "mid trapezius",
    ],
    keywords: [
      "performance", "performing", "being watched", "being evaluated", "observed",
      "expectation", "visibility", "effort under pressure", "holding form",
      "under scrutiny", "judged", "measured", "proving", "having to deliver",
      "sustained effort", "can't let up", "tension between", "holding it together",
    ],
  },

  feet: {
    label: "Feet / Legs",
    emoji: "🦶",
    resonance: {
      core: "the body searching for ground it doesn't feel yet",
      interpretation: [
        "Tension in the feet means the nervous system is looking for something solid to land on.",
        "Your feet are where the body decides whether the ground beneath it is safe. When they hold tension, the system hasn't found its answer yet.",
      ],
      reorientation: "Press both feet flat to the floor. Let the weight settle through your heels slowly. The ground is already there — your system just needs to be told.",
    },
    nervous_system: {
      state: "Sympathetic peripheral activation — body poised to move but not yet moving",
      description: "Your feet and lower legs are the farthest points from your brain but among the first recruited when your nervous system prepares to move — toward safety, away from threat, or forward into the next thing. Tension here means the body mobilized for movement that never happened. Pressing both heels deliberately into the floor gives the nervous system the proprioceptive signal it's been waiting for: the ground is there, it's solid, and you're still in it.",
    },
    movies: ["The Secret Life of Walter Mitty", "Wild", "Forrest Gump"],
    food: ["grounding root vegetables", "slow warm meals", "earthy teas"],
    brand_map: {
      Allbirds: "the body connected to the ground beneath it",
      Hoka:     "the foot as the first intelligence",
      Patagonia: "presence in the physical world",
    },
    soartv_tags: ["grounding", "presence", "stability", "forward", "foundation"],
    somatic_pattern: "Stabilization",
    bodySignals: [
      "foot", "feet", "foot pain", "feet tension", "tension in my feet", "feet sensitivity",
      "sole", "soles", "soles of my feet",
      "heel", "heels", "heel pain", "left heel", "right heel", "heel ache", "heel sensation",
      "heel pressure", "grounding in heel", "heel sensitivity",
      "toe", "toes", "right toe", "left toe", "toe ache", "top of toe",
      "shin", "shins", "shin pain", "shin sensation", "shin tightness", "left shin",
      "right shin", "nerve in shin", "nerve in my shin", "nerve sensation shin",
      "shin nerve", "shin ache", "shin burning",
      "leg", "legs", "lower leg", "lower legs",
      "knee", "knees", "knee pain", "knee tension", "knee tight", "tight knee",
      "calf", "calves", "calf tension", "calf pain", "calf tight",
      "ankle", "ankles", "ankle pain", "ankle tension", "ankle tight",
    ],
    keywords: [
      "grounded", "ungrounded", "not grounded", "no ground", "can't land",
      "nowhere to stand", "unstable", "no foundation", "disconnected from ground",
      "untethered", "floating", "not present", "can't be present",
      "present", "presence", "in my body", "back in my body",
      "testing safety", "foundation", "stability", "support",
      "moving forward", "step into", "next phase", "forward sensitivity",
      "grounding resistance", "micro-adjustment", "refining how I move",
      "hesitation", "movement hesitation",
    ],
  },

  spine: {
    label: "Spine / Purpose",
    emoji: "🌟",
    resonance: {
      core: "vertical alignment with something larger",
      interpretation: [
        "You feel the pull of a story bigger than your individual life.",
        "Meaning isn't optional for you — it's the axis everything else turns on.",
      ],
      reorientation: "You don't need to see the whole path. The next step is enough.",
    },
    nervous_system: {
      state: "Organized sympathetic mobilization — purposeful arousal",
      description: "When you feel pulled toward something larger than yourself, your nervous system shifts into a different kind of energy — not anxious, but organized momentum. Your body's sense of direction and sense of purpose share the same pathways, which is why you stand taller without thinking about it. The energy you feel isn't restlessness — it's readiness.",
    },
    movies: ["Star Wars", "The Hobbit", "Harry Potter"],
    food: ["balanced nourishing meals", "hydrating teas", "foods that sustain long journeys"],
    brand_map: {
      LEGO: "building block by block toward something epic",
      Disney: "narrative as the container for meaning",
      NASA: "purpose at the scale of the cosmos",
    },
    soartv_tags: ["purpose", "destiny", "mentorship", "legacy"],
    somatic_pattern: "Activation",
    bodySignals: [
      "spine", "backbone", "back", "lower back", "vertebrae", "tailbone", "upright", "posture",
      "back pain", "lower back pain", "back ache", "backache", "spine pain",
      "sore back", "stiff back", "back tension", "back is tight", "back hurts",
      "sacrum", "sacral", "lumbar", "disc", "sciatic", "sciatica",
    ],
    keywords: [
      "purpose", "meaningful", "meaning", "mission", "calling", "destiny", "legacy",
      "why", "something bigger", "bigger picture", "beyond myself", "service",
      "direction", "path", "lost", "searching", "what am i doing",
      "contribution", "impact", "matter", "leave a mark",
      "vision", "north star", "aligned", "alignment", "rigid", "inflexible", "stuck",
    ],
  },
};

export function getBodyInsight(filmId: string): BodyArea | null {
  for (const area of Object.values(BODY_RESONANCE)) {
    if (area.movies.includes(filmId)) return area;
  }
  return null;
}

export function getTagsForFilms(filmIds: string[]): string[] {
  const tags = new Set<string>();
  for (const id of filmIds) {
    const area = getBodyInsight(id);
    if (area) area.soartv_tags.forEach((t) => tags.add(t));
  }
  return Array.from(tags);
}

/** Match a word or phrase with word-boundary awareness */
function hasToken(text: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Multi-word phrases: substring match is fine
  if (token.includes(" ")) return text.includes(token);
  // Single words: require word boundary so "head" doesn't fire inside "overhead"
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

// Universal sensation words → mapped to most anatomically common areas
const SENSATION_SEEDS: Record<string, string[]> = {
  shoulders:  ["pain", "hurt", "hurts", "hurting", "sore", "soreness", "ache", "aching", "discomfort", "tight", "tense"],
  chest:      ["pain", "hurt", "hurts", "hurting", "discomfort", "tight", "pressure", "heavy", "constricted"],
  spine:      ["pain", "hurt", "hurts", "hurting", "sore", "soreness", "ache", "aching", "stiff", "stiffness", "rigid"],
  upper_back: ["pain", "hurt", "hurts", "hurting", "sore", "soreness", "ache", "aching", "tight", "tense", "stiff"],
  arms:       ["pain", "hurt", "hurts", "hurting", "sore", "soreness", "ache", "aching", "tight", "tense", "tightness"],
  solar_plexus: ["pain", "hurt", "hurts", "hurting", "discomfort", "sick", "tight"],
  head:       ["pain", "hurt", "hurts", "hurting", "pressure", "pounding", "throbbing", "tense"],
  heart:      ["pain", "hurt", "hurts", "hurting", "ache", "aching", "heavy", "grief", "sad", "sadness"],
  whole_body: ["numb", "numbness", "shaking", "trembling", "vibrating", "buzzing", "itching", "itchy", "crawling", "prickling"],
  throat:     ["pain", "hurt", "hurts", "hurting", "sore", "ache", "aching", "discomfort", "tight", "overwhelmed"],
  hips:       ["tight", "tense", "stiff", "pain", "hurt", "hurts", "hurting", "sore", "ache", "aching", "locked", "stuck"],
  feet:       ["tight", "tense", "tension", "pain", "hurt", "hurts", "hurting", "sore", "ache", "aching", "burning", "numb"],
};

/** Shared scoring engine — returns raw scores for all body areas. */
function scoreBodyAreas(text: string): {
  scores: Record<string, number>;
  bodySignalScores: Record<string, number>;
} {
  const areas = BODY_RESONANCE;
  const scores: Record<string, number> = {};
  const bodySignalScores: Record<string, number> = {};

  for (const key of Object.keys(areas)) { scores[key] = 0; bodySignalScores[key] = 0; }

  for (const [key, area] of Object.entries(areas)) {
    for (const signal of area.bodySignals) {
      if (hasToken(text, signal)) { scores[key] += 14; bodySignalScores[key] += 14; }
    }
    for (const kw of area.keywords) {
      if (hasToken(text, kw.toLowerCase())) scores[key] += 4;
    }
    for (const tag of area.soartv_tags) {
      if (hasToken(text, tag.toLowerCase())) scores[key] += 3;
    }
    for (const seed of (SENSATION_SEEDS[key] ?? [])) {
      if (hasToken(text, seed)) { scores[key] += 2; bodySignalScores[key] += 2; }
    }
  }
  return { scores, bodySignalScores };
}

function pickBestKey(
  scores: Record<string, number>,
  bodySignalScores: Record<string, number>,
): string {
  const anyBodySignalHit = Object.values(bodySignalScores).some((s) => s > 0);
  let bestKey = Object.keys(scores)[0];
  for (const key of Object.keys(scores)) {
    if (anyBodySignalHit && bodySignalScores[key] === 0) continue;
    if (scores[key] > scores[bestKey] || (anyBodySignalHit && bodySignalScores[bestKey] === 0)) {
      bestKey = key;
    }
  }
  return bestKey;
}

/** Returns body area + key when the match is confident. Use for resonance enrichment on Turn 2. */
export function matchBodyAreaForResonance(input: string): BodyArea | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const { scores, bodySignalScores } = scoreBodyAreas(trimmed.toLowerCase());
  const bestKey = pickBestKey(scores, bodySignalScores);
  return scores[bestKey] >= 8 ? (BODY_RESONANCE[bestKey] ?? null) : null;
}

/** Returns body area + its key. Threshold = 8. Use for Turn 1 body-led detection. */
export function matchBodyAreaWithKey(input: string): { key: string; area: BodyArea } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const { scores, bodySignalScores } = scoreBodyAreas(trimmed.toLowerCase());
  const bestKey = pickBestKey(scores, bodySignalScores);
  const area = BODY_RESONANCE[bestKey];
  return scores[bestKey] >= 8 && area ? { key: bestKey, area } : null;
}

export function matchByInput(input: string): BodyArea | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const text = trimmed.toLowerCase();
  const areas = BODY_RESONANCE;

  const scores: Record<string, number> = {};
  const bodySignalScores: Record<string, number> = {};

  for (const key of Object.keys(areas)) {
    scores[key] = 0;
    bodySignalScores[key] = 0;
  }

  for (const [key, area] of Object.entries(areas)) {
    // Body signals — very high weight; user named the body part explicitly
    for (const signal of area.bodySignals) {
      if (hasToken(text, signal)) {
        scores[key] += 14;
        bodySignalScores[key] += 14;
      }
    }

    // Thematic keywords — standard weight, word-boundary aware
    for (const kw of area.keywords) {
      if (hasToken(text, kw.toLowerCase())) scores[key] += 4;
    }

    // Tag match
    for (const tag of area.soartv_tags) {
      if (hasToken(text, tag.toLowerCase())) scores[key] += 3;
    }

    // Universal sensation seeds — low weight, distributes generic pain language
    for (const seed of (SENSATION_SEEDS[key] ?? [])) {
      if (hasToken(text, seed)) {
        scores[key] += 2;
        bodySignalScores[key] += 2;
      }
    }
  }

  // If any area matched an explicit body part, only consider those areas.
  // This prevents generic feeling-words ("tightness", "heavy") from winning
  // when the user named a specific location that belongs elsewhere.
  const anyBodySignalHit = Object.values(bodySignalScores).some((s) => s > 0);

  let bestKey = Object.keys(scores)[0];
  for (const key of Object.keys(scores)) {
    if (anyBodySignalHit && bodySignalScores[key] === 0) continue;
    if (scores[key] > scores[bestKey] ||
        (anyBodySignalHit && bodySignalScores[bestKey] === 0)) {
      bestKey = key;
    }
  }

  return areas[bestKey] ?? null;
}
