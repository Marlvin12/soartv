// ─────────────────────────────────────────────────────────────────────────────
// FilmFlow7 — Resonance Insights content
// The deep narrative copy for the post-survey Insights reveal. Two layers:
//   ARCHETYPE_REVEAL  — keyed to the user's primary archetype (the big reveal)
//   FILM_PROFILES     — keyed by archetype's signature film (the survey-pick layer)
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeId } from '@/lib/archetypes'

export interface ArchetypeReveal {
  chapter:              string    // poetic growth-chapter word
  opening:              string    // the headline narrative paragraph
  coreDesire:           string
  nervousSystemPattern: string
  physicalPatterns:     string[]
  emotionalPatterns:    string[]
  adapting:             string[]  // "How You've Been Adapting" — 3 beats
  becoming:             string[]  // "Who You're Becoming" — 3 beats
  patternLiving:        string    // "The Pattern You've Been Living"
  becomesPossible:      string    // "What Becomes Possible"
  invitation:           string    // "Your Invitation Forward"
  integratedPathBody:   string    // the integrated-path description
}

export interface BodyResonance {
  region:            string
  line:              string
  sub:               string
  reorientation:     string
  nervousSystem:     string
  nervousSystemDesc: string
}

export interface FilmProfile {
  mood:          string    // short line — "Current Mood"
  lifeStory:     string    // short line — "Life Story"
  aspiration:    string    // paragraph — "Aspiration"
  exclusion:     string    // paragraph — "What You Move Away From"
  lifestyle:     string
  brands:        string[]
  parallelFilms: string[]
  tags:          string[]  // resonance tags, rendered with a leading #
  body:          BodyResonance
}

// ─── Archetype reveals ─────────────────────────────────────────────────────────

