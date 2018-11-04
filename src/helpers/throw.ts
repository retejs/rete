export class Throw {
    public static required(name: string) {
        throw new Error(`'${name}' required`);
    }
}