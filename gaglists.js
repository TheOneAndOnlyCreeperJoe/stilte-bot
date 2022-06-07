// Sequestered here because they're bulky. Exports at bottom of the file.

// Yes, we define the alphabet, because values have to be numbers.

const ballGagTable = {
    a: {standard: "n" },
    b: {standard: "h" },
    c: {standard: "c" },
    d: {standard: "n"},
    e: {standard: "m"},
    f: {standard: "f"}, 
    g: {standard: "g"},
    h: {standard: "h"},
    i: {standard: "n"},
    j: {standard: "n"},
    k: {standard: "h"},
    l: {standard: "m"},
    m: {standard: "m"},
    n: {standard: "n"},
    o: {standard: "n"},
    p: {standard: "p"},
    q: {standard: "g"},
    r: {standard: "r"},
    s: {standard: "ph"}, 
    t: {standard: "ph"},
    u: {standard: "n"},
    v: {standard: "f"},
    w: {standard: "mm"},
    x: {standard: "gh"}, 
    y: {standard: "m"},
    z: {standard: "ph"},
    // NUMBERS
    0: {standard: "phmrn"},
    1: {standard: "nnm"},
    2: {standard: "phmmn"},
    3: {standard: "phhrmm"},
    4: {standard: "fnnr"},
    5: {standard: "fnfm"},
    6: {standard: "phngh"},
    7: {standard: "phmfmn"},
    8: {standard: "mnghph"},
    9: {standard: "nnm"},
    // LIMITED PUNCTUATION
    '\"': {standard: "\""},
    '!': {standard: "!"},
    '.': {standard: "."},
    '?': {standard: "?"},
    ',': {standard: ","},
    ':': {standard: ":"},
    ';': {standard: ";"},
    ' ': {standard: " "},
    '~': {standard: "~"},
}

const muzzleTable = {
    a: {standard: "r" },
    b: {standard: "h" },
    c: {standard: "c" },
    d: {standard: "n"},
    e: {standard: "m"},
    f: {standard: "h"}, 
    g: {standard: "g"},
    h: {standard: "h"},
    i: {standard: "n"},
    j: {standard: "h"},
    k: {standard: "ch"},
    l: {standard: "r"},
    m: {standard: "m"},
    n: {standard: "n"},
    o: {standard: "r"},
    p: {standard: "h"},
    q: {standard: "c"},
    r: {standard: "r"},
    s: {standard: "h"}, 
    t: {standard: "h"},
    u: {standard: "r"},
    v: {standard: "h"},
    w: {standard: "m"},
    x: {standard: "ch"}, 
    y: {standard: "m"},
    z: {standard: "h"},
    // NUMBERS
    0: {standard: "rnm"},
    1: {standard: "hmr"},
    2: {standard: "hhrmm"},
    3: {standard: "hrrr"},
    4: {standard: "hnhm"},
    5: {standard: "hnch"},
    6: {standard: "hmhmn"},
    7: {standard: "mnghh"},
    8: {standard: "nnnm"},
    9: {standard: "hmn"},
    // LIMITED PUNCTUATION
    '\"': {standard: "\""},
    '!': {standard: "!"},
    '.': {standard: "."},
    '?': {standard: "?"},
    ',': {standard: ","},
    ':': {standard: ":"},
    ';': {standard: ";"},
    ' ': {standard: " "},
    '~': {standard: "~"},
}

const ringGagTable = {
    a: {standard: "a" },
    b: {standard: "h" },
    c: {standard: "c" },
    d: {standard: "n"},
    e: {standard: "e"},
    f: {standard: "h"}, 
    g: {standard: "h"},
    h: {standard: "h"},
    i: {standard: "i"},
    j: {standard: "gh"},
    k: {standard: "ch"},
    l: {standard: "u"},
    m: {standard: "nh"},
    n: {standard: "n"},
    o: {standard: "o"},
    p: {standard: "ch"},
    q: {standard: "ch"},
    r: {standard: "u"},
    s: {standard: "h"}, 
    t: {standard: "gh"},
    u: {standard: "u"},
    v: {standard: "gh"},
    w: {standard: "uu"},
    x: {standard: "ch"}, 
    y: {standard: "y"},
    z: {standard: "gh"},
    // NUMBERS
    0: {standard: "gheuo"},
    1: {standard: "one"},
    2: {standard: "ghuoo"},
    3: {standard: "ghhuee"},
    4: {standard: "houee"},
    5: {standard: "highe"},
    6: {standard: "hich"},
    7: {standard: "heghen"},
    8: {standard: "eihhgh"},
    9: {standard: "nine"},
    // LIMITED PUNCTUATION
    '\"': {standard: "\""},
    '!': {standard: "!"},
    '.': {standard: "."},
    '?': {standard: "?"},
    ',': {standard: ","},
    ':': {standard: ":"},
    ';': {standard: ";"},
    ' ': {standard: " "},
    '~': {standard: "~"},
}

