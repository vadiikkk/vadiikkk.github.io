export default class CountMinSketch {
    constructor(options) {
        if ('rowsNumber' in options && 'colsNumber' in options) {
            this.initializeWithDimensions(options.rowsNumber, options.colsNumber);
        } else if ('epsilon' in options && 'delta' in options) {
            this.initializeWithAccuracy(options.epsilon, options.delta);
        } else {
            throw new Error('Incorrect or insufficient parameters provided for CountMinSketch');
        }
    }

    initializeWithDimensions(rowsNumber, colsNumber) {
        this.rowsNumber = rowsNumber;
        this.colsNumber = colsNumber;
        this.epsilon = Math.E / colsNumber;
        this.delta = 1 / (Math.E ** rowsNumber);
        this.table = Array.from({ length: rowsNumber }, () => new Array(colsNumber).fill(0));
        this.realObjects = [];
    }

    initializeWithAccuracy(epsilon, delta) {
        this.epsilon = epsilon;
        this.delta = delta;
        this.colsNumber = Math.ceil(Math.E / epsilon);
        this.rowsNumber = Math.ceil(Math.log(1 / delta));
        this.table = Array.from({ length: this.rowsNumber }, () => new Array(this.colsNumber).fill(0));
        this.realObjects = [];
    }

    add(item) {
        const indices = this.getHashIndices(item);
        indices.forEach((index, row) => {
            this.table[row][index]++;
        });
        this.realObjects.push(item);
    }

    count(item) {
        const indices = this.getHashIndices(item);
        const counts = indices.map((index, row) => this.table[row][index]);
        return Math.min(...counts);
    }

    getHashIndices(obj) {
        const indices = [];
        const salts = ['kj7dj', 'cc790', 'vk6da', 'ignc3', '247fd', 'dsn78'];

        for (let i = 0; i < this.rowsNumber; ++i) {
            const modifiedObj = obj + salts[i % salts.length];

            const hash1 = this.hashCode(modifiedObj);
            const hash2 = this.secondHashCode(modifiedObj);

            const combinedHash = hash1 | hash2;

            const index = Math.abs(combinedHash % this.colsNumber);
            indices.push(index);
        }
        return indices;
    }

    hashCode(value) {
        let hash = 5381;
        const string = value.toString();

        for (let i = 0; i < string.length; ++i) {
            const charCode = string.charCodeAt(i);
            hash = ((hash << 5) + hash) + charCode;
        }

        return hash;
    }

    secondHashCode(value) {
        let hash = 16777619;
        const string = value.toString();

        for (let i = 0; i < string.length; ++i) {
            const charCode = string.charCodeAt(i);
            hash = (hash << 6) + (hash << 16) - hash + charCode;
        }

        return Math.abs(hash);
    }
}
