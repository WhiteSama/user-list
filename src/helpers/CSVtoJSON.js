export const csvJSON = (csv) => {
    const lines = csv.split("\n");

    let result = [];

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {

        let obj = {};
        let cl = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cl[j];
        }

        result.push(obj);
    }

    return JSON.stringify(result);
};
