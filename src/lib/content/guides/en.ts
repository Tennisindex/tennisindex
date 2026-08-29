// ============================================================
// TennisIndex — Guide content (English)
// ============================================================
// Same structure as de.ts (identical slugs, section IDs, category/
// difficulty/relatedSlugs), only the text differs — see guides.test.ts
// for the parity checks this file must satisfy.

import type { GuideArticle } from '../../guides';

export const GUIDES_EN: GuideArticle[] = [
	// ------------------------------------------------------------
	// RULES & KNOWLEDGE
	// ------------------------------------------------------------
	{
		slug: 'tennis-regeln',
		title: 'Tennis Rules Explained: The Complete Guide for Beginners',
		metaTitle: 'Tennis Rules Explained: The Complete Guide for Beginners',
		metaDescription:
			'The most important tennis rules explained simply: serving, scoring, the out line, lets, and common match situations.',
		excerpt:
			'Serving, scoring, and line calls — everything you need to know before your first match, explained clearly.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 9,
		updatedAt: '2026-08-01',
		popular: true,
		beginnerRecommended: true,
		relatedSlugs: ['tennis-begriffe', 'tennis-fuer-anfaenger', 'tennis-einzel-doppel', 'tennis-doppel'],
		sections: [
			{
				id: 'was-ist-tennis',
				heading: 'What is tennis?',
				paragraphs: [
					'Tennis is a racket sport played either as singles (1 vs. 1) or doubles (2 vs. 2). It is played on a rectangular court divided in half by a net — on clay, hard court, or grass.',
					'The goal is to hit the ball over the net so it lands inside the opponent\'s side of the court and they cannot return it legally. Unlike some other racket sports, there are no walls or fences that stay in play — the ball is out as soon as it lands outside the lines.',
					'Players use a strung racket, and the ball is a felt-covered, air-filled rubber ball. For children and complete beginners, slower foam and low-pressure felt balls exist as well (red/orange/green stages before the "normal" yellow ball).'
				]
			},
			{
				id: 'spielfeld-und-grundprinzip',
				heading: 'Court and basic principle',
				paragraphs: [
					'A tennis court is 8.23 m (27 ft) wide and 23.77 m (78 ft) long for singles. Doubles adds an extra 1.37 m (4.5 ft) strip ("alley") on each side, which doesn\'t count in singles. The net is slightly higher at the posts (1.07 m) than in the middle (0.914 m).',
					'Each side of the court has two service boxes directly behind the net (left and right), with the rest of the court behind them for the remaining rally.',
					'Basic principle: after each shot, the ball must land inside the lines on the opponent\'s side. It may then bounce exactly once before the other side returns it — a second bounce ends the point. Hitting the ball out of the air before it bounces (a volley) is allowed at any time.'
				]
			},
			{
				id: 'zaehlweise',
				heading: 'How tennis is scored',
				paragraphs: [
					'Within a game, points are counted 15, 30, 40, and game. At 40-40, this is called deuce — after that, a side must win two points in a row to take the game (the first of those two points is called advantage).',
					'Many recreational and some league matches play a "no-ad" deciding point at deuce instead: whoever wins the next point takes the game outright — this is usually agreed beforehand.',
					'Winning six games (with a margin of at least two) wins a set. At 6-6, a tiebreak usually decides the set: points are counted 1, 2, 3 and so on, won with at least 7 points and a two-point margin. A match is typically best of three sets; many amateur leagues play a 10-point match tiebreak instead of a full third set to save time.'
				]
			},
			{
				id: 'aufschlag-regeln',
				heading: 'Serving rules',
				paragraphs: [
					'The serve is hit overhand: you toss the ball up and strike it before it bounces, aiming diagonally into the opponent\'s service box. You must stand behind the baseline and may not touch or step over it before contact (a foot fault).',
					'Each point starts alternately from the right side (on an even score) and the left side (on an odd score). The serve switches to the other side after each game, and in doubles, partners alternate serving within their team.',
					'If the first serve doesn\'t land in, you get a second attempt. If that one misses too, it\'s a double fault and the point goes to the other side. If the serve clips the net cord and still lands correctly in the box, it\'s a "let" — the serve is replayed and doesn\'t count.'
				]
			},
			{
				id: 'aus-und-linien',
				heading: 'When is the ball out?',
				paragraphs: [
					'A line belongs to the court: if the ball touches any part of the line, it counts as "in". Only when it lands entirely outside all lines is it out.',
					'For regular shots, the full court width including the alleys only counts in doubles — in singles, the outer alleys are not valid court. For the serve, only the diagonal service box counts, regardless of format.',
					'If the ball bounces twice before being returned, the point is also over — no matter where that second bounce happens.'
				]
			},
			{
				id: 'let-und-stoerungen',
				heading: 'Lets, net touches, and interruptions',
				paragraphs: [
					'A "let" means the point doesn\'t count and is replayed. This classically happens when a serve clips the net cord and still lands correctly in the service box — or when a genuine outside interruption occurs during a rally (e.g. a ball rolling in from a neighboring court).',
					'If a ball touches the net during a normal rally (not the serve) and then lands legally in the opponent\'s court, it stays in play — that\'s not a let, just a completely normal, valid shot.'
				]
			},
			{
				id: 'anfaengerfehler',
				heading: 'Common beginner mistakes',
				box: {
					kind: 'mistakes',
					title: 'You\'ll see these in almost every beginner match',
					items: [
						'Stepping over the baseline on the serve (a foot fault), often unnoticed.',
						'Losing track of the score, especially around deuce and advantage.',
						'Trying to play a ball that has already bounced twice.',
						'Swinging as hard as possible out of nerves, instead of playing safely into the court first.',
						'In doubles, not agreeing on who covers the net and who stays back — leaving balls in the middle unplayed.'
					]
				}
			},
			{
				id: 'checkliste',
				heading: 'Quick rules checklist',
				box: {
					kind: 'checklist',
					title: 'Before your first match',
					items: [
						'Serve overhand, from behind the baseline, diagonally into the correct service box.',
						'The ball may only bounce once before being returned.',
						'Scoring: 15, 30, 40, game — deuce at 40-40, then a two-point margin is needed (unless playing no-ad).',
						'The line belongs to the court — a ball on the line is in, not out.',
						'Volleys are allowed at any time, as long as the ball hasn\'t bounced yet and you\'re not standing in the opponent\'s court.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Is tennis hard to learn?',
				answer:
					'The basic rules can be understood in a few minutes, and simple rallies usually start working after a few practice sessions. Consistency, footwork, and tactics develop over months instead — typical for a sport with a low entry barrier but a lot of depth beyond that.'
			},
			{
				question: 'What happens at deuce?',
				answer:
					'At 40-40, a side must win two points in a row to take the game. The first of those two points is called advantage — winning the next point too ends the game, otherwise it\'s back to deuce. Some recreational matches play no-ad instead: a single deciding point.'
			},
			{
				question: 'Does a ball on the line count as out?',
				answer:
					'No — quite the opposite: if the ball touches the line at any point, it counts as in. It\'s only out once it lands completely outside all the court lines.'
			},
			{
				question: 'How many sets are usually played?',
				answer:
					'In amateur and league play, usually best of three sets, with many leagues playing a 10-point match tiebreak instead of a full third set to save time. At the professional level, some tournaments (mainly men\'s Grand Slams) also play best of five.'
			}
		]
	},
	{
		slug: 'tennis-einzel-doppel',
		title: 'Tennis Singles vs. Doubles: The Key Differences',
		metaTitle: 'Tennis Singles vs. Doubles: The Key Differences Explained Simply',
		metaDescription:
			'What really sets singles and doubles apart in tennis — court, tactics, serving, and which format suits you.',
		excerpt:
			'Same sport, two very different games: here\'s how singles and doubles differ in court, tactics, and pace.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-doppel', 'tennis-taktik'],
		sections: [
			{
				id: 'ueberblick',
				heading: 'Two formats, one sport',
				paragraphs: [
					'The basic rules — scoring, serving, the underlying out-of-bounds principle — are identical for singles and doubles. Still, both formats play very differently: in singles you cover the whole court alone, in doubles you share the court and the responsibility with a partner.',
					'TennisIndex keeps a separate, independent rating for each format — your singles level doesn\'t necessarily say anything about your doubles level, and vice versa. Many players are noticeably stronger in one format than the other.'
				]
			},
			{
				id: 'spielfeldgroesse',
				heading: 'Court size: with or without alleys',
				paragraphs: [
					'The court itself is the same size for both formats, but in doubles the two outer alleys (1.37 m each) count as valid court too — so the playable width is wider in doubles. Nothing changes for the serve, though: the service box is identical in both formats.',
					'In singles, the narrower playable width means more running for you alone, but also clearer responsibility — every mistake and every good point is unambiguously yours.'
				]
			},
			{
				id: 'taktik-unterschiede',
				heading: 'Tactics: legwork vs. net positioning',
				paragraphs: [
					'Singles revolves a lot around baseline play, stamina, and the ability to move your opponent around the court — points are often built up over several shots.',
					'Doubles is decided more often by net position: a team that gets to the net early and confidently has more chances at short, high-pressure points. Communicating with your partner (who takes which ball, who covers the middle) becomes almost as important as stroke technique itself.'
				]
			},
			{
				id: 'aufschlag-unterschiede',
				heading: 'Serving and returning',
				paragraphs: [
					'In singles, you serve every other point yourself and then have to defend the whole court alone afterward. In doubles, both partners alternate serving within a game, and the server often moves straight to the net after serving, while their partner is usually already there.'
				]
			},
			{
				id: 'was-passt-zu-dir',
				heading: 'Which one suits you?',
				paragraphs: [
					'If you like running, long rallies, and playing independently, singles will likely appeal more. If you enjoy tactical teamwork, shorter points, and more social play, doubles is often the better fit — many players simply play both, depending on mood and who\'s available.'
				]
			}
		],
		faq: [
			{
				question: 'Is doubles easier than singles?',
				answer:
					'Not necessarily easier, just differently demanding: you cover less distance, but need to react faster, play closer to the net, and constantly coordinate with your partner.'
			},
			{
				question: 'Is doubles scored the same way as singles?',
				answer:
					'Yes, points, games, and sets are counted identically. The only structural difference is that within a team, the serve alternates between partners.'
			},
			{
				question: 'Do I need a fixed doubles partner?',
				answer:
					'No — many clubs and the TennisIndex match search help you find suitable doubles partners spontaneously. An established team has a communication advantage, but newly paired partnerships work well too.'
			}
		]
	},
	{
		slug: 'tennis-begriffe',
		title: 'Tennis Terms Explained: Ace, Break, Slice, Volley and More',
		metaTitle: 'Tennis Terms Explained: The Big Glossary for Beginners',
		metaDescription:
			'The most important tennis terms explained simply: ace, break, slice, volley, drop shot, passing shot and more.',
		excerpt:
			'Ace, break, slice, drop shot — a compact glossary of the most important tennis terms for beginners.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 5,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-technik', 'tennis-taktik'],
		sections: [
			{
				id: 'einleitung',
				heading: 'Why a glossary?',
				paragraphs: [
					'At your first club session or while watching a match, terms like ace, break, or unforced error come up quickly and mean little without explanation. This glossary collects the most important ones in one place so you can look them up fast.'
				]
			},
			{
				id: 'die-wichtigsten-begriffe',
				heading: 'The most important terms at a glance',
				box: {
					kind: 'info',
					title: 'From A to V',
					items: [
						'Ace: A serve the opponent doesn\'t even touch — an outright point.',
						'Break: Winning your opponent\'s service game.',
						'Deuce: A score of 40-40 within a game.',
						'Double fault: Both serve attempts miss — point goes to the other side.',
						'Baseline: The back boundary line of the court, where you serve from.',
						'Let: The point is replayed, usually because the serve clipped the net cord.',
						'Lob: A high ball hit over an opponent, often one standing at the net.',
						'Passing shot: A ball hit past a player standing at the net.',
						'Return: The first shot after the opponent\'s serve.',
						'Slice: A shot hit with backspin, making the ball fly flatter and bounce lower.',
						'Drop shot: A short, softly hit ball landing just past the net.',
						'Tiebreak: The decider at a 6-6 set score, counted in individual points.',
						'Topspin: A shot hit with forward spin, making the ball bounce higher and faster after landing.',
						'Unforced error: An avoidable mistake made without noticeable pressure from the opponent.',
						'Volley: Hitting the ball directly out of the air before it bounces.'
					]
				}
			},
			{
				id: 'begriffe-rund-ums-match',
				heading: 'Match-related terms',
				paragraphs: [
					'"Losing serve" means losing your own service game — more common among amateurs than professionals, where holding serve is usually considered a clear advantage. A "comeback" describes overcoming a significant deficit.',
					'"Unforced" and "forced" error distinguish whether a mistake happens on its own (e.g. hitting into the net with no opponent pressure) or was provoked by a good opposing shot — this distinction doesn\'t matter for your TennisIndex rating, only the final result is scored.'
				]
			}
		],
		faq: [
			{
				question: 'What\'s the difference between slice and topspin?',
				answer:
					'Slice is hit with backspin: the ball flies flatter and bounces lower and flatter after landing. Topspin is hit with forward spin: the ball flies in a higher arc and bounces higher and faster forward after landing.'
			},
			{
				question: 'What does "break" mean?',
				answer:
					'A break happens when you win your opponent\'s service game — winning a game even though the other side was serving. It\'s often considered a particularly valuable point tactically.'
			}
		]
	},
	// ------------------------------------------------------------
	// EQUIPMENT
	// ------------------------------------------------------------
	{
		slug: 'tennis-ausruestung',
		title: 'Tennis Equipment: What You Actually Need to Get Started',
		metaTitle: 'Tennis Equipment for Beginners: The Complete Overview',
		metaDescription:
			'Rackets, balls, shoes, apparel: the tennis equipment you actually need to get started — and what can wait.',
		excerpt:
			'Rackets, balls, shoes, and apparel: an honest overview of what you actually need to get started.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 7,
		updatedAt: '2026-08-01',
		popular: true,
		relatedSlugs: ['tennis-schlaeger', 'tennis-schuhe', 'tennis-kosten'],
		sections: [
			{
				id: 'grundausstattung',
				heading: 'The basics',
				paragraphs: [
					'For your first few sessions, you really only need three things: a tennis racket, proper tennis shoes, and comfortable sportswear. Balls are usually provided by the club or coach for your first club session or trial lesson.',
					'Everything else — your own balls, a racket bag, grip tape, a towel on the net post — is nice to have, but not essential at the start. Buy little and deliberately rather than the full kit all at once.'
				]
			},
			{
				id: 'schlaeger',
				heading: 'Rackets',
				paragraphs: [
					'A lighter racket with a larger head suits beginners best — it enlarges the sweet spot and forgives mishits more than a small, heavy tournament racket. Many clubs lend out rackets for trial lessons, so buying your own isn\'t necessary right away.',
					'Details on choosing a racket (head size, weight, grip size) are in the dedicated racket guide.'
				]
			},
			{
				id: 'baelle',
				heading: 'Balls',
				paragraphs: [
					'Regular tennis balls come in two types: "regular duty" for soft surfaces like clay, and "extra duty" with a tougher felt for hard courts. For children and complete beginners, slower, lower-pressure balls (red/orange/green) also exist to make the start easier.',
					'A ball loses internal pressure and bounce over time — for casual practice, that\'s usually still fine for quite a while.'
				]
			},
			{
				id: 'schuhe-und-kleidung',
				heading: 'Shoes and clothing',
				paragraphs: [
					'Regular running shoes aren\'t suited to tennis: they lack the lateral stability needed for quick direction changes, and their tread often doesn\'t match the court surface. More details are in the dedicated shoe guide.',
					'For clothing, freedom of movement and breathable fabric matter most — on clay courts, lighter colors are also practical, since red clay dust shows up more on dark fabric.'
				]
			},
			{
				id: 'kann-warten',
				heading: 'Can wait until you know tennis is your sport',
				box: {
					kind: 'tips',
					title: 'Save this for later',
					items: [
						'A second, pricier racket — your first one is plenty for the first few months.',
						'A multi-compartment racket bag.',
						'A stash of grip tape and specialty dampeners.',
						'Tournament-grade balls in bulk cans.',
						'Dedicated tennis watches or tracking wearables.'
					]
				}
			},
			{
				id: 'vor-dem-kauf',
				heading: 'Before your first purchase',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Take one or two trial lessons with a rented racket before buying your own.',
						'Get fitted for grip size at a specialty shop — don\'t just guess it.',
						'Consider your club\'s main surface (clay vs. hard court) when choosing shoes.',
						'Choose clothing for freedom of movement, not just looks.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Do I need my own racket right away?',
				answer:
					'No. For your first trial lessons, a rented racket from the club is usually enough. Once it\'s clear you\'ll keep playing regularly, it\'s worth buying your own with proper fitting advice.'
			},
			{
				question: 'Are regular sports shoes fine for playing tennis?',
				answer:
					'For a single trial lesson, in a pinch, yes — but not long-term: tennis shoes offer lateral stability and a tread matched to the surface that regular running shoes lack, which matters for preventing injuries.'
			}
		]
	},
	{
		slug: 'tennis-schlaeger',
		title: 'Tennis Rackets for Beginners: Head Size, Weight, and Choosing One',
		metaTitle: 'Tennis Rackets for Beginners: The Complete Buying Guide',
		metaDescription:
			'Head size, weight, grip size, and stringing: how to find the right tennis racket as a beginner.',
		excerpt:
			'Head size, weight, and grip size explained simply — how to find your first, well-fitting tennis racket.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-technik', 'tennis-kosten'],
		sections: [
			{
				id: 'kopfgroesse',
				heading: 'Head size: bigger forgives more',
				paragraphs: [
					'Racket head size is measured in square inches, typically between about 95 and 115. A larger head offers a bigger sweet spot and forgives off-center hits more easily — ideal for beginners.',
					'More experienced players often move to smaller heads because they allow more precise, controlled play once technique is solid. For your first year or two, the larger, more forgiving option is almost always the better choice.'
				]
			},
			{
				id: 'gewicht-und-balance',
				heading: 'Weight and balance',
				paragraphs: [
					'Beginner rackets typically weigh between 250 and 285 grams unstrung — light enough to swing through a whole session without fatigue. Heavier rackets (around 300 grams and up) offer more stability and power on solid contact, but demand more arm strength and clean technique.',
					'Balance (head-heavy, handle-heavy, or even) affects how maneuverable the racket feels. Head-heavy rackets deliver more power from less swing, handle-heavy ones more control and maneuverability — for beginners, an even to slightly handle-heavy balance usually works best.'
				]
			},
			{
				id: 'griffstaerke',
				heading: 'Grip size',
				paragraphs: [
					'Grip size is usually given as L0 to L5 (roughly 4 1/8 to 4 5/8 inches). A grip that\'s too thick makes wrist snap harder for some shots; one that\'s too thin forces your hand to squeeze harder than necessary — both encourage tension over time.',
					'A specialty shop can measure the right size quickly; as a rough rule of thumb, there should be about one finger\'s width of space between your fingertips and palm when your hand is wrapped around the grip.'
				]
			},
			{
				id: 'besaitung',
				heading: 'Stringing and tension',
				paragraphs: [
					'Most rackets are sold pre-strung, usually with synthetic nylon — solid and affordable for beginners. Natural gut or multifilament strings offer more feel but cost more.',
					'String tension affects control and power: tighter stringing generally means more control but less natural power; looser stringing the opposite. For beginners, the factory string job is almost always a good starting point — fine-tuning comes later as your feel for the game develops.'
				]
			},
			{
				id: 'haeufiger-frust',
				heading: 'What causes the most frustration with a new racket',
				box: {
					kind: 'mistakes',
					title: 'Common buying mistakes',
					items: [
						'A "pro racket" with a small head and heavy weight, just because a favorite player uses it.',
						'Guessing grip size from hand size alone, without a proper fitting.',
						'Stringing too tight "because tighter sounds better" — this mostly costs power and comfort.',
						'The racket sits unused for months because it felt wrong from the very first swing.'
					]
				}
			},
			{
				id: 'vor-dem-kauf-schlaeger',
				heading: 'Check before buying',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Head size around 100 square inches or more for beginners.',
						'Unstrung weight in the 250–285 gram range.',
						'Grip size measured at a specialty shop, not guessed.',
						'Try a demo racket if the shop offers one, before committing to a purchase.'
					]
				}
			}
		],
		faq: [
			{
				question: 'What does a good beginner racket cost?',
				answer:
					'The price range is wide and changes constantly — a specialty shop near you will give the most current and reliable answer. More important for beginners than the price is getting the head size, weight, and grip size right.'
			},
			{
				question: 'Is a used racket good enough to start with?',
				answer:
					'Yes, as long as the head size, weight, and grip size fit. Do check the condition of the strings, though — badly worn or brittle strings can usually be restrung affordably.'
			}
		]
	},
	{
		slug: 'tennis-schuhe',
		title: 'Tennis Shoes: What to Look for When Buying',
		metaTitle: 'Buying Tennis Shoes: Sole, Surface, and Fit Explained',
		metaDescription:
			'Clay, hard court, or all-court: the sole patterns and criteria you should know before buying tennis shoes.',
		excerpt:
			'Clay or hard court — the right sole pattern makes the biggest difference when choosing tennis shoes.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'warum-spezielle-schuhe',
				heading: 'Why dedicated tennis shoes?',
				paragraphs: [
					'Tennis demands many quick direction changes, stops, and sideways lunges — far more lateral load than running. Tennis shoes are built for that with reinforced side support zones and a tougher, flatter sole than regular running shoes.',
					'Playing regularly in running shoes risks not just worse grip, but also faster sole wear and a higher injury risk during abrupt movements.'
				]
			},
			{
				id: 'sohle-nach-belag',
				heading: 'Sole pattern by surface',
				paragraphs: [
					'For clay courts, shoes with a fine herringbone pattern work best — this tread grips well in loose clay while still allowing controlled sliding when stopping, which is actually desirable on clay.',
					'For hard courts, tougher, usually coarser tread patterns are common that hold up to higher abrasion. "All-court" shoes with a mixed tread are a good compromise if you play on varying surfaces.',
					'Grass courts (less common in amateur play) need their own shoes, usually with small studs — regular clay or hard-court shoes either slip too much or damage the surface.'
				]
			},
			{
				id: 'passform-und-daempfung',
				heading: 'Fit and cushioning',
				paragraphs: [
					'Tennis shoes should leave a bit more room up front than everyday shoes, since your foot tends to slide forward during lateral movement. A firm heel hold matters more than maximum cushioning — overly soft cushioning can even feel less stable during quick direction changes.',
					'Anyone with knee or joint issues often benefits from a bit more forefoot cushioning; a quick chat with a specialty shop is worthwhile if you\'re unsure.'
				]
			},
			{
				id: 'falsche-wahl',
				heading: 'Shoe choices people often regret',
				box: {
					kind: 'mistakes',
					title: 'Common buying mistakes',
					items: [
						'Running shoes for the first club session, "because they\'re already in the closet".',
						'Hard-court shoes on clay — worse grip and faster wear.',
						'Shoe size too tight, without room for the foot sliding forward.',
						'No quick test session in a shop or on a test court before buying.'
					]
				}
			},
			{
				id: 'vor-dem-schuhkauf',
				heading: 'Before buying shoes',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Match the sole pattern to your club\'s main surface.',
						'Plan for a bit more forefoot room than in everyday shoes.',
						'Test heel hold and lateral stability, not just cushioning.',
						'Consider an all-court model if you play on varying surfaces.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Can I use one pair of shoes on every surface?',
				answer:
					'With an all-court model, mostly yes, with noticeable compromises compared to a shoe built specifically for one surface. If you mostly play on one surface, a matching specialized sole pattern usually performs better.'
			},
			{
				question: 'How often should I replace my tennis shoes?',
				answer:
					'That depends heavily on how often you play and the surface — clay wears down soles noticeably faster than hard court. Once the tread visibly smooths out or lateral grip fades, it\'s time for a new pair, regardless of a fixed timeframe.'
			}
		]
	},
	// ------------------------------------------------------------
	// TECHNIQUE & TACTICS
	// ------------------------------------------------------------
	{
		slug: 'tennis-technik',
		title: 'Tennis Technique: The Key Strokes Explained Simply',
		metaTitle: 'Tennis Technique: Forehand, Backhand, Serve, and Volley Explained',
		metaDescription:
			'Forehand, backhand, serve, volley, and slice: the key tennis groundstrokes explained clearly.',
		excerpt:
			'Forehand, backhand, serve, and volley — the groundstrokes every other technique builds on.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 9,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-training', 'tennis-begriffe'],
		sections: [
			{
				id: 'vorhand',
				heading: 'Forehand',
				paragraphs: [
					'The forehand is most players\' first reliable shot and often their biggest weapon. It\'s hit on the racket-hand side, usually with a backswing that drops the racket below the contact point before driving forward and up through the ball.',
					'Two basic grip families are common: a semi-western or western grip for heavy topspin, or a flatter eastern grip for a more direct, flatter trajectory. Beginners usually do well with a grip somewhere in between, keeping both options open.'
				]
			},
			{
				id: 'rueckhand',
				heading: 'Backhand',
				paragraphs: [
					'The backhand is hit one-handed or two-handed. Two-handed adds extra stability and power, and is often the easier entry point for beginners. One-handed allows more reach and is considered elegant by many, but takes more practice before power and control click into place.',
					'Which variant suits you better depends a lot on strength, reach, and personal preference — both are played successfully even at high levels.'
				]
			},
			{
				id: 'aufschlag',
				heading: 'Serve',
				paragraphs: [
					'The serve is the only shot where you have full control over the toss and timing — which makes it especially worth practicing deliberately. Key elements are a consistent, clean ball toss, a smooth backswing ("trophy position"), and a contact point as high and forward as possible.',
					'For beginners, consistency matters most: a slightly slower, reliable first serve beats plenty of double faults from taking too much risk.'
				]
			},
			{
				id: 'volley',
				heading: 'Volley',
				paragraphs: [
					'On a volley, the ball is played directly out of the air, usually with a short, compact swing rather than a big backswing. Base position at the net matters: weight forward, racket out in front of your body, so you can react to fast balls.',
					'A common beginner mistake is too much swing on the volley — controlled, short movements are usually more precise and reliable.'
				]
			},
			{
				id: 'slice-und-topspin',
				heading: 'Slice and topspin',
				paragraphs: [
					'Slice (backspin) produces a flatter, lower-bouncing ball — useful for taking pace off or buying time to reposition. Topspin (forward spin) produces a higher arc and a steeper, faster bounce — useful for extra safety over the net while still generating pace.',
					'Both complement the basic strokes rather than replace them — most advanced players switch between the two depending on the situation.'
				]
			},
			{
				id: 'fortschritt',
				heading: 'What speeds up progress the most',
				box: {
					kind: 'tips',
					title: 'Practice tips',
					items: [
						'Train consistency over the middle of the net first, then move on to pace and angles.',
						'Don\'t neglect footwork — the best stroke technique doesn\'t help much without timely positioning.',
						'Practice against a wall or ball machine regularly to increase repetitions.',
						'Record video of your own strokes and review it with a coach.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Should I learn a one-handed or two-handed backhand?',
				answer:
					'For most beginners, two-handed is the easier, more stable start, since the second hand adds extra strength and control. One-handed is worth it especially if you want to build more reach and slice versatility deliberately.'
			},
			{
				question: 'How long does it take to develop a solid serve?',
				answer:
					'A reasonably consistent, reliable serve usually comes together within a few weeks of regular practice. More pace and precision then keep developing over months — the serve is rightly considered one of the most technically demanding shots.'
			}
		]
	},
	{
		slug: 'tennis-taktik',
		title: 'Tennis Tactics: Play Smarter Singles',
		metaTitle: 'Tennis Singles Tactics: Fundamentals for Winning More Points',
		metaDescription:
			'Baseline play, net approaches, and shot selection: how to build clearer tactics in tennis singles.',
		excerpt:
			'Baseline play, net approaches, and smart shot selection — win more singles points without hitting harder.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-doppel', 'tennis-einzel-doppel'],
		sections: [
			{
				id: 'grundlinienspiel',
				heading: 'Baseline play: positioning is half the battle',
				paragraphs: [
					'Returning to the center of the court after every shot is one of the most important tactical fundamentals in singles — from there, you cover both sides roughly equally well. Staying out wide instead leaves the other half of the court almost wide open.',
					'Cross-court (along the long diagonal) is usually the safer shot, since the net is lower there and more court is available. Down the line is riskier, but often more surprising and effective than a predictable cross-court exchange.'
				]
			},
			{
				id: 'netzangriff',
				heading: 'When it pays to approach the net',
				paragraphs: [
					'A short, weak ball from your opponent is usually the best opportunity to move forward and finish the point with a volley or overhead, rather than continuing to rally from the baseline. Standing at the net cuts your opponent\'s reaction time significantly.',
					'Approaching too rarely gives away easy points; approaching too often without good reason gets you passed or lobbed easily — the balance makes the difference.'
				]
			},
			{
				id: 'schlagwahl-unter-druck',
				heading: 'Shot selection under pressure',
				paragraphs: [
					'In tight situations (deuce, set point), it pays to rely on your most reliable shot instead of a risky experiment. Many points are lost not through spectacular winners from the opponent, but through avoidable unforced errors in exactly these moments.',
					'A simple rule: the tighter the score, the more margin for safety you should build in — better to hit a slightly less risky shot but finish the point reliably.'
				]
			},
			{
				id: 'muster-erkennen',
				heading: 'Spotting your opponent\'s patterns',
				paragraphs: [
					'Many players have unconscious tendencies — almost always hitting cross-court instead of down the line, or almost always choosing the same shot under pressure. Recognizing such patterns during a match lets you adjust deliberately, for example by anticipating a position earlier or targeting their weaker side.'
				]
			},
			{
				id: 'punktekosten',
				heading: 'What costs the most points in practice',
				box: {
					kind: 'mistakes',
					title: 'Common tactical mistakes',
					items: [
						'Staying put after your own shot instead of recovering to the center.',
						'Going for maximum pace on every ball instead of prioritizing placement and consistency.',
						'Ignoring short balls from the opponent instead of consistently approaching the net.',
						'Trying unnecessarily risky shots in important points instead of trusting the reliable option.'
					]
				}
			},
			{
				id: 'im-kopf-behalten',
				heading: 'Keep this in mind before and during a match',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Recover to the center after every shot.',
						'Consistently use short balls as a cue to approach the net.',
						'Rely on your most reliable shot in tight points.',
						'Track your opponent\'s patterns over the course of the match and exploit them.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Should beginners already work on tactics?',
				answer:
					'Yes, in simple form — recovering to the center of the court after every shot in particular can be practiced early on and immediately wins noticeably more points, with no need for better stroke technique yet.'
			},
			{
				question: 'Is cross-court or down the line the better choice?',
				answer:
					'Cross-court is usually the safer default, since the net is lower there and more court is available. Down the line is worth using deliberately as a surprise factor, or when the opponent is strongly set up for cross-court shots.'
			}
		]
	},
	{
		slug: 'tennis-doppel',
		title: 'Tennis Doubles: Positioning, Communication, and Teamplay',
		metaTitle: 'Tennis Doubles: Positioning, Communication, and Formations Explained',
		metaDescription:
			'Net position, communication, and serving formations: how to play smarter tactically as a doubles team.',
		excerpt:
			'Net position, clear communication, and the right formation — how two singles players become a real team.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-einzel-doppel', 'tennis-technik'],
		sections: [
			{
				id: 'grundformation',
				heading: 'Base formation: one up, one back',
				paragraphs: [
					'The classic doubles formation on your own serve: the server stays back, while their partner is already at the net. After a good first serve, the server also moves forward quickly, so both players get into the strong net position as fast as possible.',
					'On return, it\'s often the opposite: the returner stays back at the baseline, while their partner also holds back at first, moving forward once a good opportunity appears.'
				]
			},
			{
				id: 'kommunikation',
				heading: 'Communication: small, but decisive',
				paragraphs: [
					'Short, clear calls like "mine" or "yours" for balls down the middle prevent the most common doubles blunder: both players standing still because each assumed their partner was covering it.',
					'A quick chat before serving also helps, for example whether the net player should actively "poach" (intercept the return) or stay on their own side — spontaneous surprise moves work best when briefly signaled beforehand.'
				]
			},
			{
				id: 'formationen',
				heading: 'Formations beyond the standard setup',
				paragraphs: [
					'The "Australian formation" places both teammates on the same side of the court, cutting off an opponent with a strong cross-court backhand from their preferred shot. The "I-formation" positions the net player right behind the server in the middle, moving to one side only after the serve, making the direction of the return harder to predict.',
					'These formations pay off especially against well-drilled return patterns from the opponent — for beginners, the standard base formation is more than enough.'
				]
			},
			{
				id: 'gasse-abdecken',
				heading: 'Covering the alley',
				paragraphs: [
					'A common target for the opponent is a shot down the alley whenever a gap opens up there. The basic rule: the net player covers the alley on their side as soon as the opponent sets up for a down-the-line shot — this requires constantly tracking the whole point, not just your own ball.'
				]
			},
			{
				id: 'bremst-teams-aus',
				heading: 'What slows most teams down',
				box: {
					kind: 'mistakes',
					title: 'Common doubles mistakes',
					items: [
						'Leaving balls down the middle unplayed because it\'s unclear whose ball it is.',
						'Staying too passive as the net player instead of actively intercepting balls.',
						'Retreating immediately after your own return instead of using the chance to move forward.',
						'No quick chat before serving, so surprise moves fall flat.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Who should stand at the net?',
				answer:
					'Generally whoever isn\'t currently returning or serving — the net position is usually the stronger one in doubles, since it forces shorter reaction times on the opponent and creates more direct point-winning chances.'
			},
			{
				question: 'What is "poaching"?',
				answer:
					'Poaching means actively intercepting a ball as the net player that was actually heading toward your partner — usually on the return, to surprise the opponent. Works best with a brief heads-up beforehand.'
			}
		]
	},
	// ------------------------------------------------------------
	// GETTING STARTED
	// ------------------------------------------------------------
	{
		slug: 'tennis-fuer-anfaenger',
		title: 'Tennis for Beginners: Everything You Need to Know Before Your First Match',
		metaTitle: 'Tennis for Beginners: The Complete Getting-Started Guide',
		metaDescription:
			'Finding a club, your first lesson, equipment: the complete getting-started guide for your first tennis match.',
		excerpt:
			'Finding a club, taking your first lesson, getting equipment — a straightforward path into tennis.',
		category: 'einstieg',
		difficulty: 'einsteiger',
		readingTime: 8,
		updatedAt: '2026-08-01',
		popular: true,
		beginnerRecommended: true,
		relatedSlugs: ['tennis-regeln', 'tennis-ausruestung', 'tennis-einzel-doppel', 'tennis-training'],
		sections: [
			{
				id: 'verein-oder-platz-finden',
				heading: 'Finding a club or a court',
				paragraphs: [
					'The easiest way in is usually a trial offer at a nearby club — many offer free or low-cost trial sessions. Alternatively, public or commercial courts in many cities can be booked by the hour, with no club membership required.',
					'On TennisIndex, /vereine and /karte show you clubs and venues near you at a glance.'
				]
			},
			{
				id: 'erste-trainerstunde',
				heading: 'Your first lesson',
				paragraphs: [
					'A guided first lesson with a coach is almost always more useful than uncoordinated hitting around with a friend — poorly ingrained movement patterns are hard to fix later.',
					'Expect your first lesson to focus on fundamentals: grip, simple forehand and backhand motions, short rallies from close range — not a full match yet.'
				]
			},
			{
				id: 'was-mitbringen',
				heading: 'What to bring',
				paragraphs: [
					'For your first session, comfortable sportswear and sturdy sports shoes are enough — most clubs or coaches will lend you a racket at first. A water bottle and sun protection on sunny days aren\'t a bad idea on court, especially in summer.'
				]
			},
			{
				id: 'entspannter-court-besuch',
				heading: 'Keeping your first court visit relaxed',
				box: {
					kind: 'tips',
					title: 'Practical tips',
					items: [
						'Arrive a bit early to get familiar with the court and surroundings.',
						'Don\'t try to hit hard right away — find your timing and contact point first.',
						'Ask briefly after the lesson what to work on before next time.',
						'If unsure about etiquette (e.g. who picks up the balls), just ask politely.'
					]
				}
			},
			{
				id: 'anfaenger-typisch',
				heading: 'Typical at the start, but easy to avoid',
				box: {
					kind: 'mistakes',
					title: 'Common beginner mistakes',
					items: [
						'Standing too far from the baseline out of nervousness about fast balls.',
						'Gripping the racket too tightly, which takes away swing and feel.',
						'Dwelling on a missed point for too long instead of quickly refocusing on the next one.',
						'Practicing too rarely between lessons — consistency comes mainly from repetition.'
					]
				}
			},
			{
				id: 'bevor-es-losgeht',
				heading: 'Before you get started',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Look for a trial session at a nearby club.',
						'Bring comfortable sportswear and sturdy sports shoes.',
						'Don\'t forget a water bottle and sun protection.',
						'Keep your expectations modest — the first shots rarely land like on TV.'
					]
				}
			}
		],
		faq: [
			{
				question: 'At what age can you start playing tennis?',
				answer:
					'Tennis can be started at practically any age. Children get slower balls and smaller courts for an easier entry, and adults of any age can join regular beginner courses at most clubs.'
			},
			{
				question: 'Do I need to be fit to get started?',
				answer:
					'No — the fundamentals can be learned regardless of fitness level, and conditioning develops naturally with regular play. A good warm-up before each session helps prevent injuries from the start.'
			},
			{
				question: 'How quickly will I find players at my level?',
				answer:
					'Through a club, usually quite quickly, since many beginners train together anyway. TennisIndex also helps through the club ranking and match search, connecting you with suitable opponents for your current level.'
			}
		]
	},
	{
		slug: 'tennis-training',
		title: 'Tennis Training: Drills for Technique, Tactics, and Better Matches',
		metaTitle: 'Tennis Training: Drills for Technique, Fitness, and Tactics',
		metaDescription:
			'From wall practice to match simulation: training drills that deliberately improve technique, fitness, and tactics.',
		excerpt:
			'From wall practice to match simulation — these drills help you improve deliberately, at any level.',
		category: 'einstieg',
		difficulty: 'fortgeschritten',
		readingTime: 7,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'technikuebungen',
				heading: 'Technique drills for consistent groundstrokes',
				paragraphs: [
					'Wall practice is one of the most efficient drills for beginners: the ball comes right back, allowing far more repetitions in a short time than playing with a partner. The goal at first is pure consistency — hitting the ball cleanly ten, twenty, thirty times in a row before adding pace.',
					'A ball machine (if your club has one) allows targeted practice of individual shot types at a consistent pace and placement, without needing a practice partner.'
				]
			},
			{
				id: 'beinarbeit',
				heading: 'Footwork and conditioning',
				paragraphs: [
					'Lateral jump drills (side shuffles), short sprints between markers, and shadow swings (movement patterns without a ball) improve reaction speed, which often decides points in real play — faster feet get you into hitting position sooner.',
					'Base endurance can be built separately through running, cycling, or swimming — tennis itself, with its many short sprints and pauses, is more of an interval sport than a pure endurance sport.'
				]
			},
			{
				id: 'taktikuebungen',
				heading: 'Tactical drills with a partner',
				paragraphs: [
					'Point play with restricted rules — for example only cross-court shots allowed, or a point only counting after at least five shots — deliberately trains consistency and tactical thinking instead of just hitting for pace.',
					'Simulated match situations (e.g. "you\'re down 3-5, win this game") help build mental toughness under pressure deliberately, instead of testing it for the first time in a real match.'
				]
			},
			{
				id: 'einstiegsrahmen',
				heading: 'A simple starting framework — adjust to your level',
				box: {
					kind: 'info',
					title: 'Example training session (60–75 minutes)',
					items: [
						'10 minutes warm-up: light jogging, stretching, easy first rallies.',
						'15 minutes groundstroke practice: forehand and backhand cross-court, focused on consistency.',
						'10 minutes serve and return practice.',
						'15 minutes volley and net play practice.',
						'15–20 minutes point play or a shortened match to apply it all.',
						'5 minutes cool-down and a quick reflection on what worked and what didn\'t.'
					]
				}
			}
		],
		faq: [
			{
				question: 'How often should beginners train?',
				answer:
					'One to two sessions per week is more than enough for noticeable progress at the start. Consistency usually matters more than frequency — better to train once a week reliably than sporadically with long gaps in between.'
			},
			{
				question: 'Does wall practice actually help?',
				answer:
					'Yes, especially for consistency and timing — the many repetitions in a short time help ingrain the basic motion faster than regular play, where not every rally unfolds the same way.'
			}
		]
	},
	// ------------------------------------------------------------
	// COSTS
	// ------------------------------------------------------------
	{
		slug: 'tennis-kosten',
		title: 'What Does Tennis Cost? Equipment, Membership, and Ongoing Costs Explained',
		metaTitle: 'What Does Tennis Cost? Equipment, Membership, and Court Fees Overview',
		metaDescription:
			'Club membership, court fees, equipment, and lessons: an overview of the cost factors in tennis.',
		excerpt:
			'Club membership, court fees, and equipment — an honest overview of the cost factors in tennis.',
		category: 'kosten',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'einmalige-kosten',
				heading: 'One-time costs: equipment',
				paragraphs: [
					'The biggest one-time purchase is the racket, followed by proper tennis shoes. How much you spend depends a lot on whether you buy new at a specialty shop, go for a beginner model, or start with something used — prices also shift over time, so a current look at a shop near you is more useful than a fixed number here.',
					'Clothing and accessories (balls, maybe a bag) add to that, but are usually much cheaper than a racket and shoes combined.'
				]
			},
			{
				id: 'laufende-kosten',
				heading: 'Ongoing costs: membership and court fees',
				paragraphs: [
					'Playing through a club usually means an annual or monthly membership fee, which varies a lot depending on the club, region, and facilities (number of courts, indoor capacity, extra amenities). Some clubs also charge a one-time joining fee.',
					'Playing without a club membership usually means paying hourly court fees at public or commercial venues instead — convenient for irregular play, but often more expensive long-term than a club membership if you play regularly.'
				]
			},
			{
				id: 'training-und-unterricht',
				heading: 'Training and lessons',
				paragraphs: [
					'Private lessons with a coach are usually the most expensive but also the most individualized form of training. Group lessons are cheaper per person and add the social aspect of learning together — often the better choice for beginners.',
					'Lesson costs vary a lot by region, the coach\'s qualifications, and what the club offers.'
				]
			},
			{
				id: 'laufende-kleinkosten',
				heading: 'Ongoing small costs',
				paragraphs: [
					'Balls wear out and need replacing regularly, especially with frequent play. Strings break or lose tension — an occasional restring is a normal part of maintenance for regular players.',
					'If you play league or tournament matches, expect entry fees on top, depending on the association and competition.'
				]
			},
			{
				id: 'bezahlbar-bleiben',
				heading: 'Keeping tennis affordable',
				box: {
					kind: 'tips',
					title: 'Money-saving tips for getting started',
					items: [
						'Try things out with a rented racket and trial lessons before making bigger purchases.',
						'Choose group lessons over private lessons to get started.',
						'Check for used rackets and equipment at a specialty shop or through your club.',
						'Compare club membership against public court fees for your actual playing habits, rather than deciding on a whim.'
					]
				}
			},
			{
				id: 'vor-dem-einstieg-klaeren',
				heading: 'Clarify before getting started',
				box: {
					kind: 'checklist',
					title: 'Quick checklist',
					items: [
						'Ask your prospective club directly about fees and any joining fee.',
						'Check whether a trial membership or probation period is offered.',
						'Find out whether a racket or balls are provided at first.',
						'Compare group and private lesson prices before committing.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Is tennis an expensive sport?',
				answer:
					'Starting costs can be kept low with rented equipment and group lessons. It gets more expensive mainly with high-end equipment of your own, regular private lessons, and competition entries — for casual recreational play, getting started stays manageable.'
			},
			{
				question: 'Is a club membership worth it compared to court fees?',
				answer:
					'That mostly depends on how often you play. With regular play, a club membership is usually cheaper than repeated single bookings; with very irregular play, hourly court fees with no fixed commitment can work out better.'
			}
		]
	}
];
