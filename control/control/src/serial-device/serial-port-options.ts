const Delimiter = require('@serialport/parser-delimiter');

class SerialPortOptions {
  constructor(private path: string, private baudRate: number, private delimiter?: string, private buffer?: boolean) {}

  public getPath() {
    return this.path;
  }

  public hasDelimiter() {
    return this.delimiter;
  }

  public getDelimiter(): typeof Delimiter | null {
    return this.delimiter ? new Delimiter({ delimiter: this.buffer ? Buffer.from(this.delimiter) : this.delimiter }) : null;
  }

  public getDelimiterString(): string | null {
    return this.delimiter ? this.delimiter : null;
  }

  public getOpenOptions() {
    return {
      autoOpen: false,
      baudRate: this.baudRate,
    };
  }
}

export default SerialPortOptions;
