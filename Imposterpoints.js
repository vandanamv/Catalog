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

    static identifyImposterPoints(points, threshold = 100) {
        const n = points.length;
        const residuals = [];
        const predictedValues = [];

        // Calculate the predicted values using Lagrange interpolation
        for (let i = 0; i < n; i++) {
            const predictedValue = this.lagrangeInterpolation(points.map((_, idx) => (idx !== i ? points[idx] : [0, 0])));
            predictedValues.push(predictedValue);
            residuals.push(Math.abs(points[i][1] - predictedValue));
        }

        // Combine residuals with their respective points
        const residualPointPairs = points.map((point, index) => ({
            point,
            residual: residuals[index]
        }));

        // Filter points with high residuals, sort them by residual value (high to low)
        const imposterPoints = residualPointPairs
            .filter(pair => pair.residual > threshold)
            .sort((a, b) => b.residual - a.residual)
            .slice(0, 1) // Get at most 3 points

        return imposterPoints.map(pair => pair.point);
    }

    static main() {
        fs.readFile('testcase2.json', 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading the file:", err);
                return;
            }

            const jsonData = JSON.parse(data);
            const { n } = jsonData.keys;

            const points = [];

            for (let i = 1; i <= n; i++) {
                const key = String(i);
                if (jsonData.hasOwnProperty(key)) {
                    const { base, value } = jsonData[key];
                    const x = i;
                    const y = this.decodeBase(value, parseInt(base));
                    points.push([x, y]);
                } else {
                    // If the key is missing, treat its value as 0
                    points.push([i, 0]);
                }
            }

            const constantTerm = this.lagrangeInterpolation(points);
            console.log("The constant term (c) of the polynomial is:", constantTerm);

            // Identify imposter points
            const imposterPoints = this.identifyImposterPoints(points);
            console.log("Identified imposter points:", imposterPoints);
        });
    }
}

PolynomialSolver.main();
