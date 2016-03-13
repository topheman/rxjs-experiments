import sensorsChecker from 'sensors-checker';

// null by default - if SENSORS_CHECKER=false, won't perform the check for the presence of accelerometer
// useful when testing on desktop with the simulator of the devtools
let deviceOrientationActive = process.env.SENSORS_CHECKER === false ? window.DeviceOrientationEvent : null;

export const resolveDeviceOrientation = () => new Promise((res) => {
  if (deviceOrientationActive !== null) {
    return res(deviceOrientationActive);
  }
  return sensorsChecker.checkDevicemotion(() => {
    deviceOrientationActive = true;
    return res(deviceOrientationActive);
  }, () => {
    deviceOrientationActive = false;
    return res(deviceOrientationActive);
  }, {
    userAgentCheck: /(iPad|iPhone|Nexus|Mobile|Tablet)/i// @optional (to bypass the sniffing)
  });
});

export const isDeviceOrientationActive = () => deviceOrientationActive;
