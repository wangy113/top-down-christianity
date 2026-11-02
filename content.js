/*
  All student-facing text for The Counselor of Aksum lives here, so an instructor can edit it
  without touching app.js. Run `npm run check` after editing: it validates the structure and the
  house writing rules (no em dashes, no semicolons, no middle dots).

  Card quotes come from Chapter 9 of World History: Cultures, States, and Societies to 1500
  (Charlotte Miller, CC BY-SA 4.0). Keep them word for word.
*/
window.AKSUM = {
  version: "aksum-1",
  title: "The Counselor of Aksum",

  chapter: {
    label: "Chapter 9, African History to 1500, section 9.6 Aksum and Ethiopia",
    url: "https://alg.manifoldapp.org/read/world-history/section/d6c690eb-3f5f-4fcc-9a6d-0034db7aea4f"
  },

  tags: {
    chapter: { label: "In your chapter (9.6)", note: "Quoted from your textbook." },
    other: { label: "From another source", note: "A source outside the chapter. It is named each time." },
    legend: { label: "Legend recorded later", note: "A tradition written down long after the events." },
    inference: { label: "Historian’s inference", note: "An argument historians make from the evidence." },
    game: { label: "Imagined for the game", note: "Scenes, voices and costs invented for play." }
  },

  positions: [
    { id: "throne", label: "From the throne", x: 50, y: 9 },
    { id: "throne-people", label: "Throne and people", x: 29, y: 50 },
    { id: "throne-outside", label: "Throne and outside", x: 71, y: 50 },
    { id: "all", label: "All three at once", x: 50, y: 64 },
    { id: "people", label: "From the people", x: 9, y: 91 },
    { id: "people-outside", label: "People and outside", x: 50, y: 91 },
    { id: "outside", label: "From outside", x: 91, y: 91 }
  ],

  sequence: [
    { kind: "audience", id: "merchants" },
    { kind: "challenge", id: "frumentius-date" },
    { kind: "audience", id: "coin" },
    { kind: "audience", id: "priests" },
    { kind: "challenge", id: "nine-priests" },
    { kind: "audience", id: "emperor" }
  ],

  ranks: [
    { min: 0, title: "Scribe", text: "You have a seat at court. Read section 9.6 again and play once more to rise." },
    { min: 5, title: "Counselor", text: "Your advice usually rested on evidence. A closer reading of 9.6 would win the rest of the seals." },
    { min: 10, title: "Keeper of the Seal", text: "You read the chapter closely and backed your counsel with evidence that fit." }
  ],

  start: {
    sticker: "A game for Chapter 9",
    lede: "A new faith reaches the kingdom of Aksum. Advise the throne as it arrives, takes hold, and is tested.",
    role: [
      "You hold an office that appears in no record: Counselor of the Throne. It outlives every ruler.",
      "Four rulers across thirteen centuries will ask your advice about Christianity in Aksum and Ethiopia."
    ],
    readFirst: "Read section 9.6, Aksum and Ethiopia, before you start. Keep it open while you play. Every audience asks you to find something in it.",
    readLink: "Open Chapter 9 in a new tab",
    steps: [
      { title: "The summons", text: "The ruler asks something only the chapter answers. Type what you find." },
      { title: "Your counsel", text: "Choose your advice. Back it with an evidence card." },
      { title: "Forecast", text: "Say what you think the throne actually did." },
      { title: "The record", text: "See what the sources say happened." },
      { title: "Place it", text: "Decide where the push came from: the throne, the people, or outside." }
    ],
    seals: [
      "You earn seals for finding things in the chapter, for backing advice with evidence that fits, and for forecasting the record.",
      "Any piece of advice can earn full seals. Seals reward reading and evidence, and they never grade the advice itself.",
      "Two Scribe’s Challenges ask you to check the chapter against other sources."
    ],
    corners: [
      { title: "From the throne", text: "A ruler’s decision." },
      { title: "From the people", text: "Ordinary believers, farmers and villagers." },
      { title: "From outside", text: "Captives, traders, priests and refugees who came from abroad." }
    ],
    privacy: "Your progress stays in this browser. Nothing is sent anywhere.",
    begin: "Enter the court",
    resume: "Continue where you left off",
    restart: "Start over"
  },

  ui: {
    skip: "Skip to the game",
    railLabel: "Your progress",
    railStart: "Start",
    railChallenge: "Scribe",
    railChronicle: "Chronicle",
    railAbout: "About",
    locked: "Finish the step before this one first.",
    sealsPill: "Seals {n} of {max}",
    audienceOf: "Audience {n} of {max}",
    stepSummons: "The summons",
    stepCounsel: "Your counsel",
    stepForecast: "Forecast",
    stepRecord: "The record",
    stepPlace: "Place it",
    keyLabel: "Your answer",
    keyCheck: "Check",
    keyEmpty: "Type an answer first.",
    keyMissFirst: "Not quite. Look in section 9.6 again.",
    keyMissHint: "Still not it. Here is where to look.",
    keyContinue: "Continue without the seal",
    keySkipped: "You went on without the seal. The evidence cards are still yours.",
    keySeal: "Seal earned.",
    counselPrompt: "Choose your advice. Each choice has a cost.",
    costLabel: "The cost",
    cardsPrompt: "Back your advice. Play one evidence card.",
    cardsChange: "You can change your advice until you play a card.",
    cardMiss: "That card speaks of {about}. It does not back this advice. Play another card.",
    cardFit: "The ruler accepts your reason.",
    counselSeal: "Your first card fit your advice. Seal earned.",
    counselNoSeal: "Your reason fits now. The seal goes only to a first card that fits.",
    forecastRight: "That is what happened. Seal earned.",
    forecastWrong: "That is not what happened. Read the record below.",
    readMore: "Read more in your chapter",
    missing: "Outside the record",
    placePrompt: "Where did this push come from? Choose a point on the triangle.",
    placeYou: "You placed it",
    placeHistorian: "A historian might place it",
    next: "Next",
    toChronicle: "Open your Chronicle",
    challengeEyebrow: "Scribe’s Challenge",
    claimLabel: "The chapter says",
    evidenceLabel: "Other evidence",
    rulingPrompt: "How would you rule on the chapter’s sentence?",
    rulingSupported: "Supported",
    rulingPartly: "Partly supported",
    rulingNot: "Not established",
    rulingYours: "Your ruling",
    rulingStrongest: "The strongest ruling",
    rulingLean: "Where most historians land",
    rulingSeal: "Seal earned.",
    rulingOpen: "This challenge has no single answer. Here is how a historian might argue each ruling.",
    rulingScored: "This challenge has a clear answer. Here is how a historian might argue each ruling.",
    sealToast: "+1 seal",
    diagram: "Diagram, not a real coin",
    restartConfirm: "Start over? This clears your Chronicle and seals on this browser.",
    saveFailed: "This browser is not saving your progress. Finish in one sitting.",
    readFirstTitle: "Read first",
    howTitle: "How an audience works",
    sealsTitle: "Seals",
    cornersTitle: "The three corners",
    tagsTitle: "Where each claim comes from",
    entriesTitle: "The four audiences",
    linkText: "Link",
    stepWord: "Step",
    doneWord: "done",
    coinGold: "Gold",
    coinCopper: "Copper",
    coinCross: "Coin with a cross at the top",
    coinDisc: "Coin with the disc and crescent at the top",
    coinGoldCross: "Gold coin with a cross",
    coinCopperDisc: "Copper coin with the disc and crescent"
  },

  audiences: {
    merchants: {
      number: 1,
      short: "Merchants",
      title: "The Merchants’ Prayer House",
      when: "About 330 CE",
      ruler: "The queen, ruling for her young son Ezana",
      scene: [
        "The old king is dead. His son Ezana is still a boy, so the queen rules for him.",
        "Frumentius stands before her. He is a young Syrian who reached Aksum after a voyage went wrong, and he now keeps the royal records.",
        "He brings a request. Roman traders in the city are Christians. They want places where they can meet and pray.",
        "The queen turns to you."
      ],
      summons: {
        ask: "“Before you advise me, remind me. Where do the trading ships put in? Name our most important port.”",
        answers: ["adulis"],
        hint: "Look at the first paragraph of 9.6. Find the sentence about the capital and its most important port.",
        found: "“Adulis. Yes. That is where the ships from far away come in.”"
      },
      cards: [
        { id: "m1", title: "Ships from far away", about: "the wealth of the port", tag: "chapter",
          quote: "Adulis, positioned on the coast, rose in prominence and grew wealthy. It served as a safe harbor for ships traveling from Southeast Asia." },
        { id: "m2", title: "Coins for long-distance trade", about: "how much Aksum depends on trade", tag: "chapter",
          quote: "The state of Aksum began minting its own gold and silver coins in the third century CE, demonstrating how important long-distance trade was to its economy." },
        { id: "m3", title: "Who pays for the court", about: "what pays for the court", tag: "chapter",
          quote: "Their agricultural productivity meant that the work of peasants and the wealth generated through foreign trade supported the ruling classes and elites." },
        { id: "m4", title: "Old sacred signs", about: "the old sacred signs of the land", tag: "chapter",
          quote: "For example, the Kingdom of Da’amat used religious symbols in its monumental architecture, including the disc and crescent, also found in Southern Arabia." }
      ],
      question: "“What do you advise?”",
      options: [
        { id: "grant", label: "Grant it. Let them build prayer houses in the city.",
          cost: "A foreign faith becomes visible at the heart of the kingdom. Those who serve the old gods may object.",
          supports: {
            m1: "The port’s wealth depends on foreign ships. Welcoming their traders keeps them coming.",
            m2: "Aksum’s own coins show how much the kingdom lives by long-distance trade.",
            m3: "Foreign trade helps pay for the court. Keeping traders content protects it."
          } },
        { id: "port", label: "Allow it only at the port, in Adulis.",
          cost: "The traders are tolerated more than welcomed. The faith stays at the edge of the kingdom, far from the court.",
          supports: {
            m1: "Adulis is where the foreign ships are. A prayer house there serves the traders where they already gather.",
            m4: "Keeping foreign worship at the coast leaves the capital’s own sacred signs undisturbed."
          } },
        { id: "refuse", label: "Refuse. The kingdom keeps its own gods.",
          cost: "The traders may feel unwelcome and take their business to other ports.",
          supports: {
            m4: "The land has sacred signs far older than this faith. A ruler can choose to guard them."
          } }
      ],
      forecast: {
        ask: "What did the court actually do? Your chapter tells you.",
        options: [
          { id: "settle", label: "Christian merchants were encouraged to settle in Aksum.", correct: true },
          { id: "port", label: "Christian merchants were kept at the port and nowhere else." },
          { id: "away", label: "Christian merchants were sent away." }
        ]
      },
      throneDid: "Christian traders were encouraged to settle, and Rufinus says they were given places to pray.",
      matches: ["grant"],
      record: [
        { tag: "chapter", text: "“As bishop, Frumentius also encouraged Christian merchants to settle in Aksum.”", ref: "Section 9.6" },
        { tag: "chapter", text: "“Ethiopian tradition traces the establishment of Christianity in the region back to two shipwrecked Syrians.”", ref: "Section 9.6" },
        { tag: "other", text: "Rufinus, a church historian writing about 70 years later, tells the story as he says he heard it from Aedesius, the second Syrian. In his version the two boys were captured when local people attacked their ship, and they were brought to the king. Frumentius kept the royal accounts and records. After the king died, he helped the queen govern. He sought out Christian traders and gave them places to meet for prayer.", ref: "Rufinus, Church History 10.9, written about 402 CE" }
      ],
      compare: "Compare the two. Rufinus puts the prayer houses before Frumentius became a bishop. Your chapter says he encouraged the merchants as bishop. The chapter says shipwrecked. Rufinus says attacked.",
      readMore: "The 9.6 paragraph that begins “In addition to its role in inter-regional trade.”",
      missing: "Neither account tells us what ordinary people in Aksum thought of the newcomers or their faith.",
      placement: {
        historian: "throne-outside",
        why: "The faith came from outside, with a captive and foreign traders. It took root because one of those outsiders had the court’s trust. Nothing here shows ordinary Aksumites taking it up yet."
      }
    },

    coin: {
      number: 2,
      short: "Coin",
      title: "The King’s Coin",
      when: "The 340s CE",
      ruler: "King Ezana",
      scene: [
        "Ezana has grown up. Frumentius, now a bishop, has taught him the faith, and the king has accepted it.",
        "The royal mint is ready to strike new coins. The coins of the kings before him carried a sacred sign at the top, above the king’s portrait.",
        "The die-cutter waits for your word."
      ],
      summons: {
        ask: "“Before the die-cutter starts, tell me. What do we call the tall stone pillars my fathers raised over royal graves?”",
        answers: ["stelae", "stele", "steles", "stela"],
        hint: "In 9.6, find the paragraph about the tall carved pillars that Ezana and other kings commissioned. The word is also in the chapter’s list of key terms.",
        found: "“Stelae. Stone remembers longer than coins. But coins travel farther.”"
      },
      cards: [
        { id: "k1", title: "The bishop’s teaching", about: "the king’s new faith", tag: "chapter",
          quote: "…guided the king of Aksum, King Ezana (r. 325 – 350 CE), in his conversion to Christianity." },
        { id: "k2", title: "Coins travel far", about: "coins and long-distance trade", tag: "chapter",
          quote: "The state of Aksum began minting its own gold and silver coins in the third century CE, demonstrating how important long-distance trade was to its economy." },
        { id: "k3", title: "Stone keeps the past", about: "the king’s buildings", tag: "chapter",
          quote: "…the architecture that he commissioned maintained ties to Aksum’s pre-Christian past." },
        { id: "k4", title: "Old sacred signs", about: "the old sacred signs of the land", tag: "chapter",
          quote: "For example, the Kingdom of Da’amat used religious symbols in its monumental architecture, including the disc and crescent, also found in Southern Arabia." }
      ],
      question: "“What goes at the top of the new coin?”",
      options: [
        { id: "cross", label: "Put the cross on every coin.", emblem: "cross",
          cost: "The old sign disappears from money that everyone handles. Those loyal to the old gods see the break at once.",
          supports: {
            k1: "A king who has taken the faith can say so on the one object that carries his face everywhere.",
            k2: "Aksum’s coins travel far along the trade routes. A cross announces the king’s faith to partners abroad, including the Roman Empire, whose emperors were now Christian."
          } },
        { id: "keep", label: "Keep the disc and crescent.", emblem: "disc",
          cost: "The king’s new faith stays invisible on his own coins. Christians at home and abroad may doubt it.",
          supports: {
            k4: "The disc and crescent are older than the kingdom of Aksum itself. Changing them could unsettle people who trust them.",
            k3: "Ezana’s own buildings kept ties to the old ways. His coins could do the same."
          } },
        { id: "split", label: "Put the cross on gold coins made for trade abroad. Keep the old sign on coins used at home.", emblem: "split",
          cost: "The king shows one face to the world and another to his own people. Someone will notice.",
          supports: {
            k2: "Coins made for long-distance trade speak to foreigners. The king can address them differently from his own people.",
            k3: "Ezana kept old forms in stone while holding a new faith. A split coinage follows the same pattern."
          } }
      ],
      forecast: {
        ask: "What did Ezana’s mint actually do? Your chapter tells you.",
        options: [
          { id: "first", label: "The cross appeared from the first year of his reign." },
          { id: "later", label: "Coins from the first half of his reign kept the disc and crescent. Later coins carried a cross.", correct: true },
          { id: "never", label: "The disc and crescent stayed for his whole reign." }
        ]
      },
      throneDid: "Ezana’s early coins kept the disc and crescent. His later coins carried the cross.",
      matches: ["cross"],
      record: [
        { tag: "chapter", text: "“…the coins from the first half of Ezana’s reign have the disc and crescent symbols of earlier Ethiopian rulers, while coins from the later decades of Ezana’s reign have a Christian cross.”", ref: "Section 9.6" },
        { tag: "other", text: "Both coins below are gold and written in Greek, the trading language of the Red Sea world. The front of each reads “King Ezanas.”", ref: "British Museum records for coins 1989,0518.41 and 1921,0316.1" },
        { tag: "inference", text: "Aksum’s coins may be the first anywhere to carry a cross. Gold coins traveled with trade, so the first public sign of the king’s new faith went out to the wider world.", ref: "CoinWeek, The Coinage of Aksum" }
      ],
      images: [
        { src: "assets/coin-disc-crescent.jpg", alt: "Gold coin of King Ezana. A crowned bust between two stalks of wheat, with a small disc and crescent at the top.",
          caption: "Ezana’s gold coin with the disc and crescent, about 300-340 CE.",
          credit: "British Museum 1989,0518.41. Photo by Ismoon, CC BY-SA 4.0, via Wikimedia Commons.",
          creditUrl: "https://commons.wikimedia.org/wiki/File:Ezana_gold_coin_with_new_moon_and_disc,_300-340_(circa)._British_Museum._1989,0518.41.jpg" },
        { src: "assets/coin-cross.jpg", alt: "Gold coin of King Ezana. A crowned bust between two stalks of wheat, with small crosses at the top, bottom and sides.",
          caption: "Ezana’s gold coin with crosses, about 340-400 CE.",
          credit: "British Museum 1921,0316.1. Photo by Ismoon, CC BY-SA 4.0, via Wikimedia Commons.",
          creditUrl: "https://commons.wikimedia.org/wiki/File:Ezana_gold_coin_with_cross._British_Museum._1921,0316.1.jpg" }
      ],
      compare: "The king changed his coins. Your chapter adds that his buildings kept ties to the old ways. Look for both in 9.6.",
      readMore: "The 9.6 paragraph about Frumentius and the coins, and the paragraph about the stelae.",
      missing: "A coin cannot tell us whether the farmers who paid tribute shared the king’s new faith.",
      placement: {
        historian: "throne",
        why: "Only the king could change the coins. This is the clearest push from the top in the whole record. It shows what the king believed and wanted others to see. It cannot show what anyone else believed."
      }
    },

    priests: {
      number: 3,
      short: "Priests",
      title: "Nine Priests at the Gate",
      when: "Late 400s CE",
      ruler: "A king of Aksum, more than a century after Ezana",
      scene: [
        "More than a hundred years have passed since Ezana. The churches of the Roman Empire have split in bitter quarrels over how to speak about Christ.",
        "Nine priests from the losing side have come south as refugees. They stayed in Egypt on the way.",
        "They make two requests. They want land to found monasteries. And they want to teach and lead worship in the language spoken here, in villages far from the capital."
      ],
      summons: {
        ask: "“These priests want to pray in our own tongue. What is our language called?”",
        answers: ["geez", "gez", "giiz"],
        hint: "In 9.6, find the paragraph about the nine priests. It names the language of their liturgy.",
        found: "“Ge’ez. Then they would speak to my farmers in the words my farmers use.”"
      },
      cards: [
        { id: "p1", title: "Rich farmland", about: "how many people the land feeds", tag: "chapter",
          quote: "Unlike some other regions in Africa, Ethiopia had very fertile, volcanic soils that supported large populations." },
        { id: "p2", title: "Who does the work", about: "who supports the kingdom", tag: "chapter",
          quote: "Their agricultural productivity meant that the work of peasants and the wealth generated through foreign trade supported the ruling classes and elites." },
        { id: "p3", title: "A king’s faith", about: "how the faith began here", tag: "chapter",
          quote: "Ezana was the first Christian king in the region…" },
        { id: "p4", title: "Partners abroad", about: "long-distance trade", tag: "chapter",
          quote: "The state of Aksum began minting its own gold and silver coins in the third century CE, demonstrating how important long-distance trade was to its economy." }
      ],
      question: "“What should I do with them?”",
      options: [
        { id: "welcome", label: "Welcome them. Give them land, and let them teach in Ge’ez wherever they go.",
          cost: "The court loses control of what is taught far from the capital. The Roman emperor’s church may see Aksum as taking the losing side.",
          supports: {
            p1: "Fertile land feeds a large population. Most of the kingdom’s people live far from the court, and the priests would reach them.",
            p2: "The peasants’ work supports the whole kingdom. A faith that reaches them reaches the kingdom’s foundation."
          } },
        { id: "court", label: "Shelter them, but keep them at court, under the king’s eye.",
          cost: "They are safe, and the court stays in charge. The villages hear little of the faith.",
          supports: {
            p3: "The faith in Aksum began with a king. Keeping its teachers near the throne keeps it the king’s faith."
          } },
        { id: "send", label: "Send them on. Taking sides in a foreign church quarrel is dangerous.",
          cost: "Refugees are turned away. The faith in Aksum stays as it is.",
          supports: {
            p4: "Aksum lives by long-distance trade. Angering the powers on the other side of a church quarrel could cost the kingdom its partners."
          } }
      ],
      forecast: {
        ask: "What happened to the nine priests? Your chapter tells you.",
        options: [
          { id: "stayed", label: "They stayed, and the faith grew further, with worship in Ge’ez.", correct: true },
          { id: "sent", label: "They were sent on and settled elsewhere." },
          { id: "court", label: "They stayed at court and left little mark." }
        ]
      },
      throneDid: "The kingdom gave the refugees shelter, and the faith grew further with worship in Ge’ez.",
      matches: ["welcome"],
      record: [
        { tag: "chapter", text: "“About a century later, Christianity in Ethiopia grew further as the state offered refuge to Christians fleeing persecution due to doctrinal disputes within the Church.”", ref: "Section 9.6" },
        { tag: "chapter", text: "The nine priests “maintained ties with the Coptic Church in Egypt and developed a distinct liturgy using Ge’ez, the local language.”", ref: "Section 9.6" },
        { tag: "legend", text: "Ethiopian tradition remembers them as the Nine Saints. Their life stories were written down centuries later. Tradition says they founded monasteries, including Debre Damo on its cliff, helped translate scripture into Ge’ez, and turned the ancient temple at Yeha into a church.", ref: "Ethiopian lives of the saints" }
      ],
      compare: "Look at Figures 9.6 and 9.7 in your chapter. The temple at Yeha once carried the old disc and crescent. Tradition says one of the Nine Saints made it a church. Debre Damo is the monastery on the cliff.",
      readMore: "The 9.6 paragraph about the nine priests, and the caption of Figure 9.7, Debre Damo.",
      missing: "We hear about the priests who came. We hear nothing from the villagers who listened.",
      placement: {
        historian: "people-outside",
        why: "Refugees from outside carried the faith beyond the court, in the language the people spoke. The king allowed it, but the push came from the priests and reached the villages. This is the first time the record shows the faith moving outward from the capital."
      }
    },

    emperor: {
      number: 4,
      short: "Emperor",
      title: "The Emperor’s New Faith",
      when: "The 1620s CE",
      ruler: "Emperor Susenyos",
      scene: [
        "Almost thirteen centuries after Ezana, Ethiopia is still a Christian kingdom. Its church worships in Ge’ez and looks to Egypt for its bishops.",
        "In the last century, Portuguese soldiers helped Ethiopian Christians in a war against a powerful Muslim sultanate. Catholic priests from Europe came after them and stayed.",
        "Now Emperor Susenyos has become a Catholic himself. He wants the whole realm to follow him, accept the pope’s authority, and change the old church’s customs.",
        "He asks whether he should order it."
      ],
      summons: {
        ask: "“Remind me. When the Portuguese first came, which sultanate did my ancestors join them to fight?”",
        answers: ["adal"],
        hint: "Read the last paragraph of 9.6.",
        found: "“Adal. The Portuguese were good allies in war. I hope they are good guides in faith.”"
      },
      cards: [
        { id: "e1", title: "A king led once before", about: "a king leading the faith", tag: "chapter",
          quote: "…guided the king of Aksum, King Ezana (r. 325 – 350 CE), in his conversion to Christianity." },
        { id: "e2", title: "An old alliance", about: "the alliance with Portugal", tag: "chapter",
          quote: "In the sixteenth century, Ethiopian Christians allied with the Portuguese to fight against the Adal Sultanate." },
        { id: "e3", title: "The people’s own church", about: "the church’s own language and ties", tag: "chapter",
          quote: "They maintained ties with the Coptic Church in Egypt and developed a distinct liturgy using Ge’ez, the local language." },
        { id: "e4", title: "Solomon’s line", about: "the church’s own traditions", tag: "chapter",
          quote: "Members of the Ethiopian Orthodox Church also incorporated local beliefs, such as the legendary connection to King Solomon, into their religious traditions." },
        { id: "e5", title: "Neighbors of another faith", about: "living beside another faith", tag: "chapter",
          quote: "From the tenth through fourteenth centuries, Muslim traders and Christian elites often cooperated. (Paraphrased from 9.6.)" }
      ],
      question: "“Should I order the realm to follow me?”",
      options: [
        { id: "order", label: "Order it. When the emperor believes, the realm should follow.",
          cost: "Monks, priests and villagers who hold to the old church may resist. Some may take up arms.",
          supports: {
            e1: "Christianity in this land began with a king’s conversion. A ruler leading his people in faith has precedent.",
            e2: "Portugal stood with Ethiopia in war. Joining its church could bind the alliance tighter."
          } },
        { id: "private", label: "Keep your faith as your own. Do not impose it on the realm.",
          cost: "Rome and the Portuguese will be disappointed. The alliance may cool.",
          supports: {
            e3: "The church worships in its own language and keeps its own ties to Egypt. People will not easily give up something so much their own.",
            e4: "The church’s traditions, like the tie to Solomon, are woven into who the people are and who their kings are."
          } },
        { id: "both", label: "Let both churches stand side by side.",
          cost: "Two churches compete for the same villages. Each side may see the emperor as weak.",
          supports: {
            e5: "Ethiopians have lived and traded beside people of another faith before. Two churches could share the realm too."
          } }
      ],
      forecast: {
        ask: "What happened when the throne tried to change the people’s faith? Your chapter tells you.",
        options: [
          { id: "accepted", label: "The realm became Catholic and stayed Catholic." },
          { id: "rejected", label: "Ethiopian Christians rejected it, and the missionaries were forced out in 1633.", correct: true },
          { id: "dropped", label: "The emperor dropped the idea before announcing it." }
        ]
      },
      throneDid: "Susenyos ordered it. Six years later he took it back.",
      matches: ["order"],
      record: [
        { tag: "chapter", text: "“After the fall of the Adal Sultanate, Ethiopian Christians rejected Portuguese attempts to convert them to Catholicism and forced Portuguese missionaries out of the region in 1633 CE.”", ref: "Section 9.6" },
        { tag: "other", text: "Susenyos announced that he was Catholic in the early 1620s. In 1626 he and Afonso Mendes, a patriarch sent from Rome, declared the realm Catholic. Mendes began changing old customs, such as keeping a Saturday Sabbath and the church’s fasts. Revolts and civil war followed.", ref: "Jesuit letters from Ethiopia, 1609-1641" },
        { tag: "other", text: "In 1632 Susenyos allowed the old faith again and gave up the throne to his son Fasilides. In 1633 Fasilides expelled the Jesuit missionaries.", ref: "Jesuit letters from Ethiopia, 1609-1641" }
      ],
      compare: "Your chapter says “Ethiopian Christians” refused. Think about who that word covers beyond the court.",
      readMore: "The last paragraph of 9.6.",
      missing: "The soldiers and villagers who died in the civil war, on both sides, carried the cost.",
      placement: {
        historian: "throne-people",
        why: "A throne pushed and the people pushed back. The faith that first came through a king in Ezana’s day was, by the 1600s, held from below firmly enough to overturn an emperor’s order."
      }
    }
  },

  challenges: {
    "frumentius-date": {
      title: "A date that does not fit",
      intro: "Historians check a source against itself and against other sources. Check this sentence from your chapter.",
      claim: "“One of the Syrians, Frumentius, was particularly influential because he became the first bishop of Ethiopia in 303 CE and guided the king of Aksum, King Ezana (r. 325 – 350 CE), in his conversion to Christianity.”",
      evidence: [
        { tag: "other", text: "Rufinus says Frumentius went to Alexandria in Egypt and asked its bishop, Athanasius, to send a bishop to Aksum. Athanasius made Frumentius bishop himself.", ref: "Rufinus, Church History 10.10" },
        { tag: "other", text: "Athanasius became bishop of Alexandria in 328 CE.", ref: "Index to the Festal Letters of Athanasius" },
        { tag: "other", text: "About 356 CE the Roman emperor Constantius II wrote to “Aizanas and Sazanas,” the rulers of Aksum. He demanded that they send their bishop Frumentius to Egypt to have his teaching checked. Athanasius copied the letter into his own defense.", ref: "Athanasius, Defense before Constantius 31" }
      ],
      prompt: "Check the dates against each other. Could Athanasius make anyone a bishop in 303?",
      scored: true,
      answer: "partly",
      rulings: {
        supported: "A historian arguing this would say Frumentius really was the first bishop and really did guide Ezana. But the date sinks this ruling. Athanasius could not make anyone a bishop before 328.",
        partly: "Frumentius as first bishop and as Ezana’s guide fits Rufinus and the emperor’s letter. The year 303 fits nothing. He was made bishop no earlier than 328, and the letter shows him serving under Ezana in the 350s.",
        not: "A historian arguing this would point to the wrong date. But that throws out too much. The rest of the sentence is backed by two separate sources."
      },
      afterword: "Even a good textbook can slip. Checking a date against the people in the story is one of a historian’s simplest tools."
    },

    "nine-priests": {
      title: "Who founded the church?",
      intro: "Words like “founded” carry a lot of weight. Check this sentence from your chapter.",
      claim: "“Nine priests, breaking with the Church in Jerusalem, settled in Ethiopia and founded the Ethiopian Orthodox Church.”",
      evidence: [
        { tag: "chapter", text: "Your chapter also says Frumentius became the first bishop and guided Ezana’s conversion, more than a century before the nine priests arrived.", ref: "Section 9.6" },
        { tag: "legend", text: "Ethiopian tradition credits the Nine Saints with monasteries and with scripture and worship in Ge’ez.", ref: "Ethiopian lives of the saints" },
        { tag: "other", text: "From Frumentius onward, the head bishop of the Ethiopian church was sent from Alexandria in Egypt. That practice lasted until 1959.", ref: "Histories of the Ethiopian Orthodox Church" }
      ],
      prompt: "Ask what exactly was new when the nine priests arrived.",
      scored: false,
      answer: "partly",
      rulings: {
        supported: "A historian arguing this would say the church’s lasting shape, with its monasteries and its worship in Ge’ez, comes from the nine priests. In that sense they founded the church Ethiopians know.",
        partly: "A church with a bishop already existed from Ezana’s time. The nine priests spread it into the countryside and gave it much of its lasting form.",
        not: "A historian arguing this would say the claim gets the order wrong. The church existed for over a century before the priests arrived, so the founding belongs to Frumentius and Ezana."
      },
      afterword: "When a source says someone founded something, ask what was already there."
    }
  },

  chronicle: {
    title: "Your Chronicle",
    intro: "Here is everything you advised, forecast and placed. It stays in this game. Keep it open while you write your assignment.",
    incomplete: "Finish all four audiences to complete your Chronicle.",
    triangleTitle: "Where the pushes came from",
    triangleYou: "Your placements",
    triangleHistorian: "A historian’s placements",
    entryAdvised: "You advised",
    entryCard: "Your first card",
    entryCardFit: "fit your advice",
    entryCardMiss: "did not fit your advice",
    entryForecast: "Your forecast",
    entryForecastRight: "matched the record",
    entryForecastWrong: "did not match the record",
    entryThrone: "What the throne did",
    partedTitle: "Where you and the throne parted ways",
    partedSame: "You advised what the throne did.",
    partedDifferent: "You advised something different from what the throne did.",
    partedNone: "You advised what the throne did every time. Look at what followed in the last audience.",
    challengesTitle: "Your Scribe’s Challenges",
    questionsTitle: "Questions to carry into your assignment",
    questions: [
      "Which three moments in your Chronicle changed Christianity in Aksum the most? What happened in each, and what did it change?",
      "Look at the historian’s triangle. Did the faith in Aksum spread from the top, from the bottom, or by another road?",
      "Before you call one road better, choose your measure. Is it how long the faith lasted, how deeply people held it, or whether anyone was forced?"
    ]
  },

  about: {
    title: "About this game",
    paragraphs: [
      "The Counselor of Aksum is a learning game for Chapter 9 of World History: Cultures, States, and Societies to 1500. It works alongside the chapter and sends students back into it at every step.",
      "The scenes, the voices of the rulers, the counsel options and their costs are imagined for the game. There was no office called Counselor of the Throne. The record step shows what the sources say, and every claim carries a tag that says where it comes from.",
      "This is a draft for instructor and specialist review. It has not yet been tried with students."
    ],
    sourcesTitle: "Sources",
    sources: [
      { text: "Charlotte Miller, “African History to 1500,” Chapter 9 of World History: Cultures, States, and Societies to 1500. CC BY-SA 4.0. Card quotes come from section 9.6.", url: "https://alg.manifoldapp.org/read/world-history/section/d6c690eb-3f5f-4fcc-9a6d-0034db7aea4f" },
      { text: "Rufinus of Aquileia, Church History 10.9-10, written about 402 CE, on Frumentius and Aedesius." },
      { text: "Athanasius, Defense before Constantius 31, with the letter of Constantius II to the rulers of Aksum, about 356 CE.", url: "https://sacred-texts.com/chr/ecf/204/2040296.htm" },
      { text: "British Museum records for gold coins of Ezana, 1989,0518.41 and 1921,0316.1." },
      { text: "CoinWeek, “The Coinage of Aksum.”", url: "https://coinweek.com/the-coinage-of-aksum/" },
      { text: "Leonardo Cohen and others, The Jesuits in Ethiopia (1609-1641): Latin Letters in Translation. Harrassowitz.", url: "https://www.harrassowitz-verlag.de/title_2828.ahtml" }
    ],
    creditsTitle: "Credits",
    credits: [
      { text: "Coin photos by Ismoon, CC BY-SA 4.0, via Wikimedia Commons. The coins are in the British Museum." },
      { text: "Fonts: Righteous and DM Sans, SIL Open Font License, served from this site." },
      { text: "Visual style: Groovy, from claude-design-styles by Chris McCoy.", url: "https://github.com/chrismccoy/claude-design-styles" },
      { text: "Game text is shared under CC BY-SA 4.0, the same license as the chapter it quotes." }
    ]
  }
};
