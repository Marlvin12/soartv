// ─────────────────────────────────────────────────────────────────────────────
// FilmFlow7 — Conversational Resonance Entry
// A multi-turn guided experience: the user describes how they're arriving,
// a keyword engine detects their resonance signature, and the system mirrors
// it back with a first reflection, a follow-up question, and a second
// reflection before handing off to the poster survey.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeId } from '@/lib/archetypes'
import { ARCHETYPE_ORDER } from '@/lib/archetypes'

// The opening prompt the experience leads with.
export const ENTRY_QUESTION = 'How are you arriving tonight?'

// ─── Keyword signatures ────────────────────────────────────────────────────────
// Each archetype carries words that tend to surface when someone is living in
// its frequency. Detection counts how many land in the user's free text.

export const ARCHETYPE_KEYWORDS: Record<ArchetypeId, string[]> = {
  hiddenOne: [
    'tired', 'numb', 'alone', 'withdrawn', 'invisible', 'quiet', 'empty', 'exhausted',
    'shutdown', 'disappear', 'hollow', 'fading', 'hiding', 'absent', 'detached',
    'foggy', 'flat', 'unseen', 'small', 'silent', 'vanish', 'retreating', 'checked out',
  ],
  performer: [
    'pressure', 'successful', 'perfect', 'productive', 'prove', 'achievement', 'anxious',
    'behind', 'performing', 'expectations', 'accomplish', 'failing', 'standard', 'measure',
    'output', 'hustle', 'deadline', 'not enough', 'falling short', 'overachieve', 'worth', 'succeed',
  ],
  seeker: [
    'lost', 'searching', 'confused', 'meaning', 'direction', 'restless', 'wandering',
    'purpose', 'unclear', 'uncertain', 'stuck', 'aimless', 'questioning', 'wondering',
    'drifting', 'in between', 'no idea', "don't know", "what's next", 'nothing feels right', 'transition',
  ],
  giver: [
    'drained', 'everyone', 'helping', 'responsible', 'overwhelmed', 'needed',
    'last', 'others', 'giving', 'depleted', 'caretaking', 'putting others first',
    'no one asks', 'always there', 'martyred', 'selfless', 'forgotten', 'taken for granted', 'burnout',
  ],
  protector: [
    'guarded', 'safe', 'control', 'prepared', 'watchful', 'defensive',
    'trust', 'wary', 'careful', 'walls', 'alert', 'on edge', 'scanning',
    'suspicious', 'hypervigilant', "can't relax", 'ready', 'armor', 'closed off', "won't let people in",
  ],
  shapeshifter: [
    'fit in', 'accepted', 'adapt', 'mask', 'different', 'belong',
    'blend', 'adjust', 'people', 'please', 'chameleon', 'pretending', 'performing',
    'fake', 'not myself', 'people-pleasing', 'approval', 'what they want', 'wear a mask', 'code switch',
  ],
  warrior: [
    'fight', 'driven', 'strong', 'push', 'focused', 'intense', 'angry',
    'grind', 'force', 'resist', 'stubborn', 'determined', "won't stop", 'rage',
    'frustration', 'power through', 'keep going', "won't give up", 'fired up', 'clench',
  ],
  dreamer: [
    'escape', 'dreaming', 'fantasy', 'avoid', 'float', 'disconnected',
    'imagine', 'somewhere', 'away', 'drift', 'zone out', 'checked out', 'not here',
    'elsewhere', 'in my head', 'wish it was different', 'another world', 'not present', 'spacing out',
  ],
}

// ─── First reflections ─────────────────────────────────────────────────────────
// Mirrored back immediately after detection.

