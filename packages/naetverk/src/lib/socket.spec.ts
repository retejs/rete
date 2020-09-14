import { Socket } from './socket';

describe('Socket', () => {
  it('should check a valid name', () => {
    const validName = 'valid name';
    expect(new Socket(validName)).toEqual({
      compatible: [],
      data: {},
      name: validName,
    });
  });

  it('should allow only the same sockets to be compatible', () => {
    const s1 = new Socket('name1');
    const s2 = new Socket('name2');
    const s3 = new Socket('name3');

    expect(s1.compatibleWith(s1)).toBe(true);
    expect(s1.compatibleWith(s2)).toBe(false);
    expect(s1.compatibleWith(s3)).toBe(false);
  });

  it('should allow combined sockets to be compatible', () => {
    const s1 = new Socket('name1');
    const s2 = new Socket('name2');
    const s3 = new Socket('name3');

    s3.combineWith(s1);
    expect(s3.compatibleWith(s1)).toBe(true);
    expect(s1.compatibleWith(s3)).toBe(false);
    expect(s3.compatibleWith(s2)).toBe(false);
  });
});
