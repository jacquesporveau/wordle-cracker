export const getLetterWeights = ({ words, }) => {
    return words.reduce((acc, word) => {
        word.split("").forEach((letter) => {
            acc[letter] = (acc[letter] || 0) + 1;
        });
        return acc;
    }, {});
};
//# sourceMappingURL=get-letter-weights.js.map