export const FIRST_REFLECTIONS: Record<ArchetypeId, string[]> = {
  hiddenOne: [
    "It feels like part of you has been carrying more than you've expressed — not because you chose silence, but because there hasn't been space to put it down. The exhaustion you're describing isn't just physical. It's the weight of being present for everything while something in you quietly asks to be seen.",
    "There's a kind of tiredness that sleep doesn't fix — and it sounds like you might be in that. When someone has been invisible for long enough, the body starts to conserve energy by going quiet. That numbing isn't weakness. It's your system doing what it can to get through.",
    "Something in you seems to have withdrawn to a place that feels safer than fully showing up. That's not shutdown — it's protection. The part of you that's gone quiet is still there, still listening. It's just waiting for a signal that it's finally safe to surface.",
  ],
  performer: [
    "There's a pressure to keep moving, even when your system is asking for rest. Something in you has learned to measure worth through output — through finishing, achieving, being enough. That standard can become invisible, and yet it shapes almost every moment. Your nervous system may be running harder than the situation actually requires.",
    "The part of you that's anxious right now might not actually be afraid of failing — it might be afraid of what happens if you slow down. Performers often discover that the stillness is what feels threatening. The doing is a way of staying one step ahead of something that hasn't been looked at yet.",
    "You've been running on a standard that probably wasn't yours to begin with. Somewhere along the way, worth got tied to output, and rest started to feel like a risk. What your system might actually be asking for tonight isn't more productivity — it's permission to exist without having to produce anything.",
  ],
  seeker: [
    "Your energy feels like it's reaching for something it can't fully name yet. There's a restlessness underneath — not chaos, but a kind of readiness that hasn't found its direction. Part of you may be craving meaning more than stimulation tonight, clarity more than distraction.",
    "Being lost doesn't always mean you've gone the wrong way — sometimes it means you've outgrown a map that no longer fits the territory. What feels like confusion might actually be the disorientation that comes just before a new direction becomes clear. Your system is still orienting. That takes time.",
    "There's something searching in you that hasn't found its footing yet. That restlessness can feel like a problem to solve, but it might actually be a signal — something in you knows that where you've been isn't where you're headed. The in-between is uncomfortable. It's also where everything shifts.",
  ],
  giver: [
    "You may have spent so much energy holding space for others that you haven't fully checked in with yourself. Your system feels emotionally extended — like you've been giving from a place that needed refilling a while ago. The care you offer others is real, but it may be running ahead of what you have available right now.",
    "When you spend most of your energy making sure everyone else is okay, there's often a quiet grief underneath — because no one is doing the same for you. You're not drained because you're weak. You're drained because you've been giving consistently from a reservoir that never got replenished.",
    "The depletion you're feeling isn't just tiredness — it's what happens when someone has been in service for so long that they've forgotten what it feels like to just receive. Part of you might be afraid that if you stop giving, you stop mattering. That's the lie that keeps the cycle going.",
  ],
  protector: [
    "Part of your system still feels alert, even if the moment around you is safe. There's a vigilance that's become so familiar it no longer feels like vigilance — it just feels like how you move through the world. Underneath that watchfulness is a real need for stability, for something that doesn't require you to stay ready.",
    "Being guarded made sense at some point — your system learned that staying alert kept things from falling apart. But vigilance is expensive, and carrying it full-time has a cost. Part of what might be exhausting you isn't the threats — it's the continuous effort of watching for them.",
    "There's a kind of loneliness that comes with always being the one who has to hold it together. When you can't let your guard down, real connection becomes harder — because real connection requires some version of trust, and trust has felt like a liability. Your system learned this for good reasons. That doesn't mean it has to stay this way.",
  ],
  shapeshifter: [
    "It feels like you've been adapting to everyone else's energy for a while — reading the room, adjusting, making yourself fit. That skill is real, but it has a cost. Part of you may be craving a space where you don't have to perform belonging, where being exactly as you are is already enough.",
    "When you've spent a long time making yourself acceptable to different rooms, you can lose track of which version of you is actually yours. The adapting happens so automatically it becomes invisible — until you're alone and you realize you're not sure what you actually want or feel, separate from what you sensed everyone else needed.",
    "There's an exhaustion that comes specifically from being good at becoming what people need. You read environments fast, you adjust, you fit — and it works. But underneath that capability is usually a question that doesn't get answered: does anyone know who I actually am when I'm not performing belonging?",
  ],
  warrior: [
    "Your energy still feels mobilized — like something inside refuses to fully stand down. There's a drive in you that's real and powerful, but it can run so hot that the exhaustion underneath gets overlooked. The intensity you're carrying may have been protective at some point. The question now is whether it's still serving you, or whether it's become the default.",
    "There's a kind of tension in you that's built up from not fully releasing. The Warrior mode is real and capable — but it's also always on, always bracing, always ready to fight something. At some point the body stops distinguishing between what needs fighting and what just needs rest.",
    "The frustration or intensity you're feeling isn't irrational — it's energy that's been gathering with nowhere clean to go. Something in you wants to push through, to force a resolution, to not let this beat you. That strength is real. The cost of it, though, is also real — and it tends to land in the body before it lands anywhere else.",
  ],
  dreamer: [
    "Part of you may want distance from reality more than entertainment tonight. There's a longing in you for something softer — a world, a feeling, a story that doesn't demand you be practical or present in the way everything else does. Your system may be searching for permission to just exist for a moment without it meaning something.",
    "When the present feels like too much, the mind goes somewhere else. That drift isn't laziness — it's a signal that your nervous system needs a different kind of input. You're not avoiding life. You're looking for a version of it that doesn't cost as much to inhabit right now.",
    "There's a part of you that lives in possibility more than in what's in front of you — and that part is probably exhausted by how concrete and demanding everything has felt lately. The desire to float, to be elsewhere, to imagine a different world isn't a flaw. It's your mind asking for softness in a way that logic can't deliver.",
  ],
}

