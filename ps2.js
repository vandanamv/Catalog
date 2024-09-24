const fs = require('fs');

class PolynomialSolver {
    static decodeBase(value, base) {
        return parseInt(value, base);
    }

    static lagrangeInterpolation(points) {
        const n = points.length;
        let constantTerm = 0;

        for (let i = 0; i < n; i++) {
            const [xi, yi] = points[i];
            let li = 1;

            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    const xj = points[j][0];
                    li *= (0 - xj) / (xi - xj);
                }
            }
            constantTerm += yi * li;
        }

        return constantTerm;
    }

    static main() {
        fs.readFile('testcase2.json', 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                return;
            }

            const jsonData = JSON.parse(data);
            const { n, k } = jsonData.keys;

            const points = [];

            for (let i = 1; i <= n; i++) {
                const key = String(i);
                if (jsonData.hasOwnProperty(key)) {
                    const { base, value } = jsonData[key];
                    const x = i;
                    const y = this.decodeBase(value, parseInt(base));
                    points.push([x, y]);
                }
            }

            const constantTerm = this.lagrangeInterpolation(points);
            console.log("The constant term (c) of the polynomial is:", constantTerm);
        });
    }
}

PolynomialSolver.main();