export const ARCHETYPE_REVEAL: Record<ArchetypeId, ArchetypeReveal> = {
  hiddenOne: {
    chapter: 'Awakening',
    opening: `You are someone whose depth has rarely been fully met. You learned early that visibility can come with a cost — the cost of judgment, rejection, or simply being misunderstood by people who weren't ready to receive what you carry. What looks like guardedness is actually discernment: you know that not every space is safe for the real you, and you've protected yourself accordingly. The depth inside you is not a problem to fix — it is the source of everything remarkable about you.`,
    coreDesire: 'Safe self-expression and transformation.',
    nervousSystemPattern: 'Suppression of voice, needs, and authentic expression.',
    physicalPatterns:  ['throat constriction', 'shallow breathing', 'digestive tension', 'fatigue', 'stress-related immune dysregulation'],
    emotionalPatterns: ['self-silencing', 'withdrawal', 'internalized shame', 'suppressed creativity'],
    adapting: [
      `You hold back your truest thoughts, editing yourself before others get the chance to — a protection that developed when full expression felt risky or unsafe in the spaces that formed you.`,
      `You step back from the spotlight not from lack of value, but because visibility once felt more like exposure than invitation. The holding back made sense then.`,
      `Despite the richness of what you carry inside, you often move through spaces feeling unseen — because the real you stays carefully protected behind what you've chosen to show.`,
    ],
    becoming: [
      `You speak what is actually true for you, and discover that your words carry a precision and weight that genuinely moves the people who are ready to receive them.`,
      `You channel the full complexity of your experience into meaning — becoming someone who creates bridges that others are deeply grateful to cross.`,
      `You offer the kind of emotional presence that anchors people — a depth of connection that most people encounter only once or twice in their lives.`,
    ],
    patternLiving: `Moving through the world carefully contained — depth hidden, presence held back, waiting for a space safe enough to finally exhale.`,
    becomesPossible: `Grounded, emotionally present, and quietly powerful — the person you've always been underneath the protection, finally allowed to take up the right amount of space.`,
    invitation: `Your growth lives in learning that visibility, when it arrives through safety and earned trust, doesn't cost you what it once did. You don't need to be fully seen by everyone — but allowing the right people to genuinely know you is how your depth finally finds its rightful place in the world. Being seen won't break what took so long to build. In fact, it's what the depth was always for.`,
    integratedPathBody: `You are becoming someone who turns everything you've lived — the difficulty, the uncertainty, the grief, the growth — into something with meaning and forward motion. Nothing is wasted. Every experience becomes material. This is not just a mindset; it is the deepest kind of integration available to a human being.`,
  },

  performer: {
    chapter: 'Unmasking',
    opening: `You learned, somewhere early, that love arrived when you delivered — when you achieved, performed, sparkled, produced. So you became extraordinary at it. What looks like effortless confidence is often a finely tuned instrument scanning the room for whether you're still wanted. The brilliance is real. The exhaustion underneath it is also real. You are not the performance — you are the person who has been generous enough to keep giving one.`,
    coreDesire: 'To be loved and chosen for who you are beneath the achievement.',
    nervousSystemPattern: 'Chronic mobilization — the system braced to perform, rarely permitted to land.',
    physicalPatterns:  ['adrenaline spikes', 'jaw and shoulder tension', 'burnout cycles', 'disrupted sleep', 'restlessness in stillness'],
    emotionalPatterns: ['overperforming', 'approval-seeking', 'fear of irrelevance', 'difficulty resting'],
    adapting: [
      `You keep producing, achieving, delivering — because somewhere it was made clear that the applause and the love were the same thing, and stopping felt like losing both.`,
      `You read every room for whether you're still wanted, adjusting your energy in real time — a vigilance that once kept you reliably chosen.`,
      `You stay polished and impressive, and yet often feel admired rather than known — because the performance is what gets seen, and the person behind it rarely gets invited forward.`,
    ],
    becoming: [
      `You create and lead from genuine conviction, and find that what you make lands harder when it's true than it ever did when it was merely impressive.`,
      `You let yourself be loved in the ordinary, unspectacular moments — and discover that the love was never actually conditional on the show.`,
      `You become a presence that inspires rather than performs — someone whose authenticity gives other people quiet permission to drop their own act.`,
    ],
    patternLiving: `Moving through the world mid-performance — bright, capable, applauded, and quietly wondering whether anyone would stay once the lights came down.`,
    becomesPossible: `Expressive, inspiring, and grounded in purpose — creating because it's true, not because it's the price of being kept.`,
    invitation: `Your growth lives in discovering that you are not the sum of what you produce. The people worth having will stay in the silence between the performances — and that silence is not danger, it's where you finally get to be a person instead of a product. Let yourself be loved off-stage. That love was always the point.`,
    integratedPathBody: `You are becoming someone who leads through a vision that is genuinely your own — not the version most likely to be applauded. Your conviction becomes your instrument. You stop asking whether the room approves and start trusting that the right rooms will follow. This is influence that costs you nothing of yourself.`,
  },

  seeker: {
    chapter: 'Arriving',
    opening: `You have spent your life reaching — for meaning, for the next insight, for the version of understanding that will finally make you feel whole. The searching is not a flaw; it's a form of devotion. But somewhere the search became the thing itself, a way of staying in motion so you never have to sit still with what's unresolved. What you're looking for has, more often than you'd believe, been quietly walking beside you the whole time.`,
    coreDesire: 'To feel whole — and to trust that you already carry what you have been seeking.',
    nervousSystemPattern: 'Restless cognitive motion — a system that reaches forward to avoid arriving.',
    physicalPatterns:  ['racing thoughts', 'difficulty settling', 'restlessness', 'shallow sleep', 'mental fatigue'],
    emotionalPatterns: ['overthinking', 'chronic self-improvement', 'incompletion', 'spiritual bypassing'],
    adapting: [
      `You keep searching — books, teachers, frameworks, the next breakthrough — because if you stopped moving, you might have to feel the thing the searching was outrunning.`,
      `You shift direction often, mistaking motion for progress, because arriving somewhere means committing, and committing means risking being wrong.`,
      `You consume more meaning than you create, staying perpetually almost-ready — because "not yet whole" is a safer place to live than "this is who I am."`,
    ],
    becoming: [
      `You embody the wisdom you've already gathered instead of chasing more — and find that lived knowing is worth more than any insight still in motion.`,
      `You trust your inner signal enough to act on it, and discover that direction was never missing; only the permission to choose it.`,
      `You become a guide for others — someone who turns a lifetime of seeking into a steady, grounded presence people can actually orient by.`,
    ],
    patternLiving: `Always en route, never arrived — collecting maps of a place you were quietly afraid to finally stand still inside.`,
    becomesPossible: `Grounded, curious, and present — carrying your wisdom in your body instead of chasing it across the horizon.`,
    invitation: `Your growth lives in letting the search rest. Clarity has never come from chasing it harder — it comes when the nervous system stops running long enough to notice what's already true. You are allowed to arrive. The meaning you were reaching for becomes available the moment you stop treating yourself as unfinished.`,
    integratedPathBody: `You are becoming someone who no longer searches for wisdom because you have become a source of it. Your lived experience — every detour, every question — settles into grounded knowing. You stop consuming understanding and start embodying it. People come to you not for answers, but for the steadiness of someone who has finally arrived.`,
  },

  giver: {
    chapter: 'Replenishing',
    opening: `You are the one who holds everyone. You feel the room, anticipate the need, arrive before you're asked — and somewhere along the way, being needed became almost indistinguishable from being loved. Your care is real and rare. But you have been running the engine on a tank you never refill, calling it humility when it was closer to self-erasure. The world is not asking you to disappear in order to be good.`,
    coreDesire: 'Connection that flows both ways — to be cared for as fully as you care.',
    nervousSystemPattern: 'Outward-tuned vigilance — the system tracking others’ needs before its own.',
    physicalPatterns:  ['fatigue and depletion', 'digestive tension', 'tension headaches', 'weakened recovery', 'running on empty'],
    emotionalPatterns: ['over-giving', 'self-neglect', 'quiet resentment', 'difficulty receiving'],
    adapting: [
      `You give first, give most, give again — because being indispensable felt like the most reliable way to be kept close.`,
      `You minimize your own needs, often not even noticing them, because attending to yourself once felt like taking something from someone who needed it more.`,
      `You pour out steadily and still feel unseen — because the giving became so constant that no one, including you, remembers to ask how you actually are.`,
    ],
    becoming: [
      `You give from overflow instead of depletion — and find that care offered from fullness is warmer, steadier, and lasts far longer.`,
      `You let yourself receive, and discover that being held does not cost you your goodness; it completes the circuit love was always meant to run on.`,
      `You become someone who creates genuine safety for others — not by vanishing into their needs, but by modeling what it looks like to stay whole while caring deeply.`,
    ],
    patternLiving: `Holding everyone, held by no one — generous to the point of disappearing, and quietly hoping someone would notice the cost.`,
    becomesPossible: `Compassionate, balanced, and emotionally nourished — giving freely because you are full, not because you are afraid of being left.`,
    invitation: `Your growth lives in learning that receiving is not the opposite of generosity — it's the other half of it. You are allowed to exist beyond your usefulness. The people who truly love you want to hold you too, and letting them is not weakness; it's how you stay able to give for the rest of your life.`,
    integratedPathBody: `You are becoming someone who restores and connects without abandoning yourself in the process. You give from overflow. You hold boundaries that protect your warmth instead of dissolving it. Your care becomes sustainable — a deep, steady source rather than a fire burning itself out.`,
  },

  protector: {
    chapter: 'Releasing',
    opening: `You became the steady one. Somewhere it fell to you to hold the line, carry the weight, make sure nothing fell apart — and you did, and you've barely stopped since. Your vigilance has kept real things safe. But the body that never lets its guard down also never fully rests, and the strength that carries everyone can quietly become a kind of prison. You are allowed to be protected too.`,
    coreDesire: 'Safety that does not depend on you holding everything together alone.',
    nervousSystemPattern: 'Sustained guardedness — a system braced for the next thing that could go wrong.',
    physicalPatterns:  ['muscular tension', 'jaw clenching', 'digestive constriction', 'chronic vigilance', 'shallow rest'],
    emotionalPatterns: ['hypervigilance', 'over-responsibility', 'difficulty delegating', 'emotional suppression'],
    adapting: [
      `You carry it all — the planning, the watching, the worst-case scenario — because once, briefly or for a long time, there genuinely was no one else to carry it.`,
      `You keep control tight and let very little reach you, because softening felt like the moment everything you were holding could slip.`,
      `You stay strong, dependable, and quietly inaccessible — because letting people close enough to help also meant letting them close enough to see the weight you never admit to.`,
    ],
    becoming: [
      `You lead from trust instead of fear — and find that shared responsibility doesn't weaken the structure; it's what finally lets it hold without you.`,
      `You let support reach you, and discover that being cared for doesn't compromise your strength; it's what makes the strength sustainable.`,
      `You become a true guardian — someone who creates safety others can rest inside, without having to burn yourself down to do it.`,
    ],
    patternLiving: `Holding the line alone — braced, watchful, carrying the weight of everyone, and calling the exhaustion "just responsibility."`,
    becomesPossible: `Protective, calm, grounded, and dependable — strong because you trust the structure, not because you're afraid to let go of it.`,
    invitation: `Your growth lives in learning that safety does not require your unbroken vigilance. The people around you are more capable than your fear lets you believe. You are allowed to set the weight down, to be held, to rest — and the world will not fall apart. Trust is not the absence of protection; it's the mature form of it.`,
    integratedPathBody: `You are becoming someone who protects from grounded trust rather than fear. You no longer have to control everything to keep it safe. You build structures and relationships strong enough to hold without your constant grip — and in doing so you become the calm, steady authority people are genuinely safe around.`,
  },

  shapeshifter: {
    chapter: 'Rooting',
    opening: `You can become whatever a room needs — read the energy, match the frequency, belong almost anywhere. It's a genuine gift, and it was also a survival strategy: somewhere it became clear that the real you might not be safe to show, so you learned to offer the version most likely to be kept. But a self that is always adapting never gets to be known. You were always enough — long before the adapting began.`,
    coreDesire: 'To be accepted as you actually are, without performing a version to earn it.',
    nervousSystemPattern: 'Identity fluidity under pressure — a system that merges with others to stay safe.',
    physicalPatterns:  ['anxiety and unease', 'digestive flare-ups', 'skin reactivity', 'feeling unrooted', 'fatigue from code-switching'],
    emotionalPatterns: ['masking', 'identity confusion', 'people-pleasing', 'fear of abandonment'],
    adapting: [
      `You become what each room seems to want — shifting voice, opinion, energy — because somewhere, being adaptable felt far safer than being simply yourself.`,
      `You read people with uncanny accuracy and mold to fit, because belonging once depended on it and abandonment felt like the cost of being too distinctly you.`,
      `You move through your life feeling slightly unreal — present everywhere, rooted nowhere — because the self that adapts to everyone never gets the chance to be anyone.`,
    ],
    becoming: [
      `You stay rooted in who you are while still moving fluidly through the world — and find that real belonging only ever happens to a self that's actually there to be met.`,
      `You let people see the unadapted version, and discover that the ones worth keeping were waiting for exactly that the whole time.`,
      `You become a catalyst — someone whose authenticity transforms a room, instead of someone who simply dissolves into it.`,
    ],
    patternLiving: `Belonging everywhere, known nowhere — fluent in every room, and quietly unsure which version, if any, was actually you.`,
    becomesPossible: `Adaptable yet grounded — flexible by choice, not by fear, and finally rooted in a self that doesn't disappear under pressure.`,
    invitation: `Your growth lives in discovering that you do not have to abandon yourself to belong. The adapting was brilliant, and it kept you safe — and you no longer need it the way you did. Let the right people meet the unperformed you. Belonging that costs you your identity was never belonging; it was just a very skilled disappearance.`,
    integratedPathBody: `You are becoming someone who transforms rooms and relationships through authentic self-expression rather than adaptation. Your sensitivity to people stops being a way to disappear and becomes a way to lead. You stay rooted while you move — and that combination of depth and fluidity is exactly what makes you a catalyst.`,
  },

  warrior: {
    chapter: 'Softening',
    opening: `You push. You endure. You make things happen through sheer force of will, and you have the scars and the results to prove it works. Your strength is not in question — it never was. But somewhere, force became the only setting you trust, and a body that's always braced for the next fight never learns that the war is sometimes already over. Strength and exhaustion have been coexisting in you far longer than you've admitted.`,
    coreDesire: 'To build something lasting from peace — not only from pressure and force.',
    nervousSystemPattern: 'Chronic mobilization — a system that refuses to fully stand down.',
    physicalPatterns:  ['adrenal fatigue', 'clenched fists and jaw', 'shoulder and neck tension', 'overtraining', 'unrestful sleep'],
    emotionalPatterns: ['overworking', 'emotional suppression', 'hyper-independence', 'burnout'],
    adapting: [
      `You push through everything — pain, fatigue, doubt — because somewhere it became clear that if you stopped forcing, it would all collapse, and that belief has driven you ever since.`,
      `You armor against softness and refuse most help, because needing anyone once felt like the fastest way to be let down.`,
      `You turn life into a series of battles to be won, because a fight is a problem you know how to solve — and stillness is the one terrain that has never felt safe.`,
    ],
    becoming: [
      `You lead from peace instead of pressure — and find that vision and steadiness move people further than force ever did.`,
      `You let strength and softness coexist, and discover that the ability to rest is not the opposite of your power; it's what makes it last.`,
      `You become someone who builds sustainably — channeling the same fierce will into things that endure, instead of things that simply have to be survived.`,
    ],
    patternLiving: `Always at war — braced, driving, forcing every outcome, and unable to tell whether the threat was still real or just familiar.`,
    becomesPossible: `Strong, calm, visionary, and dependable — powerful because you've chosen the fight, not because you can't stop fighting.`,
    invitation: `Your growth lives in learning that rest is not surrender. The war that built this strength is not the war you're still in. You are allowed to lower the guard, to receive support, to let the force become vision. Your strength was never the problem — it just deserves, finally, to be used for building rather than only for surviving.`,
    integratedPathBody: `You are becoming someone who builds vision, structure, and impact from peace rather than survival. The same will that once only fought now creates. You lead through presence as much as effort — calm, decisive, grounded — and people follow not because you forced the path, but because you became someone genuinely worth following.`,
  },

  dreamer: {
    chapter: 'Grounding',
    opening: `You see the world as it could be — luminous, strange, alive with possibility — and you always have. Your imagination is not an escape hatch; it's a genuine way of perceiving more than most people let themselves see. But somewhere a quiet belief took root: that your depth and your art are bound to your struggle, that ease would cost you your truth. It won't. The world needs the dream made real, not just kept safe inside you.`,
    coreDesire: 'To build the dream into the world without losing its wonder — or yourself — in translation.',
    nervousSystemPattern: 'Sensory expansion — a system that finds harsh reality jarring and drifts to soften it.',
    physicalPatterns:  ['overstimulation sensitivity', 'escapist drift', 'vivid restless sleep', 'energy that swings', 'difficulty with harsh environments'],
    emotionalPatterns: ['self-undervaluing', 'romanticized suffering', 'financial avoidance', 'creative inconsistency'],
    adapting: [
      `You retreat into imagination when reality turns harsh — a refuge that genuinely protected something tender in you when the world felt too sharp to stay inside.`,
      `You quietly tie your worth and your art to your struggle, because somewhere it was implied that ease and abundance would make your work less true.`,
      `You under-value what you create and avoid the practical scaffolding it needs — because keeping the dream uncommitted feels safer than risking it in the unforgiving world of the real.`,
    ],
    becoming: [
      `You create from joy and truth rather than from struggle — and find that your work loses none of its depth and gains a great deal of its life.`,
      `You let your imagination meet the real world, and discover you can build the dream into something durable without flattening the wonder out of it.`,
      `You become someone who keeps beauty and possibility alive for everyone else — a person whose vision makes the world feel larger than it did before you spoke.`,
    ],
    patternLiving: `Dreaming vividly, building rarely — keeping the wonder safe and unrealized, half-believing struggle was the price of making it true.`,
    becomesPossible: `Inspired, expressive, and creatively abundant — making the dream real in the world without losing a trace of its magic.`,
    invitation: `Your growth lives in releasing the belief that suffering is the source of your art. It never was — your imagination is. You are allowed to build, to be paid, to thrive, and still make work that is luminous and true. The dream was never meant to stay inside you for safekeeping. It was meant to be made.`,
    integratedPathBody: `You are becoming someone who creates from joy, worth, and flow rather than from struggle. Your imagination stops being a place to hide and becomes a place to build from. You let your creativity generate abundance and reach, and you treat your art as both sacred and genuinely valuable.`,
  },
}