// ─── Follow-up questions ───────────────────────────────────────────────────────
// One reflective question per archetype. The answer deepens the experience —
// it is not scored.

export const FOLLOW_UP_QUESTIONS: Record<ArchetypeId, string> = {
  hiddenOne:    "If you could point to where that exhaustion lives in your body right now — where would you place your hand?",
  performer:    "Where do you actually feel that pressure in your body? Not the thought of it — the physical sensation.",
  seeker:       "Somewhere in your body, there's a signal that knows what it's searching for. Where do you feel that restlessness most?",
  giver:        "That kind of depletion always lands somewhere physically. What part of your body feels it most right now?",
  protector:    "When you're in that guarded state, where does your body hold it? Jaw, chest, shoulders — what's bracing?",
  shapeshifter: "Adapting that much takes a physical toll. Where in your body do you feel the cost of it right now?",
  warrior:      "That intensity has to live somewhere in the body. Where do you feel it most — chest, jaw, gut, somewhere else?",
  dreamer:      "When you want to drift or disappear, does your body feel heavy, light, numb — what's the physical texture of it?",
}

// ─── Second reflections ────────────────────────────────────────────────────────
// Closes the conversation before the transition into the survey.

export const SECOND_REFLECTIONS: Record<ArchetypeId, string[]> = {
  hiddenOne: [
    "Your system may be asking for softness more than isolation tonight. Sometimes the withdrawal that feels protective is actually the body's way of asking for a different kind of connection — one that doesn't require you to perform okayness. What you need may not be more space. It may be a story that meets you exactly where you are.",
    "The place in your body that's holding this has probably been holding it for longer than today. That kind of carried weight doesn't dissolve with logic — it needs something that speaks the same language: sensation, story, feeling. Let the body lead for a moment.",
    "Whatever you're feeling physically right now is your system trying to communicate something it doesn't have words for yet. That's not a problem. It's an invitation to stop translating and just feel what's actually there — even briefly, even imperfectly.",
  ],
  performer: [
    "You may not need to earn rest as much as your system has come to believe. There's a difference between a moment of stillness and falling behind — even if they feel the same. Part of what you might need tonight isn't more input. It's something that gives you permission to just receive, without it requiring anything back.",
    "The body location you're feeling this in carries the whole story. That's where the performance lives, where the pressure collects, where the system tries to hold everything together. Noticing it is already something. You don't have to fix it tonight.",
    "When pressure lives in the body for long enough, it stops feeling optional — it just feels like you. But that sensation isn't who you are. It's what your system learned to do when the stakes felt high. It can learn something else, slowly, when the stakes feel lower.",
  ],
  seeker: [
    "Sometimes clarity comes not from searching harder, but from letting the nervous system settle long enough to hear what's already there. The answer you're looking for may not be far away — it may just be underneath the noise. Tonight might be less about finding direction and more about creating the conditions where it can surface.",
    "The body sensation you described is your compass — even if it doesn't feel like one. Restlessness isn't random. It's directional. It's pointing toward something your mind hasn't caught up to yet. Trust it enough to stay with it a moment longer.",
    "The searching feeling lives in the body before it becomes a thought. You already know more than your mind is ready to articulate. The stillness you probably resist is exactly where the signal gets clearer.",
  ],
  giver: [
    "Part of what restores a giving nature isn't more giving — it's being allowed to exist beyond usefulness for a moment. Your system may need something tonight that asks nothing of you. No one to take care of, no role to fulfill. Just the experience of receiving something — a story, a feeling, a reminder that you matter when you're not in service.",
    "The part of your body that's carrying the depletion has been doing so quietly, without complaint. It's been holding what you haven't had time to feel. It deserves the same care you extend to everyone else — even just a moment of it.",
    "Depletion at this level isn't just tired — it's your body telling you that the outflow has been exceeding the inflow for a while now. What you need tonight isn't to solve that. It's just to receive something without having to give anything back in return.",
  ],
  protector: [
    "Your system may be craving safety that doesn't require constant vigilance to maintain. There's a version of rest that feels dangerous to a Protector — because letting the guard down has historically come with a cost. But some stories offer a space where the watching can pause. Where the plot holds the tension, so you don't have to.",
    "The bracing you're feeling in your body is your system doing its job — preparing for something that may or may not come. It's not wrong to be ready. The question is whether your body can tell the difference between real threat and familiar habit. Often it can't, not without help.",
    "Somewhere in your body, the guard is up. It's been up for a while. Even if you can't fully lower it tonight, you can acknowledge what it's been protecting — and let that part of you know that the watching, for just this moment, can pause.",
  ],
  shapeshifter: [
    "There may be a deeper desire underneath the adapting — a wish to be known without having to perform it. To be in a space where your edges don't need softening and your presence doesn't need to be justified. The right story tonight might be one where a character is allowed to be complicated, unresolved, and fully themselves anyway.",
    "The cost of constant adapting lives in the body — in the places that brace, compress, or go quiet when you're performing fit. That tension has been accumulating. It doesn't need a solution tonight. It just needs to be acknowledged as real.",
    "Somewhere in your body is the version of you that doesn't have to adjust for anyone. It's still there — it's just rarely given airtime. What you feel physically right now might be where that version of you has been waiting.",
  ],
  warrior: [
    "Strength and exhaustion often coexist longer than people realize — and the Warrior is often the last to acknowledge the weight they're carrying. There may be something in you tonight that wants to witness intensity without having to be the one producing it. A story where the fight is held by someone else, and you can finally just watch.",
    "The tension you're holding in your body is real energy — it's not imaginary, it's not dramatic. It's stored activation looking for a direction. Sometimes the direction isn't forward. Sometimes it's just down — into the ground, through the breath, out of the jaw.",
    "Warriors often confuse releasing with losing. But what your body is signaling right now isn't weakness — it's a completion instinct. Something in you has been bracing for long enough. It doesn't want to fight tonight. It wants to finally finish the cycle.",
  ],
  dreamer: [
    "Part of you may be searching for a reality that feels emotionally safer to stay present in — not escapism, but a gentler version of now. What your system might need is immersion in something imaginative and expansive, where the rules of the present don't apply and the ordinary weight of things lifts, even briefly. That's not avoidance. That's restoration.",
    "The physical texture you described — the heaviness, the lightness, the numbness — is your body's way of telling you it needs to go somewhere softer. Not to escape permanently. Just to breathe somewhere that doesn't require so much effort to stay present in.",
    "When the body floats or goes heavy or feels elsewhere, it's often asking for something that the waking world isn't currently providing: ease, imagination, the sense that reality is permitted to be more than what it currently is. Give it that tonight.",
  ],
}

