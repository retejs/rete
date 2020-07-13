export class Socket {
  name: string;
  data: unknown;
  compatible: Socket[] = [];

  constructor(name: string, data = {}) {
    this.name = name;
    this.data = data;
    this.compatible = [];
  }

  /**
   * Add the selected socket to the list of comparable ones
   * @param {Socket} socket
   */
  combineWith(socket: Socket) {
    this.compatible.push(socket);
  }

  /**
   * Check of the socket is compatible with another.
   * @param {Socket} socket
   * @returns {boolean}
   */
  compatibleWith(socket: Socket): boolean {
    return this === socket || this.compatible.includes(socket);
  }
}
