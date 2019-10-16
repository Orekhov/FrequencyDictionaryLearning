
/*
Testing string:
Mr. Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it. Did he mind? Adam Jones Jr. thinks he didn't. In any case, this isn't true... Well, with a probability of .9 it isn't. Mr. Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it. Did he mind? Adam Jones Jr. thinks he didn't. In any case, this isn't true... Well, with a probability of .9 it isn't. Mr. Smith bought cheapsite.com for 1.5 million dollars, i.e. he paid a lot for it. Did he mind? Adam Jones Jr. thinks he didn't.
*/
function splitIntoSentences(inputString) {
    const allSentences = inputString.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/);
    return allSentences.filter(t => {
        return t !== "";
    }).map(t => {
        return t.toLowerCase();
    })
}

/* Han er fra Sør-Amerika.Nord- og Sør-Trøndelag og Vest- og Aust-Agder er fire av Norges nitten fylker. Den ene mynten var en 10-øring. I årets kommunevalg fikk Venstre et valgresultat på 3,9 prosent. Jeg gjorde ingenting med saken – og det burde det ikke være så vanskelig å forstå. Jeg er 27 år gammel. Hun løp ned gang- og sykkelveien. Han skal holde 17. mai-talen.
   Mette Mari Sønstebø Østad (39) smiler mens hun ser datteren Hennie (4) streve med en handlepose i retning kjøkkenet i familiens hus i Asker.
   - Jeg pleier stort sett å gå gjennom kjøleskapet for å se hva vi har på søndager, så planlegger jeg middagene ut fra det. Matvarene fra Kolonial leveres på mandag, og da har vi alt som trengs hele uken, sier Mette Mari. Jeg har Tur-retur-billett. Han sa: «Jeg har vært hjemme i hele dag.» 
*/
function tokenize(inputString) {
    const better_regexp = /[0-9A-Za-z_æøåÆØÅäÄöÖüÜ]+((\-|\,)?[0-9A-Za-z_æøåÆØÅäÄöÖüÜ]*)*/g; // for more complex ngrams
    let allTokens = [...inputString.matchAll(better_regexp)];
    return allTokens;
}

module.exports = {
    splitIntoSentences: splitIntoSentences,
    tokenize: tokenize
}