// ─── Detection ─────────────────────────────────────────────────────────────────

export interface DetectionResult {
  archetype: ArchetypeId
  scores:    Record<ArchetypeId, number>
  matched:   boolean   // false when no keyword landed and we fell back
}

// Counts keyword hits in the user's free text. Highest count wins; ties resolve
// by ARCHETYPE_ORDER. Falls back to 'seeker' when nothing matches — the Seeker
// is, fittingly, the archetype of not-yet-knowing.
export function detectArchetype(userInput: string): DetectionResult {
  const text = ` ${userInput.toLowerCase().replace(/\s+/g, ' ')} `

  const scores = {} as Record<ArchetypeId, number>
  ARCHETYPE_ORDER.forEach(id => { scores[id] = 0 })

  for (const id of ARCHETYPE_ORDER) {
    for (const kw of ARCHETYPE_KEYWORDS[id]) {
      // word-boundary match so "alone" doesn't fire inside "malone"
      const re = new RegExp(`(?:^|[^a-z])${escapeRegex(kw)}(?:[^a-z]|$)`, 'i')
      if (re.test(text)) scores[id] += 1
    }
  }

  let best: ArchetypeId = ARCHETYPE_ORDER[0]
  for (const id of ARCHETYPE_ORDER) {
    if (scores[id] > scores[best]) best = id
  }

  const matched = scores[best] > 0
  return { archetype: matched ? best : 'seeker', scores, matched }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Picks one reflection from a pool.
export function pickReflection(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Body-led detection path ───────────────────────────────────────────────────
// When the user names a body area on Turn 1 ("my chest is tight", "my head won't
// stop"), the experience pivots: instead of mirroring an archetype, it mirrors
// the body. The archetype gets resolved on Turn 2 from the second answer, and
// the body's somatic line gets folded into the second reflection. The body-area
// keys here align with `lib/body-resonance.ts` `BODY_RESONANCE`.

import type { BodyArea } from '@/lib/body-resonance'

export const BODY_LED_FIRST_REFLECTIONS: Record<string, string[]> = {
  chest: [
    "Your chest is where your nervous system decides whether it's safe to open up. Something in you is reaching forward — toward connection, toward change — while another part is pulling back to check if the risk is worth it. That isn't conflict. That's what it feels like to be on the edge of something real.",
    "There's a tightening in the chest that happens when the body is caught between expansion and protection. You want to open toward something, and simultaneously your system is checking whether it's safe to do so. Both impulses are intelligent. They're just not in agreement yet.",
  ],
  shoulders: [
    "Your shoulders are where the body pre-loads responsibility — bracing for demands that may not even exist yet. What you're carrying isn't always what's actually in front of you. Sometimes it's everything that could go wrong, everything you're accountable for, everything that hasn't happened but already feels inevitable.",
    "The body stores anticipated load in the shoulders before the load arrives. Something in your world has you bracing — carrying weight that belongs to a future moment you're already preparing for. That kind of anticipatory tension is exhausting in a way that's hard to explain to someone who hasn't felt it.",
  ],
  head: [
    "When the body doesn't feel fully safe, it sends everything upward into thinking — as if controlling the picture in your mind can control what happens in reality. Your mind is probably running faster than your body can follow right now. The more the head races, the more distant everything else can feel.",
    "There's a quality to mental overload that's different from ordinary thinking — it's more like surveillance. The mind starts monitoring everything, running simulations, catching possibilities before they arrive. That kind of thinking isn't clarity. It's vigilance wearing the costume of clarity.",
  ],
  heart: [
    "Your heart area is where the body holds the tension between wanting to show up fully and being afraid of what that costs. Something in you is reaching toward someone or something — and simultaneously, part of you is holding back to see if it's safe first. Both are happening at the same time.",
    "The heart area holds what the body knows but hasn't decided whether to trust. There's something opening in you — or wanting to — and your system is running a background check on whether it's worth the exposure. Courage isn't the absence of that hesitation. It's moving anyway.",
  ],
  solar_plexus: [
    "Your gut is where instinct lives — and where it gets overridden. There's a signal in you that's been clear about something for longer than your mind has been willing to acknowledge. That pressure in your stomach isn't anxiety without cause. It's information that hasn't been acted on yet.",
    "The solar plexus holds decisions that haven't been made. Something in your situation has been generating a strong internal signal — and part of you has been containing it, managing it, keeping it just below the level of action. Your gut already knows. The question is what you're going to do with that.",
  ],
  whole_body: [
    "When sensation spreads across the whole body — buzzing, heaviness, restlessness, aliveness — the nervous system is broadcasting at full volume. Something has activated your entire system at once. That isn't dysfunction. That's your body insisting on being heard.",
    "Full-body sensation is your nervous system trying to complete something. Whether it's tension that's been building, energy that needs to move, or feeling that's been suppressed — the body is asking for a channel. What you're feeling right now isn't too much. It's information at scale.",
  ],
  throat: [
    "Your throat is where expression meets suppression. Something in you is ready to be said — a truth, a need, a feeling — and your body is holding it at the threshold, waiting to see if the moment is safe enough. That tightness isn't failure. It's something important trying to find its way out.",
    "The throat holds what the voice hasn't released. There's something in you that wants to be spoken — not necessarily to anyone in particular, just out into the air where it can stop taking up internal space. The pressure you're feeling is stored expression looking for a channel.",
  ],
  hips: [
    "Your hips carry what the body prepared for but never got to finish. The deep muscle connecting your spine to your legs activates every time you brace for something — and in modern life, it rarely gets to complete the action it started. What's held there isn't weakness. It's stored readiness.",
    "Stored energy lives in the hips — readiness that has nowhere to go. Something in your situation has your body prepared for movement, for action, for a change that hasn't happened yet. That tension isn't stuck. It's gathered. It's waiting for permission to move.",
  ],
  arms: [
    "Your arms and hands are where the body's impulse to act lives — to reach, to push back, to create, to protect. When that impulse fires and nothing completes the movement, the energy stays in the tissue. What you're holding in your arms right now is stored action looking for a direction.",
    "Arms carry the body's unfinished responses. Something activated the impulse to act — to do something, change something, stop something — and that impulse is still live in your tissues. The tension you're feeling isn't passive. It's mobilized energy that hasn't found its completion.",
  ],
  spine: [
    "Your spine carries the body's core sense of direction — and when it's activated, it often means something in you is oriented toward something larger than the immediate moment. There's a pull in you toward meaning, toward purpose, toward a story that actually matters.",
    "The spine holds your sense of vertical alignment — not just posture, but orientation. Something in you is feeling the pull of a direction, a mission, or a next step that hasn't fully clarified yet. That energy isn't restlessness. It's momentum that hasn't found its form.",
  ],
  upper_back: [
    "The upper back holds the weight of being seen while still working — the tension of maintaining form under observation. Something in your life has you bracing against external evaluation, even if you can't name exactly who or what is doing the watching.",
    "Between the shoulder blades is where effort lives when it has to look a certain way from the outside. You're carrying the weight of performance — not just doing the work, but doing it while being measured. That's a different kind of load, and the body knows it.",
  ],
  feet: [
    "Your feet are where the body's search for solid ground lives. When they're tense or unsettled, the nervous system is still looking for something stable to land on — a foundation that hasn't fully arrived yet. That search extends well beyond the physical.",
    "Tension in the feet means the body mobilized for movement — toward something, away from something — and that movement never fully completed. You've been poised at the edge of a step that keeps getting deferred.",
  ],
  default: [
    "Something in your body is speaking — and it's worth listening to. Physical sensation is the body's earliest language, more honest than the stories the mind builds around it. What you're feeling right now isn't separate from what you're carrying emotionally. They're the same signal in different registers.",
  ],
}

export const BODY_LED_FOLLOWUP_QUESTIONS: Record<string, string> = {
  chest:        "What's been opening in your life recently that part of you is still deciding whether to trust?",
  shoulders:    "What responsibility have you been carrying that might not actually be yours to hold?",
  head:         "What has your mind been running on repeat that your gut already has an answer for?",
  heart:        "What are you not letting yourself fully feel — or not saying — that you already know is true?",
  solar_plexus: "What has your gut been telling you that you've been overriding with logic?",
  whole_body:   "When everything in you is activated like that — what is it building around? What's at the center of it?",
  throat:       "What's been waiting to be said — to someone, or just to yourself?",
  hips:         "What have you been ready to do, or move toward, that keeps getting stopped?",
  arms:         "What were you reaching for, or pushing against, that brought you here?",
  spine:        "What would it mean for you to be fully aligned with what you're actually here for right now?",
  upper_back:   "What have you been holding together that you're not sure you can keep holding?",
  feet:         "What would it mean for you to feel truly grounded right now — what would that change?",
  default:      "What's been pressing on your life recently that you haven't fully named yet?",
}

export interface Turn1Result {
  detectionMode:    'body' | 'archetype'
  firstReflection:  string
  followUpQ:        string
  archetype?:       ArchetypeId  // set in archetype-led mode; resolved on Turn 2 for body-led
  bodyAreaKey?:     string       // set in body-led mode
}

/**
 * Decide which path to mirror back on Turn 1. If the user named a body area in
 * Turn 1, body-led wins; otherwise we fall through to the archetype matcher.
 */
export function runTurn1(
  raw:            string,
  bodyAreaResult: { key: string } | null,
): Turn1Result {
  if (bodyAreaResult) {
    const key  = bodyAreaResult.key
    const pool = BODY_LED_FIRST_REFLECTIONS[key] ?? BODY_LED_FIRST_REFLECTIONS.default
    return {
      detectionMode:   'body',
      firstReflection: pickReflection(pool),
      followUpQ:       BODY_LED_FOLLOWUP_QUESTIONS[key] ?? BODY_LED_FOLLOWUP_QUESTIONS.default,
      bodyAreaKey:     key,
    }
  }

  const { archetype } = detectArchetype(raw)
  return {
    detectionMode:   'archetype',
    firstReflection: pickReflection(FIRST_REFLECTIONS[archetype]),
    followUpQ:       FOLLOW_UP_QUESTIONS[archetype],
    archetype,
  }
}

/**
 * Build the Turn-2 closing reflection. Optionally enriches with a somatic line
 * from the matched body area — `.reorientation` when the user came in body-led
 * (anchors the next-step shift) and `.interpretation[0]` when they came in
 * archetype-led (mirrors back what the body is doing).
 */
export function getSecondReflection(
  archetype: ArchetypeId,
  bodyArea:  BodyArea | null,
  mode:      'body' | 'archetype' = 'archetype',
): string {
  const pool = SECOND_REFLECTIONS[archetype] ?? SECOND_REFLECTIONS.seeker
  const base = pickReflection(pool)
  if (!bodyArea) return base
  const somaticLine = mode === 'body'
    ? bodyArea.resonance.reorientation
    : bodyArea.resonance.interpretation[0]
  return `${base} ${somaticLine}`
}

// Quick-tap chips for the arrival input — common entry words that map cleanly.
export const ARRIVAL_CHIPS = [
  'tired', 'anxious', 'numb', 'restless',
  'drained', 'searching', 'guarded', 'driven',
]
