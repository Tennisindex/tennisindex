// ============================================================
// TennisIndex — Quiz content (English)
// ============================================================
// Same structure as de.ts (identical question IDs, difficulty,
// correctOptionId, relatedGuideSlugs), only the text differs — see
// quiz-data.test.ts for the parity checks this file must satisfy.

import type { QuizDifficulty, QuizQuestion, QuizResultTier } from '../../quiz';

export const QUIZ_DIFFICULTIES_EN: QuizDifficulty[] = [
	{
		slug: 'anfaenger',
		label: 'Beginner',
		description: 'Basic rules, scoring, serving, equipment, and simple match situations.',
		color: '#8BC53F',
		metaTitle: 'Tennis Quiz for Beginners: Do You Know the Key Rules?',
		metaDescription:
			'Test your knowledge of tennis rules, serving, scoring, equipment, and simple match situations.',
		recommendedGuideSlugs: ['tennis-regeln', 'tennis-fuer-anfaenger', 'tennis-ausruestung']
	},
	{
		slug: 'fortgeschritten',
		label: 'Intermediate',
		description: 'Tactical decisions, serve variations, volleys, net play, and doubles communication.',
		color: '#4C7A1F',
		metaTitle: 'Tennis Quiz for Intermediate Players: Technique, Tactics, and Match Situations',
		metaDescription:
			'Test your tennis knowledge on serving, volleys, doubles tactics, positioning, and shot selection.',
		recommendedGuideSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-doppel']
	},
	{
		slug: 'experte',
		label: 'Expert',
		description: 'Complex rule cases, match strategy, shot selection under pressure, angles, pace, and risk.',
		color: '#0F1F13',
		metaTitle: 'Tennis Expert Quiz: Tactics, Strategy, and Complex Match Situations',
		metaDescription:
			'The hard tennis quiz for experienced players: match strategy, shot selection, risk, and tactical decisions.',
		recommendedGuideSlugs: ['tennis-taktik', 'tennis-training', 'tennis-doppel']
	}
];

export const QUIZ_RESULT_TIERS_EN: QuizResultTier[] = [
	{
		minPercentage: 0,
		maxPercentage: 39,
		title: 'Room to grow',
		text: 'You\'re not quite solid on the basics yet. Start with the most important rules and simple match situations.'
	},
	{
		minPercentage: 40,
		maxPercentage: 69,
		title: 'Solid foundation',
		text: 'You already have a good basic understanding. A bit more rules knowledge and tactics will make you noticeably more confident.'
	},
	{
		minPercentage: 70,
		maxPercentage: 89,
		title: 'Strong tennis knowledge',
		text: 'You already understand many important situations well. Now\'s a good time to take the next step in technique and match tactics.'
	},
	{
		minPercentage: 90,
		maxPercentage: 100,
		title: 'Tennis expert',
		text: 'Very strong! You really know your way around rules, tactics, and match situations.'
	}
];

