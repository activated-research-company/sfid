from time import sleep
import sys, os
sys.path.append('/usr/lib/python3.5/dist-packages') # temporary hack to import the piJuice module
from pijuice import PiJuice

# Wait for device I2C device to start
while not os.path.exists('/dev/i2c-1'):
    print ("Waiting to identify PiJuice")
    time.sleep(0.1)

# Initiate PiJuice
pijuice = PiJuice(1,0x14)

# Get all parameters and return as a dictionary
def get_battery_parameters(pijuice):

    juice = {}

    charge = pijuice.status.GetChargeLevel()
    juice['charge'] = charge['data'] if charge['error'] == 'NO_ERROR' else charge['error']

    # Temperature [C]
    temperature =  pijuice.status.GetBatteryTemperature()
    juice['temperature'] = temperature['data'] if temperature['error'] == 'NO_ERROR' else temperature['error']

    # Battery voltage  [V]
    vbat = pijuice.status.GetBatteryVoltage()
    juice['vbat'] = vbat['data']/1000 if vbat['error'] == 'NO_ERROR' else vbat['error']

    # Barrery current [A]
    ibat = pijuice.status.GetBatteryCurrent()
    juice['ibat'] = ibat['data']/1000 if ibat['error'] == 'NO_ERROR' else ibat['error']

    # I/O coltage [V]
    vio =  pijuice.status.GetIoVoltage()
    juice['vio'] = vio['data']/1000 if vio['error'] == 'NO_ERROR' else vio['error']

    # I/O current [A]
    iio = pijuice.status.GetIoCurrent()
    juice['iio'] = iio['data']/1000 if iio['error'] == 'NO_ERROR' else iio['error']

    # Get power input (if power connected to the PiJuice board)
    status = pijuice.status.GetStatus()
    juice['power_input'] = status['data']['powerInput'] if status['error'] == 'NO_ERROR' else status['error']

    # Get power input (if power connected to the Raspberry Pi board)
    status = pijuice.status.GetStatus()
    juice['power_input_board'] = status['data']['powerInput5vIo'] if status['error'] == 'NO_ERROR' else status['error']

    return juice

i = 0

while True:

    battery_data = get_battery_parameters(pijuice)

    if(i%12==0):
        print(battery_data)

    i = i + 1
    sleep(5)