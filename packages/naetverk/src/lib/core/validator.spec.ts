import { Validator } from './validator';

describe('Validator', () => {
  it('validate id ', () => {
    expect(Validator.isValidId('demo@0.0.0')).toBe(true);
    expect(Validator.isValidId('demo@0.0g.0')).toBe(false);
  });

  it('validate', () => {
    const id = 'demo@0.1.0';
    const data = { id: 'demo@0.0.0', nodes: {} };
    expect(Validator.validate(id, data)).toEqual({
      msg: "IDs not equal. Versions don't match",
      success: false,
    });
  });
});
