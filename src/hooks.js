import {extractTraits, findBestMatch} from soundbytrait.js

Hooks.on("updateActor", (arg0, arg1, arg2, arg3) => {
    console.log(arg2)
    let isDamageTaken = checkIfHookIsDamageTaken(arg2);
    if (isDamageTaken) {
        ChatMessage.create({ content: "I took damage! Ow!" });}
        myRollOptions = arg0.flags.pf2e.rollOptions.all;
        let myTraits = extractTraits(myRollOptions)
        let myBestMatch = findBestMatch(myTraits);
        console.log(myBestMatch);
        let returnedSounds = myBestMatch.files;
        const randomIndex = Math.floor(Math.random() * myArray.length);
        const soundSelected = returnedSounds[randomIndex];
        AudioHelper.play({
            src: soundSelected,
            volume: 0.7,
            autoplay: true,
            loop: false
        }, true);
    });

function checkIfHookIsDamageTaken(args) {
    return "damageTaken" in args
}