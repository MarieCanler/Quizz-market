// Barème total : 3 points, pondéré selon la difficulté et le nombre de réponses.
// correct = index des bonnes réponses (0 = première option).
// multi = true quand l'énoncé indique "plusieurs réponses possibles".
module.exports = [
  {
    text: "Comment expliquez-vous ce qu'est l'expérience client omnicanale à quelqu'un qui ne connaît pas ce terme ?",
    options: [
      "C'est une expérience qui se passe au bord d'un canal",
      "C'est une expérience qui peut passer par plusieurs canaux d'achat",
      "C'est une expérience qui permet d'enrichir ses connaissances",
      "C'est une expérience pour enrichir la relation client"
    ],
    correct: [1, 3],
    multi: true,
    points: 0.3
  },
  {
    text: "Dans les situations suivantes, quelle situation relève d'une distribution omnicanale ?",
    options: [
      "Vous surfez sur un site de vêtements et mettez des articles dans votre panier. En boutique, la vendeuse vous demande si vous êtes dans le fichier client et vous apporte en cabine les articles vus sur le site.",
      "Vous surfez sur un site de chaussures et mettez des baskets dans votre panier. Vous les essayez en boutique, puis de retour chez vous, vous achetez votre paire préférée car il y a une promo intéressante.",
      "Vous surfez sur un site de lunettes et mettez plusieurs paires dans votre panier. En magasin, vous voulez les essayer, mais la collection vendue en magasin n'est pas la même que celle du site."
    ],
    correct: [0],
    multi: false,
    points: 0.25
  },
  {
    text: "Récemment, et particulièrement depuis la crise du Covid, les modes de consommation ont évolué. Qu'a-t-on constaté en particulier ?",
    options: [
      "La croissance du marché de la seconde main",
      "Le développement du numérique",
      "L'invention de la vente « Click & Collect »"
    ],
    correct: [0, 1],
    multi: true,
    points: 0.25
  },
  {
    context: "Scénario : vous lancez votre marque de shampoings et après-shampoings à fabriquer soi-même.",
    text: "Vous souhaitez être présent dès le départ en distribution offline. Pour cela, vous décidez de :",
    options: [
      "Créer un site d'e-commerce et déployer une présence active sur les réseaux sociaux",
      "Créer un site d'e-commerce et animer régulièrement ce site vitrine",
      "Créer un site d'e-commerce et déployer une présence en Click & Collect et via les réseaux sociaux"
    ],
    correct: [2],
    multi: true,
    points: 0.3
  },
  {
    text: "« Torrel Beauty Hair » souhaite toucher le plus grand nombre de consommateurs possible, notamment pour créer du passage dans sa toute nouvelle boutique parisienne. Quelles actions allez-vous mettre en place ?",
    options: [
      "Développer une stratégie SoLoMo",
      "Faire un emailing sur une base de données locale",
      "Utiliser le geofencing pour une publicité locale",
      "Faire du phoning sur les habitants du quartier pour leur annoncer l'ouverture",
      "Utiliser le street marketing avec des étudiants distribuant des flyers"
    ],
    correct: [0, 1, 2, 4],
    multi: true,
    points: 0.4
  },
  {
    text: "Pour l'ouverture de votre boutique parisienne, vous souhaitez marquer le coup et créer une expérience client mémorable. Que faites-vous en termes de communication ?",
    options: [
      "Vous gardez la même identité et la même ligne expérientielle que sur le site d'e-commerce",
      "Vous innovez et déployez quelque chose de totalement différent pour surprendre vos clients",
      "Vous enrichissez l'expérience vécue sur le site mais gardez une cohérence entre vos canaux offline & online"
    ],
    correct: [2],
    multi: true,
    points: 0.25
  },
  {
    text: "C'est le jour J, la boutique est ouverte ! Quelles actions avez-vous prévues sur place pour rendre l'expérience de vos clients mémorable ?",
    options: [
      "Un petit cadeau (shampoing ou après-shampoing format voyage) pour tout achat pendant la semaine d'ouverture",
      "Un coupon de réduction pour tout achat supérieur à 50 € sur le site",
      "Vous les remerciez d'être venus découvrir la boutique",
      "Un échantillon offert à toute personne qui entre dans le magasin, pour découvrir vos produits chez elle"
    ],
    correct: [0, 3],
    multi: true,
    points: 0.3
  },
  {
    text: "Les tendances de consommation changent. Vous souhaitez mettre en place de nouvelles pratiques pour coller à ces tendances. Lesquelles choisiriez-vous ?",
    options: [
      "L'achat de vos matières premières en Chine pour proposer des produits moins chers",
      "La possibilité de remplir les contenants de vos shampoings & après-shampoings",
      "Le choix de fournisseurs locaux, autant que possible",
      "La mise en place de bacs de collecte des contenants recyclables"
    ],
    correct: [1, 2, 3],
    multi: true,
    points: 0.35
  },
  {
    text: "Votre responsable s'interroge sur les avantages, à court terme, d'une stratégie omnicanale pour une jeune entreprise comme « Torrel Beauty Hair ». Que lui répondez-vous ?",
    options: [
      "Cela va apporter une meilleure connaissance de ses clients",
      "Cela va apporter un accroissement immédiat du chiffre d'affaires",
      "Cela va apporter une présence sur plusieurs canaux de distribution",
      "Cela va apporter une culture client plus développée au sein de l'entreprise"
    ],
    correct: [0, 2, 3],
    multi: true,
    points: 0.35
  },
  {
    text: "Pour accroître votre chiffre d'affaires, vous souhaitez mettre en place une action marketing mais n'avez pas de budget. Quelles actions pouvez-vous mettre en place ?",
    options: [
      "Inciter à venir retirer en boutique les commandes passées sur le site",
      "Demander à l'équipe Marketing une journée de distribution de flyers devant la boutique",
      "Utiliser le passage généré par l'ouverture de la boutique pour mettre en avant et faire connaître le site"
    ],
    correct: [0, 2],
    multi: true,
    points: 0.25
  }
];
