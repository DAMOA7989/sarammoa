export const intersection = (setA, setB) => {
    const result = new Set();

    for (const elem of setA) {
        if (setB.has(elem)) {
            result.add(elem);
        }
    }

    return result;
};