// ─── Signature-film profiles ───────────────────────────────────────────────────
// Keyed by archetype — each archetype has exactly one signature survey film.

export const FILM_PROFILES: Record<ArchetypeId, FilmProfile> = {
  hiddenOne: {
    mood: 'Hidden brilliance, quiet depth, the ache of being unmet.',
    lifeStory: 'Protecting something rare until it is finally safe to be known.',
    aspiration: `You aspire to be known without being exposed — to find the few rooms safe enough that the real you can finally walk in unguarded. You want your depth to land where it is actually received, not braced against. What you are reaching toward is not attention; it is the specific relief of being seen accurately by someone who stays.`,
    exclusion: `You move away from spaces that demand performance over truth, from people who mistake your quiet for emptiness, and from environments where being known feels like being used. You are done shrinking to stay palatable. You would rather be unseen by the wrong room than misread by it.`,
    lifestyle: 'Aligned with brands like A24, Calm, and Aesop. Drawn to independent film, journaling, slow mornings, and spaces that reward depth over noise.',
    brands: ['A24', 'Calm', 'Aesop'],
    parallelFilms: ['Manchester by the Sea', 'Her', 'The Perks of Being a Wallflower'],
    tags: ['depth', 'discernment', 'guarded', 'longing', 'unseen', 'truth', 'protection', 'becoming', 'safety', 'expression', 'quiet power', 'integration'],
    body: {
      region: 'Throat / Chest — expression held at the gate',
      line: 'What you carry rarely makes it past the point where it could be heard.',
      sub: 'The depth is fully formed inside — it just stays behind the guard.',
      reorientation: '"Let one true sentence out. Safety is built one exhale at a time."',
      nervousSystem: 'Dorsal withdrawal / suppressed expression',
      nervousSystemDesc: `When a system learns that visibility is risky, it quietly closes the channels of expression — the throat tightens, the breath shortens, the voice stays small. The protection is real, but so is the cost: depth with no outlet becomes pressure. Speaking one honest thing in a safe space, slowly, teaches the body that expression and danger are not the same.`,
    },
  },

  performer: {
    mood: 'Bright ambition, the hunger to be chosen, the fear behind the shine.',
    lifeStory: 'Chasing the dream — and learning what it costs to be loved for the work.',
    aspiration: `You aspire to a life that is genuinely yours — work that means something, expression that lands, a stage you chose rather than one you are trapped performing on. You want to create from conviction and still be loved in the quiet. What you are reaching toward is the rare combination of being seen and being known at the same time.`,
    exclusion: `You move away from hollow validation, from rooms that applaud the performance and never ask about the person, and from a version of success that requires you to disappear into it. You are done earning love by the achievement. You would rather make one true thing than a hundred impressive ones.`,
    lifestyle: 'Aligned with brands like Spotify, Vogue, and TED. Drawn to the arts, live performance, design, and ideas worth standing behind.',
    brands: ['Spotify', 'Vogue', 'TED'],
    parallelFilms: ['Whiplash', 'A Star Is Born', 'Birdman'],
    tags: ['ambition', 'expression', 'validation', 'conviction', 'spotlight', 'authenticity', 'purpose', 'legacy', 'becoming', 'pressure', 'artistry', 'enough'],
    body: {
      region: 'Chest / Sympathetic drive — mobilized to perform',
      line: 'Your system stays switched on, scanning for whether you are still wanted.',
      sub: 'The energy is real — it just rarely gets permission to land.',
      reorientation: '"You are allowed to be loved off-stage. Let the system land."',
      nervousSystem: 'Sympathetic top-loading / performance activation',
      nervousSystemDesc: `A system trained to earn love through output stays mobilized — heart rate up, breath high, muscles ready for the next delivery. Rest registers as risk. The reorientation is teaching the body that stillness is safe: feet down, breath slow, no one to impress in this exact moment. The love does not require the performance.`,
    },
  },

  seeker: {
    mood: 'Awakening, questioning reality, searching for truth.',
    lifeStory: 'Discovery, curiosity, and the long search for what is real.',
    aspiration: `You are allergic to taking things at face value. You have always suspected that what most people call reality is just the version of it that is easiest to manage. You aspire to operate on a different frequency — one where inherited assumptions are regularly questioned, where the uncomfortable truth is always preferred over the comfortable lie, and where your mind is the one tool you never stop sharpening.`,
    exclusion: `You move away from blind conformity — from rooms that reward you for not asking, from comfortable lies dressed up as consensus, and from a life lived entirely inside someone else's assumptions. You do not need everyone to question everything. You simply cannot unsee, and you have stopped pretending you can.`,
    lifestyle: 'Aligned with brands like Apple, Tesla, and Meta Quest. Drawn to technology, big ideas, and experiences that bend the edges of what feels possible.',
    brands: ['Apple', 'Tesla', 'Meta'],
    parallelFilms: ['Inception', 'Blade Runner', 'Tron'],
    tags: ['awareness', 'questioning', 'intelligence', 'awakening', 'courage', 'authenticity', 'integrity', 'vulnerability', 'growth', 'pressure', 'becoming', 'breakthrough'],
    body: {
      region: 'Mind / Head — perception exceeding current reality',
      line: 'Your mind is running simulations beyond what is actually happening.',
      sub: 'You sense things others have not noticed yet — but the gap can feel isolating.',
      reorientation: '"Trust the signal. Let the pattern speak slowly."',
      nervousSystem: 'Dorsal vagal dissociation / sympathetic top-loading',
      nervousSystemDesc: `When the body does not feel fully safe, it sends everything upward into thinking as a way to stay in control. The more the mind races, the more disconnected you feel from your body below — watching from a distance, struggling to feel anything beneath the neck. Feet flat on the floor, jaw soft, weight in the chair — these bring the signal back down to where it can actually settle.`,
    },
  },

  giver: {
    mood: 'Open-hearted care, quiet sacrifice, the strength of showing up.',
    lifeStory: 'Holding others through — and learning that you are allowed to be held too.',
    aspiration: `You aspire to a life where your care creates real change and still leaves something for you. You want connection that runs both ways, a circle that holds you back as steadily as you hold it. What you are reaching toward is not less generosity — it is generosity that finally includes yourself.`,
    exclusion: `You move away from relationships that only take, from being needed instead of known, and from the quiet erasure of putting yourself last until there is nothing left. You are done mistaking depletion for love. You would rather give from fullness than vanish into someone else's need.`,
    lifestyle: 'Aligned with brands like Patagonia, TOMS, and charity: water. Drawn to community, family, mission-driven work, and care made tangible.',
    brands: ['Patagonia', 'TOMS', 'charity: water'],
    parallelFilms: ['Wonder', 'The Help', 'Up'],
    tags: ['care', 'family', 'community', 'sacrifice', 'warmth', 'boundaries', 'reciprocity', 'restoration', 'becoming', 'enough', 'held', 'overflow'],
    body: {
      region: 'Belly / Heart — care held outward',
      line: 'Your system tracks everyone else’s needs before it registers your own.',
      sub: 'The warmth is real — it just rarely gets pointed back at you.',
      reorientation: '"Ask what you need. Receiving completes the circuit."',
      nervousSystem: 'Fawn response / outward-tuned regulation',
      nervousSystemDesc: `A system shaped to earn safety through care stays tuned outward — scanning for others' needs, soothing, anticipating — while its own signals go quiet. Hunger, fatigue, and need register late or not at all. The reorientation is turning a small amount of that attention inward: one hand on your own chest, one honest question — what do I need right now — practiced until your own signal gets loud enough to hear.`,
    },
  },

  protector: {
    mood: 'Leadership, purpose, legacy, the weight of carrying others.',
    lifeStory: 'Building a purpose-driven legacy while protecting what matters.',
    aspiration: `You aspire to lead something that outlasts you — to build, protect, and hand forward a legacy that serves more than yourself. You want power used in service, strength in the form of stewardship. What you are reaching toward is the kind of authority people are genuinely safe to stand behind.`,
    exclusion: `You move away from selfish pursuits, from isolation dressed up as independence, and from power that protects no one but itself. You are done carrying everything alone in the name of strength. You would rather build something shared than guard something solitary.`,
    lifestyle: 'Aligned with brands like Patagonia, Rolex, and Land Rover. Drawn to leadership, heritage, craftsmanship, and institutions built to last.',
    brands: ['Patagonia', 'Rolex', 'Land Rover'],
    parallelFilms: ['Gladiator', 'Creed II', 'Logan'],
    tags: ['leadership', 'duty', 'legacy', 'protection', 'stewardship', 'strength', 'trust', 'responsibility', 'becoming', 'calm', 'grounded', 'service'],
    body: {
      region: 'Shoulders / Jaw — braced to hold the line',
      line: 'Your system stays braced for the next thing that could go wrong.',
      sub: 'The strength is real — it just never quite gets to stand down.',
      reorientation: '"The structure can hold without your grip. Let the shoulders drop."',
      nervousSystem: 'Sustained sympathetic guard / chronic vigilance',
      nervousSystemDesc: `A system that learned it had to hold everything keeps the guard up — shoulders raised, jaw set, attention scanning for threat even in safe rooms. Rest feels like risk. The reorientation is teaching the body that vigilance can be intermittent: a slow exhale, shoulders deliberately lowered, the conscious thought that right now, in this moment, nothing is falling and nothing needs to be caught.`,
    },
  },

  shapeshifter: {
    mood: 'Courage, authentic expression, duty carried with heart.',
    lifeStory: 'Becoming yourself — and honoring where you came from while you do.',
    aspiration: `You aspire to a life where you belong without disappearing — where the self you bring is the real one, and it is still welcomed. You want to honor where you come from and become who you actually are. What you are reaching toward is belonging that does not cost you your identity.`,
    exclusion: `You move away from silence and self-suppression, from rooms that only accept the edited version of you, and from belonging that is purchased by becoming someone else. You are done performing acceptability. You would rather be known as yourself than welcomed as a costume.`,
    lifestyle: 'Aligned with brands like Glossier, Patagonia, and Nike. Drawn to identity, reinvention, culture, and creative self-expression.',
    brands: ['Glossier', 'Patagonia', 'Nike'],
    parallelFilms: ['Hidden Figures', 'Brave', 'Moana'],
    tags: ['identity', 'courage', 'authenticity', 'belonging', 'reinvention', 'expression', 'rooted', 'becoming', 'truth', 'transformation', 'self', 'enough'],
    body: {
      region: 'Skin / Gut — identity held under the surface',
      line: 'Your system shifts shape to stay safe, and the real self stays beneath it.',
      sub: 'The adaptability is a gift — it just rarely lets you be found.',
      reorientation: '"Stay as yourself in one small room. Let belonging meet the real you."',
      nervousSystem: 'Fawn / identity-fluid regulation',
      nervousSystemDesc: `A system that learned the real self might not be safe becomes fluid under pressure — voice, opinion, and energy reshaping to match the room. The cost shows up in the body as a low background unease, a sense of being slightly unreal. The reorientation is practicing un-adapted presence in safe rooms: one honest opinion, one un-shifted reaction, repeated until the body learns that being yourself did not end in abandonment.`,
    },
  },

  warrior: {
    mood: 'Resilience, grit, and determination against the odds.',
    lifeStory: 'Perseverance, endurance, and proving yourself when the odds are stacked against you.',
    aspiration: `You aspire to a life built by your own hands — to prove, mostly to yourself, that effort and will can carry you and the people you love through anything. You want to go the distance. What you are reaching toward is not just winning; it is becoming someone who cannot be counted out.`,
    exclusion: `You are done with environments that reward comfort over effort. You move away from spaces where mediocrity is dressed up as balance and quitting is reframed as self-care. People who make excuses where you make adjustments drain your energy. You do not judge — you simply know that your path requires a different kind of company.`,
    lifestyle: 'Aligned with brands like Nike, Under Armour, and Red Bull. Drawn to training, motivation, discipline, and gear that earns its keep.',
    brands: ['Nike', 'Under Armour', 'Red Bull'],
    parallelFilms: ['Creed', 'The Pursuit of Happyness', 'Warrior'],
    tags: ['resilience', 'grit', 'discipline', 'endurance', 'fight', 'proving', 'strength', 'mission', 'becoming', 'legacy', 'peace', 'distance'],
    body: {
      region: 'Fists / Jaw — mobilized for the next round',
      line: 'Your system stays braced to push, even when the fight is already over.',
      sub: 'The drive is real — it just does not know how to stand down.',
      reorientation: '"The round is over. You are allowed to lower your hands."',
      nervousSystem: 'Chronic sympathetic activation / fight-mobilization',
      nervousSystemDesc: `A system that survived by pushing keeps the engine running — fists ready, jaw tight, the body braced for an opponent that may no longer be in the room. Rest reads as danger. The reorientation is teaching the body the difference between a real fight and an old habit: hands unclenched, jaw soft, a slow breath, the deliberate recognition that this moment is not under attack.`,
    },
  },

  dreamer: {
    mood: 'Wonder, imagination, turning a life into something mythic.',
    lifeStory: 'Seeing the world larger than it is — and learning to build the dream, not just tell it.',
    aspiration: `You aspire to a life with the wonder left in — work that is luminous, a world you helped make stranger and more beautiful, a dream you actually built instead of only imagined. You want abundance without losing the magic. What you are reaching toward is the dream made real, fully intact.`,
    exclusion: `You move away from rigidity and dullness, from rooms that flatten wonder into spreadsheets, and from the grey, joyless version of being a grown-up. You are done believing your art requires your suffering. You would rather build the dream than guard it unrealized.`,
    lifestyle: 'Aligned with brands like Pixar, LEGO, and Moleskine. Drawn to art, storytelling, design, and anything that keeps wonder in the world.',
    brands: ['Pixar', 'LEGO', 'Moleskine'],
    parallelFilms: ['Amélie', 'Hugo', 'The Grand Budapest Hotel'],
    tags: ['imagination', 'wonder', 'beauty', 'storytelling', 'creativity', 'expression', 'abundance', 'joy', 'becoming', 'magic', 'building', 'vision'],
    body: {
      region: 'Senses / Whole body — tuned for wonder, jarred by harshness',
      line: 'Your system reaches for imagination when reality turns too sharp.',
      sub: 'The sensitivity is a gift — it just makes the hard edges harder.',
      reorientation: '"Stay one moment longer in the real. The wonder travels with you."',
      nervousSystem: 'Sensory-expansive / dissociative drift',
      nervousSystemDesc: `A system that finds harsh reality genuinely overwhelming learns to drift — into imagination, into fantasy, into the next idea — as a way to soften the edges. The cost is a loose grip on the practical and the present. The reorientation is gentle re-anchoring: naming five real things you can see, feeling your feet on the floor, staying inside one ordinary moment long enough to discover it can hold wonder too.`,
    },
  },
}
