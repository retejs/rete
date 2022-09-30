import { Data } from './data';

export class Validator {

    static isValidData(data: Data) {
        return typeof data.id === 'string' &&
            this.isValidId(data.id) &&
            data.nodes instanceof Object && !(data.nodes instanceof Array);
    }

    static isValidId(id: string) {
        return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id);
    }

    static validate(id: string, data: Data) {
        const id1 = id.split('@');
        const id2 = data.id.split('@');
        const msg = [];

        if (!this.isValidData(data))
            msg.push('Data is not suitable');
        if (id !== data.id)
            msg.push('IDs not equal');
        if (id1[0] !== id2[0])
            msg.push('Names don\'t match');
        if (id1[1] !== id2[1])
            msg.push('Versions don\'t match');

        return { success: Boolean(!msg.length), msg: msg.join('. ') };
    }
}