export const QUIZ_QUESTIONS_EN: QuizQuestion[] = [
	// ------------------------------------------------------------
	// BEGINNER
	// ------------------------------------------------------------
	{
		id: 'anfaenger-1',
		difficulty: 'anfaenger',
		question: 'What is tennis mainly?',
		options: [
			{ id: 'A', text: 'A racket sport played as singles or doubles' },
			{ id: 'B', text: 'A variant of squash without a net' },
			{ id: 'C', text: 'Pure fitness training without any scoring' },
			{ id: 'D', text: 'A team sport with six players per side' }
		],
		correctOptionId: 'A',
		explanation:
			'Tennis is a racket sport played either as singles (1 vs. 1) or doubles (2 vs. 2).',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-2',
		difficulty: 'anfaenger',
		question: 'How is a game normally scored in tennis?',
		options: [
			{ id: 'A', text: '1, 2, 3, 4' },
			{ id: 'B', text: '0, 1, 2, 3' },
			{ id: 'C', text: '15, 30, 40, game' },
			{ id: 'D', text: 'Every rally counts as one set' }
		],
		correctOptionId: 'C',
		explanation: 'Within a game, points are counted 15, 30, 40, and game.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-3',
		difficulty: 'anfaenger',
		question: 'How must the serve be executed in tennis?',
		options: [
			{ id: 'A', text: 'Overhand: the ball is tossed up and struck before it bounces' },
			{ id: 'B', text: 'Underhand, after the ball has bounced once on the ground' },
			{ id: 'C', text: 'Directly out of the air as a volley, with no toss' },
			{ id: 'D', text: 'Always with both hands at once' }
		],
		correctOptionId: 'A',
		explanation:
			'The serve is hit overhand: you toss the ball up and strike it before it touches the ground.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-4',
		difficulty: 'anfaenger',
		question: 'Does a ball landing exactly on the line count as out?',
		options: [
			{ id: 'A', text: 'Yes, the line no longer belongs to the court' },
			{ id: 'B', text: 'No, it counts as in as long as it touches the line' },
			{ id: 'C', text: 'Only on the serve does the line count as out' },
			{ id: 'D', text: 'That\'s decided purely by the umpire\'s judgment' }
		],
		correctOptionId: 'B',
		explanation:
			'If the ball touches any part of the line, it counts as in. It\'s only out once it lands completely outside all lines.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-5',
		difficulty: 'anfaenger',
		question: 'How many players are on court for a tennis doubles match?',
		options: [
			{ id: 'A', text: '2' },
			{ id: 'B', text: '3' },
			{ id: 'C', text: '4' },
			{ id: 'D', text: '6' }
		],
		correctOptionId: 'C',
		explanation: 'In doubles, two teams of two players each face off, so four in total.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'anfaenger-6',
		difficulty: 'anfaenger',
		question: 'What is a lob?',
		options: [
			{ id: 'A', text: 'A short ball hit right behind the net' },
			{ id: 'B', text: 'A high ball hit over an opponent' },
			{ id: 'C', text: 'A serving fault' },
			{ id: 'D', text: 'A second serve attempt' }
		],
		correctOptionId: 'B',
		explanation: 'A lob is a high ball meant to go over a player standing at the net.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-technik']
	},
	{
		id: 'anfaenger-7',
		difficulty: 'anfaenger',
		question: 'What happens if the ball bounces twice before being returned?',
		options: [
			{ id: 'A', text: 'The rally simply continues as normal' },
			{ id: 'B', text: 'The point is over, and the other side gets the point' },
			{ id: 'C', text: 'The point is always replayed' },
			{ id: 'D', text: 'Both sides get half a point each' }
		],
		correctOptionId: 'B',
		explanation:
			'The ball may only bounce once before being hit back. On a second bounce, the point is over.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-8',
		difficulty: 'anfaenger',
		question: 'What matters most for beginners?',
		options: [
			{ id: 'A', text: 'Always hitting as hard as possible' },
			{ id: 'B', text: 'Playing every ball as an overhead smash' },
			{ id: 'C', text: 'Keeping the ball in play under control' },
			{ id: 'D', text: 'Never talking to your partner' }
		],
		correctOptionId: 'C',
		explanation: 'Control and consistency matter more for beginners than pure power.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger']
	},
	{
		id: 'anfaenger-9',
		difficulty: 'anfaenger',
		question: 'What\'s the minimum equipment you need to get started?',
		options: [
			{ id: 'A', text: 'A tennis racket, proper shoes, and balls' },
			{ id: 'B', text: 'A tennis racket and soccer cleats' },
			{ id: 'C', text: 'A squash racket and a helmet' },
			{ id: 'D', text: 'Just gloves' }
		],
		correctOptionId: 'A',
		explanation: 'Tennis requires a tennis racket, suitable shoes, and tennis balls.',
		relatedGuideSlugs: ['tennis-ausruestung']
	},
	{
		id: 'anfaenger-10',
		difficulty: 'anfaenger',
		question: 'What\'s a common beginner mistake?',
		options: [
			{ id: 'A', text: 'Communicating too much with your partner' },
			{ id: 'B', text: 'Playing too much under control' },
			{ id: 'C', text: 'Returning to the center of the court after your own shot' },
			{ id: 'D', text: 'Always trying to hit every ball as hard as possible' }
		],
		correctOptionId: 'D',
		explanation:
			'Many beginners try to hit hard too often. In tennis, placement, patience, and control usually matter more.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger', 'tennis-taktik']
	},

	// ------------------------------------------------------------
	// INTERMEDIATE
	// ------------------------------------------------------------
	{
		id: 'fortgeschritten-1',
		difficulty: 'fortgeschritten',
		question: 'Why is the lob tactically important in tennis?',
		options: [
			{ id: 'A', text: 'It automatically ends the point' },
			{ id: 'B', text: 'It helps push a player standing at the net back' },
			{ id: 'C', text: 'It counts double' },
			{ id: 'D', text: 'It may only be played by professionals' }
		],
		correctOptionId: 'B',
		explanation:
			'A good lob can push opponents back from the net and let you take a better position yourself.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-2',
		difficulty: 'fortgeschritten',
		question: 'What\'s the main purpose of a slice shot?',
		options: [
			{ id: 'A', text: 'To always win the point immediately' },
			{ id: 'B', text: 'To make the ball fly flatter and bounce lower' },
			{ id: 'C', text: 'To deliberately hit the ball out' },
			{ id: 'D', text: 'To completely replace the serve' }
		],
		correctOptionId: 'B',
		explanation:
			'Slice is hit with backspin: the ball flies flatter and bounces lower after landing.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-3',
		difficulty: 'fortgeschritten',
		question: 'When is a volley particularly useful?',
		options: [
			{ id: 'A', text: 'When you\'re at the net and can take the ball early' },
			{ id: 'B', text: 'When the ball is far behind your own baseline' },
			{ id: 'C', text: 'Only immediately on your own serve' },
			{ id: 'D', text: 'Never, volleys aren\'t allowed in tennis' }
		],
		correctOptionId: 'A',
		explanation:
			'Volleys are usually played at the net, to take the ball early and apply pressure.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-4',
		difficulty: 'fortgeschritten',
		question: 'Which position is often advantageous in tennis for applying pressure?',
		options: [
			{ id: 'A', text: 'Both players staying at the baseline permanently' },
			{ id: 'B', text: 'A controlled position at the net' },
			{ id: 'C', text: 'Standing outside the court boundary' },
			{ id: 'D', text: 'Standing directly on the service line' }
		],
		correctOptionId: 'B',
		explanation:
			'The net is often a strong position in tennis, since it gives the opponent less reaction time.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-5',
		difficulty: 'fortgeschritten',
		question: 'What matters for communication in doubles?',
		options: [
			{ id: 'A', text: 'Talking as little as possible' },
			{ id: 'B', text: 'Only talking after the match' },
			{ id: 'C', text: 'Clear calls like "mine", "out", or "lob"' },
			{ id: 'D', text: 'Confusing your partner during the rally' }
		],
		correctOptionId: 'C',
		explanation: 'Short, clear calls help avoid misunderstandings and balls left unplayed.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-6',
		difficulty: 'fortgeschritten',
		question: 'What is a drop shot?',
		options: [
			{ id: 'A', text: 'A very hard serve' },
			{ id: 'B', text: 'A short, softly hit ball landing just past the net' },
			{ id: 'C', text: 'A ball deliberately hit into the net' },
			{ id: 'D', text: 'A serve that must be replayed' }
		],
		correctOptionId: 'B',
		explanation:
			'A drop shot is a short, soft ball landing just past the net, forcing a player standing far back to sprint forward.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-7',
		difficulty: 'fortgeschritten',
		question: 'Why is it especially worth practicing the serve deliberately?',
		options: [
			{ id: 'A', text: 'Because it\'s the only shot you fully control yourself' },
			{ id: 'B', text: 'Because it doesn\'t count in doubles' },
			{ id: 'C', text: 'Because it\'s always hit underhand' },
			{ id: 'D', text: 'Because it may never be replayed' }
		],
		correctOptionId: 'A',
		explanation:
			'Unlike every other shot, you fully control the toss and timing on the serve — which is why it deserves deliberate practice.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-8',
		difficulty: 'fortgeschritten',
		question: 'What\'s a tactical mistake at the net in doubles?',
		options: [
			{ id: 'A', text: 'Taking the ball early' },
			{ id: 'B', text: 'Putting the opponent under pressure' },
			{ id: 'C', text: 'Leaving too large a gap between partners' },
			{ id: 'D', text: 'Placing the ball with control' }
		],
		correctOptionId: 'C',
		explanation:
			'Large gaps between partners give the opposing side easy attacking opportunities.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-9',
		difficulty: 'fortgeschritten',
		question: 'Why shouldn\'t you smash every high ball with full power?',
		options: [
			{ id: 'A', text: 'Because overhead smashes are never allowed in tennis' },
			{ id: 'B', text: 'Because a poor smash can give the opponent a good chance to counter' },
			{ id: 'C', text: 'Because high balls automatically count as out' },
			{ id: 'D', text: 'Because it always causes the point to be replayed' }
		],
		correctOptionId: 'B',
		explanation:
			'A poorly placed or too-weak smash can easily be defended or countered.',
		relatedGuideSlugs: ['tennis-technik', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-10',
		difficulty: 'fortgeschritten',
		question: 'What matters most on the return?',
		options: [
			{ id: 'A', text: 'Hitting as hard as possible right away' },
			{ id: 'B', text: 'Getting the ball safely into play and placing it deep' },
			{ id: 'C', text: 'Running as close to the net as possible before the ball even arrives' },
			{ id: 'D', text: 'Deliberately hitting into the net' }
		],
		correctOptionId: 'B',
		explanation:
			'A safe, deep return prevents easy attacks from the serving side.',
		relatedGuideSlugs: ['tennis-taktik']
	},

	// ------------------------------------------------------------
	// EXPERT
	// ------------------------------------------------------------
	{
		id: 'experte-1',
		difficulty: 'experte',
		question:
			'You\'re at the net, and your opponent hits a very good lob over your backhand side. What\'s often the best decision?',
		options: [
			{ id: 'A', text: 'Sprint backward and smash blindly' },
			{ id: 'B', text: 'Bring the ball back under control with an overhead slice or a defensive shot' },
			{ id: 'C', text: 'Deliberately let the ball go' },
			{ id: 'D', text: 'Ignore your partner' }
		],
		correctOptionId: 'B',
		explanation:
			'Under pressure, control matters more than risk. A controlled overhead slice or an orderly retreat is often better than a forced smash.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-technik']
	},
	{
		id: 'experte-2',
		difficulty: 'experte',
		question: 'Why is changing pace important in tennis at a high level?',
		options: [
			{ id: 'A', text: 'So the rally becomes random' },
			{ id: 'B', text: 'To disrupt the opponent\'s rhythm, position, and reaction time' },
			{ id: 'C', text: 'Because hard-hit balls always win automatically' },
			{ id: 'D', text: 'Because slow balls are against the rules' }
		],
		correctOptionId: 'B',
		explanation: 'Varying pace, height, and placement makes the game harder to read.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-3',
		difficulty: 'experte',
		question: 'When is a hard smash strategically risky?',
		options: [
			{ id: 'A', text: 'When it\'s not well placed and the opponent can hit it back' },
			{ id: 'B', text: 'When you want to win the point' },
			{ id: 'C', text: 'When the ball comes in high' },
			{ id: 'D', text: 'Always, in the first game of the set' }
		],
		correctOptionId: 'A',
		explanation: 'An imprecise smash can come back and weaken your own position.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'experte-4',
		difficulty: 'experte',
		question: 'What\'s a useful goal of a ball hit low and flat at the feet of a player standing at the net?',
		options: [
			{ id: 'A', text: 'Forcing the opponent into a difficult low volley' },
			{ id: 'B', text: 'Hitting the ball as high as possible over the whole court' },
			{ id: 'C', text: 'Deliberately giving away the point' },
			{ id: 'D', text: 'Replacing your own serve' }
		],
		correctOptionId: 'A',
		explanation:
			'A deep, flat ball at the feet forces an uncomfortable low volley and can help you take over the net yourself.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-5',
		difficulty: 'experte',
		question: 'What decision is often smart when you have your opponent under pressure at the net?',
		options: [
			{ id: 'A', text: 'Relying purely on maximum power' },
			{ id: 'B', text: 'Opening up angles, targeting the feet, or finding gaps between opponents' },
			{ id: 'C', text: 'Deliberately breaking off the rally' },
			{ id: 'D', text: 'Always playing to the middle of your own half' }
		],
		correctOptionId: 'B',
		explanation:
			'At the net, placement, angles, and pressure on the feet are often more effective than raw power.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-6',
		difficulty: 'experte',
		question: 'Why is the middle between two doubles opponents often a good target?',
		options: [
			{ id: 'A', text: 'Because no one ever stands there' },
			{ id: 'B', text: 'Because responsibility can become unclear and it reduces the opponents\' angles' },
			{ id: 'C', text: 'Because the ball counts double there' },
			{ id: 'D', text: 'Because you\'re only allowed to hit there' }
		],
		correctOptionId: 'B',
		explanation:
			'The middle can test the opponents\' communication and responsibility, and often takes away their angle for the return.',
		relatedGuideSlugs: ['tennis-doppel', 'tennis-taktik']
	},
	{
		id: 'experte-7',
		difficulty: 'experte',
		question:
			'You\'re defending deep in doubles, and your opponents are standing very close to the net. Which option is often smart?',
		options: [
			{ id: 'A', text: 'A controlled lob over both opponents' },
			{ id: 'B', text: 'A slow ball straight into your own net' },
			{ id: 'C', text: 'A smash from deep defense' },
			{ id: 'D', text: 'A flat slice with no height straight down the middle' }
		],
		correctOptionId: 'A',
		explanation:
			'A good lob can reclaim the net and take the pressure off the situation.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-8',
		difficulty: 'experte',
		question: 'What defines good doubles tactics?',
		options: [
			{ id: 'A', text: 'Both players making decisions independently of each other' },
			{ id: 'B', text: 'Coordinated movement, clear roles, and aligned risk choices' },
			{ id: 'C', text: 'Only the stronger player hits every ball' },
			{ id: 'D', text: 'Keeping as much distance as possible between players' }
		],
		correctOptionId: 'B',
		explanation:
			'Successful doubles teams move in coordination and make tactical decisions together.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'experte-9',
		difficulty: 'experte',
		question: 'When can a slow ball be more effective than a hard one?',
		options: [
			{
				id: 'A',
				text: 'When it forces the opponent into an awkward contact point or an uncomfortable movement'
			},
			{ id: 'B', text: 'Never' },
			{ id: 'C', text: 'Only during warm-up before the match' },
			{ id: 'D', text: 'Only on match point' }
		],
		correctOptionId: 'A',
		explanation:
			'A slow, well-placed ball can break the opponent\'s rhythm and provoke errors.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-10',
		difficulty: 'experte',
		question: 'What\'s a sign of tactical maturity in tennis?',
		options: [
			{ id: 'A', text: 'Playing every ball with maximum risk' },
			{ id: 'B', text: 'Deliberately choosing between risk, control, placement, and position' },
			{ id: 'C', text: 'Never playing lobs at all' },
			{ id: 'D', text: 'Only wanting to win points through raw power' }
		],
		correctOptionId: 'B',
		explanation: 'Good players choose between safety, pressure, and risk depending on the situation.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-training']
	}
];
