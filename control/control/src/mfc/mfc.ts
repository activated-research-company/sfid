import { SerialDevice, SerialPortOptions } from '../serial-device';
import env from '../env/env';

class Mfc extends SerialDevice {
  private pollingInterval: NodeJS.Timeout;

  constructor(path: string) {
    super(new SerialPortOptions(
      path,
      env.flowController.baudRate,
      env.flowController.delimiter,
      true,
    ));
    this.pollingInterval = setInterval(() => {
      super.write(this.getH2Id());
      setTimeout(() => {
        super.write(this.getAirId());
      }, 500);
    }, 1000);
  }

  private getH2Id() {
    return env.flowController.hydrogen.identifier;
  }

  private getAirId() {
    return env.flowController.air.identifier;
  }

  public connect(): Promise<any> {
    return super
      .connect()
      .then((device) => {
        device.subscribe((response: string) => {
          console.log(response);
        });
      });
  }

  public disconnect(): Promise<null> {
    clearInterval(this.pollingInterval);
    return super.disconnect();
  }

  public setSetpoint(id: string, setpoint: number) {
    clearInterval(this.pollingInterval);
    super.write(`${id}s${setpoint}`);
  }

  public setH2Setpoint(setpoint: number) {
    this.setSetpoint(this.getH2Id(), setpoint);
  }

  public setAirSetpoint(setpoint: number) {
    this.setSetpoint(this.getAirId(), setpoint);
  }
}

export default Mfc;