const cockGagTable = {
    a: { standard: "m" },
    b: { standard: "m" },
    c: {opener: "m", standard: "r" },
    d: {opener: "u", standard: "h"},
    e: {standard: "m"},
    f: {opener: ".", standard: ".", closer: "." }, // So we don't get periods everywhere.
    g: {standard: "g", closer: "h" },
    h: {standard: "h", closer: "m" },
    i: {standard: "m"},
    j: {opener: "h", standard: "u", closer: "h" },
    k: {standard: "m", closer: "n" },
    l: {opener: "m", standard: "l"},
    m: {standard: "m"},
    n: {opener: "m", standard: "n"},
    o: {opener: "h", standard: "m", closer: "u" },
    p: {opener: "m", standard: "h"},
    q: {standard: "h", closer: "m" },
    r: {opener: "h", standard: "r"},
    s: {opener: ".", standard: ".", closer: "." }, // So we don't get periods everywhere.
    t: {opener: "m", standard: "h"},
    u: {opener: "u", standard: "h"},
    v: {opener: "v", standard: "h", closer: "f" },
    w: {opener: "m", standard: "h", closer: "m" },
    x: {opener: ".", standard: ".", closer: "." }, // So we don't get periods everywhere.
    y: {opener: "m", standard: "u"},
    z: {standard: "m"},
    // NUMBERS
    0: {standard: "mmhrhmu"},
    1: {standard: "hmumnm"},
    2: {standard: "mhmhmhmu"},
    3: {standard: "mhhmhrmm"},
    4: {standard: "...hmuuhhr"},
    5: {standard: "...mvhfm"},
    6: {standard: "...m..."},
    7: {standard: "...mvhfmmn"},
    8: {standard: "mmghhmmh"},
    9: {standard: "mnmmnm"},
    // LIMITED PUNCTUATION
    '\"': {standard: "\""},
    '!': {standard: "!"},
    '.': {standard: "."},
    '?': {standard: "?"},
    ',': {standard: ","},
    ':': {standard: ":"},
    ';': {standard: ";"},
    ' ': {standard: " "},
    '~': {standard: "~"},
}

const bitGagTable = {
    a: { standard: "a", closer: "w" },
    b: { standard: "u", closer: "fh" },
    c: { opener: "u", standard: "rh" },
    d: {standard: "a", closer: "ul"},
    e: {standard: "u", closer: "h"},
    f: {standard: "f", closer: "pu" }, 
    g: {standard: "g"},
    h: {opener: "u", standard: "h"},
    i: {standard: "i", closer: "h"},
    j: {standard: "e", closer: "h" },
    k: {opener: "h", standard: "u"},
    l: {opener: "u", standard: "e"},
    m: {opener: "v", standard: "h"},
    n: {opener: "v", standard: "u"},
    o: {standard: "o", closer: "h" },
    p: {opener: "v", standard: "f"},
    q: {opener: "h", standard: "u", closer: "e" },
    r: {standard: "u", closer: "r"},
    s: {standard: "f", closer: "u" }, 
    t: {opener: "p", standard: "f"},
    u: {standard: "u", closer: "h"},
    v: {opener: "v", standard: "z"},
    w: {opener: "v", standard: "z"},
    x: {standard: "f", closer: "u" }, 
    y: {opener: "i", standard: "h"},
    z: {opener: "z", standard: "u"},
    // NUMBERS
    0: {standard: "zuuhuroh"},
    1: {standard: "ohvuuh"},
    2: {standard: "pfvzoh"},
    3: {standard: "pfuhuruuh"},
    4: {standard: "fpuohuhur"},
    5: {standard: "fpuihvzuh"},
    6: {standard: "fuihfu"},
    7: {standard: "fuuhvzuhvu"},
    8: {standard: "uhihguhpf"},
    9: {standard: "vuihvuuh"},
    // LIMITED PUNCTUATION
    '\"': {standard: "\""},
    '!': {standard: "!"},
    '.': {standard: "."},
    '?': {standard: "?"},
    ',': {standard: ","},
    ':': {standard: ":"},
    ';': {standard: ";"},
    ' ': {standard: " "},
    '~': {standard: "~"},
}

exports.ballGagTable = ballGagTable
exports.muzzleTable = muzzleTable
exports.ringGagTable = ringGagTable
exports.cockGagTable = cockGagTable
exports.bitGagTable = bitGagTable