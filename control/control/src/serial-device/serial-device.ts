import { Subject } from 'rxjs';
import SerialPort from 'serialport';
import SerialPortOptions from './serial-port-options';
import { logger } from '../logger';

abstract class SerialDevice {
  private device: Subject<any>;
  private options: SerialPortOptions;
  private serialPort: SerialPort | null;

  constructor(options: SerialPortOptions) {
    this.device = new Subject<any>();
    this.serialPort = null;
    this.options = options;
  }

  private onData(data: any): void {
    this.device.next({ data: data.toString() });
  }

  /** Returns a promise that resolves with a subject when the serial port has been opened. */
  protected connect(): Promise<Subject<any>> {
    return SerialPort
      .list()
      .then((ports) => {
        ports.forEach((port) => {
          this.serialPort = new SerialPort(port.path, this.options.getOpenOptions());

          if (this.options.hasDelimiter()) {
            this.serialPort.pipe(this.options.getDelimiter()).on('data', this.onData.bind(this));
          } else {
            this.serialPort.on('data', this.onData.bind(this));
          }
        
            return new Promise((resolve) => this.serialPort.open(() => resolve(this.device)));
          });
        })
      });
    
  }

  /** Returns a promise that resolves when the serial port has been closed. */
  protected disconnect(): Promise<null> {
    return new Promise((resolve) => {
      if (this.serialPort) {
        this.serialPort.on('close', () => {
          logger.debug(`${this.options.getPath()} closed`)
          if (this.serialPort) { this.serialPort.off('close', resolve); }
          resolve();
        });
        this.serialPort.close()
      } else {
        resolve();
      }
    });
  }

  protected write(message: string): void {
    if (this.serialPort && this.serialPort.isOpen) {
      this.serialPort.write(`${message}${this.options.getDelimiterString()}`);
    }
  };
}

export default SerialDevice;
