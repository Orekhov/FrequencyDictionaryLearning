const splitIntoSentencesTestCases = [{
    text: `Mr. Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it. Did he mind? Adam Jones Jr. thinks he didn't. In any case, this isn't true... Well, with a probability of .9 it isn't.`,
    sentences: 5
}, {
    text: `Erlend Loe

        HELVETE
        
        
        
        ILLUSTRASJONER:
        
        Kim Hiorthøy
        
        
        `,
    sentences: 4
}, {
    text: `Dei står på toppen og seier: Er det sanning dette no då? Er det heilt sikkert at vi kan flyge? Javisst er det sikkert, seier eg.`,
    sentences: 3
}, {
    text: `       My name is Artemy.     `,
    sentences: 1,
    sentence1: 'my name is artemy.'
}, {
    text: `
Det danske diktet er skrevet av Birthe Arnbak (1923-2007).

Illustrasjoner: Kim Hiorthøy
    
Omslagsdesign: Kim Hiorthøy
`,
    sentences: 3,
    sentence1: 'det danske diktet er skrevet av birthe arnbak (1923-2007).'
}, {
    text: `
Elektronisk tilrettelegging: Cappelen Damm AS, 2019

www.cappelendamm.no
    `,
    sentences: 2,
    sentence1: 'elektronisk tilrettelegging: cappelen damm as, 2019'
}];

module.exports = {
    splitIntoSentencesTestCases: splitIntoSentencesTestCases
}