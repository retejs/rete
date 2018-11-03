export class Validator {

    static isValidData(data) {
        return typeof data.id === 'string' &&
            this.isValidId(data.id) &&
            data.nodes instanceof Object && !(data.nodes instanceof Array);
    }

    static isValidId(id) {
        return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id);
    }

    static validate(id, data) {
        var msg = '';
        var id1 = id.split('@');
        var id2 = data.id.split('@');

        if (!this.isValidData(data))
            msg += 'Data is not suitable. '; 
        if (id !== data.id)
            msg += 'IDs not equal. ';
        if (id1[0] !== id2[0])
            msg += 'Names don\'t match. ';
        if (id1[1] !== id2[1])
            msg += 'Versions don\'t match';

        return { success: msg ==='', msg };
    }
}