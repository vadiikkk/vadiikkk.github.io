export default class BloomFilter {
  constructor(options) {
    if ('hashNumber' in options && 'itemNumber' in options) {
      this.initializeWithHashes(options.hashNumber, options.itemNumber);
    } else if ('bitVectorSize' in options && 'itemNumber' in options) {
      this.initializeWithSize(options.bitVectorSize, options.itemNumber);
    } else {
      throw new Error('Incorrect or insufficient parameters provided for BloomFilter');
    }
  }

  initializeWithHashes(hashNumber, itemNumber) {
    this.hashNumber = hashNumber;
    this.itemNumber = itemNumber;
    this.bitVectorSize = Math.ceil(1.44 * hashNumber * itemNumber);
    this.filter = new Array(this.bitVectorSize).fill(false);
    this.realObjects = new Set();
  }

  initializeWithSize(bitVectorSize, itemNumber) {
    this.hashNumber = Math.ceil(bitVectorSize / (1.44 * itemNumber));
    this.itemNumber = itemNumber;
    this.bitVectorSize = bitVectorSize;
    this.filter = new Array(this.bitVectorSize).fill(false);
    this.realObjects = new Set();
  }

  add(obj) {
    const indices = this.getHashIndices(obj);
    indices.forEach(index => { this.filter[index] = true; });
    this.realObjects.add(obj);
  }

  verify(obj) {
    const indices = this.getHashIndices(obj);
    const result = indices.every(index => this.filter[index]);
    return result;
  }

  getHashIndices(obj) {
    const indices = [];
    const salts = ['kj7dj', 'cc790', 'vk6da', 'ignc3', '247fd', 'dsn78'];

    for (let i = 0; i < this.hashNumber; ++i) {
      const modifiedObj = obj + salts[i % salts.length];

      const hash1 = this.hashCode(modifiedObj);
      const hash2 = this.secondHashCode(modifiedObj);

      const combinedHash = hash1 | hash2;

      const index = Math.abs(combinedHash % this.bitVectorSize);
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

  isFull() {
    return this.filter.every(bit => bit === true);
  }

  getFalsePositive() {
    return this.isFull() ? 1 : (1 - Math.E ** (-this.hashNumber * this.realObjects.size / this.bitVectorSize)) ** this.hashNumber;
  }
}