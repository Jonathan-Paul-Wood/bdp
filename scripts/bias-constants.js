const BIAS_CONSTANTS_TYPE_LIST = {
    assertives: [
        "think",
        "believe",
        "suppose",
        "expect",
        "imagine",
        "guess",
        "seem",
        "appear",
        "figure",
        "acknowledge",
        "admit",
        "affirm",
        "allege",
        "answer",
        "argue",
        "assert",
        "assure",
        "certify",
        "charge",
        "claim",
        "contend",
        "declare",
        "divulge",
        "emphasize",
        "explain",
        "grant",
        "guarantee",
        "hint",
        "hypothesize",
        "imply",
        "indicate",
        "insist",
        "intimate",
        "maintain",
        "mention",
        "point out",
        "predict",
        "prophesy",
        "postulate",
        "remark",
        "reply",
        "report",
        "say",
        "state",
        "suggest",
        "swear",
        "testify",
        "theorize",
        "verify",
        "vow",
        "write",
        "agree",
        "afraid",
        "certain",
        "sure",
        "clear",
        "obvious",
        "evident",
        "calculate",
        "decide",
        "deduce",
        "estimate",
        "hope",
        "presume",
        "surmise",
        "suspect",
    ],
    factives: [
        "know",
        "realize",
        "regret",
        "forget",
        "find out",
        "discover",
        "learn",
        "note",
        "notice",
        "observe",
        "perceive",
        "recall",
        "remember",
        "reveal",
        "see",
        "resent",
        "amuse",
        "suffice",
        "bother",
        "make sense",
        "care",
        "odd",
        "strange",
        "interesting",
        "relevant",
        "sorry",
        "exciting",
    ],
    hedges: [
        "about",
        "almost",
        "apparent",
        "apparently",
        "appear",
        "appeared",
        "appears",
        "approximately",
        "around",
        "assume",
        "assumed",
        "certain amount",
        "certain extent",
        "certain level",
        "claim",
        "claimed",
        "could",
        "couldn't",
        "doubt",
        "doubtful",
        "essentially",
        "estimate",
        "estimated",
        "feel",
        "felt",
        "frequently",
        "from our perspective",
        "generally",
        "guess",
        "in general",
        "in most cases",
        "in most instances",
        "in our view",
        "indicate",
        "indicated",
        "largely",
        "likely",
        "mainly",
        "may",
        "maybe",
        "might",
        "mostly",
        "often",
        "on the whole",
        "ought",
        "perhaps",
        "plausible",
        "plausibly",
        "possible",
        "possibly",
        "postulate",
        "postulated",
        "presumable",
        "probable",
        "probably",
        "relatively",
        "roughly",
        "seems",
        "should",
        "sometimes",
        "somewhat",
        "suggest",
        "suggested",
        "suppose",
        "suspect",
        "tend to",
        "tends to",
        "typical",
        "typically",
        "uncertain",
        "uncertainly",
        "unclear",
        "unclearly",
        "unlikely",
        "usually",
        "would",
        "broadly",
        "tended to",
        "presumably",
        "suggests",
        "from this perspective",
        "from my perspective",
        "in my view",
        "in this view",
        "in our opinion",
        "in my opinion",
        "to my knowledge",
        "fairly",
        "quite",
        "rather",
        "argue",
        "argues",
        "argued",
        "claims",
        "feels",
        "indicates",
        "supposed",
        "supposes",
        "suspects",
        "postulates",
    ],
    implicatives: [
        "manage",
        "remember",
        "bother",
        "get",
        "dare",
        "care",
        "venture",
        "condescend",
        "happen",
        "fit",
        "careful",
        "misfortune",
        "sense",
        "succeed",
        "deign",
        "forget",
        "fail",
        "neglect",
        "decline",
        "avoid",
        "refrain",
        "choose",
        "able",
        "can",
        "cause",
        "force",
        "prevent",
        "preclude",
        "keep",
        "allow",
        "hesitate",
        "attempt",
    ],
}

const BIAS_EXPLANATIONS = {
    assertives_explain: "Assert a proposition. Many such verbs risk implying more or less certainty than is warranted by the raw facts.",
    factives_explain: "Taken as fact. These verbs presuppose the truth of their complement clause, and so can be used to imply that something is true without explicitly stating it.",
    hedges_explain: "Lessen commitment to a proposition. Indicates uncertainty and helps avoid overgeneralization.",
    implicatives_explain: "A type of entailment. These verbs state one thing but carry an implication of a second statement. For example, 'manage to' states that something was completed, but also implies that it was difficult."
}

const BIAS_CONSTANTS_MAP = new Map()

Object.keys(BIAS_CONSTANTS_TYPE_LIST).forEach((biasType) => {
    BIAS_CONSTANTS_TYPE_LIST[biasType].forEach((word) => {
        BIAS_CONSTANTS_MAP.set(word, biasType)
    })
})

function scoreBias(text) {
    const biasScores = {
        assertives: [],
        assertive_indexed: [],
        factives: [],
        factives_indexed: [],
        implicatives: [],
        implicatives_indexed: [],
        hedges: [],
        hedges_indexed: []
    }

    // Normalize the text to lowercase and split it into words
    const words = text.toLowerCase().split(/\s+/);

    // count occurrences of bias words, saving both the matches and their indices in the text
    words.forEach((word, word_index) => {
        if (BIAS_CONSTANTS_MAP.has(word)) {
            const biasType = BIAS_CONSTANTS_MAP.get(word);
            biasScores[biasType].push(word);
            biasScores[biasType + "_indexed"].push(word_index);
        }
    });

    return biasScores;
}

document.getElementById("analyze-page").addEventListener('click', () => {
  if (!pageDataExtractContent || pageDataExtractContent === 'No data yet') {
    alert('No data found to analyze.');
  } else {
    try {
        const biasResults = scoreBias(pageDataExtractContent);
        
        document.getElementById("assertives-count").textContent = biasResults.assertives.length;
        document.getElementById("factives-count").textContent = biasResults.factives.length;
        document.getElementById("implicatives-count").textContent = biasResults.implicatives.length;
        document.getElementById("hedges-count").textContent = biasResults.hedges.length;

        document.getElementById("bias-results").style.display = "block";
    } catch (error) {
        alert('Error analyzing page:', error);
    }
  }
})

var resetBiasResults = () => {
    document.getElementById("assertives-count").textContent = '0';
    document.getElementById("factives-count").textContent = '0';
    document.getElementById("implicatives-count").textContent = '0';
    document.getElementById("hedges-count").textContent = '0';

    document.getElementById("bias-results").style.display = "none";
}

/*
<div id="assertives-row">Assertives: <span id="assertives-count"></span></div>
                <div id="factives-row">Factives: <span id="factives-count"></span></div>
                <div id="implicatives-row">Implicatives: <span id="implicatives-count"></span></div>

*/