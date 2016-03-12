import sensorsChecker from 'sensors-checker';

let deviceMotionEvents = null;

export const resolveDeviceMotion = () => new Promise((res) => {
  if (deviceMotionEvents !== null) {
    return res(deviceMotionEvents);
  }
  return sensorsChecker.checkDevicemotion(() => {
    deviceMotionEvents = true;
    return res(deviceMotionEvents);
  }, () => {
    deviceMotionEvents = false;
    return res(deviceMotionEvents);
  }, {
    userAgentCheck: /(iPad|iPhone|Nexus|Mobile|Tablet)/i// @optional (to bypass the sniffing)
  });
});

export const isDeviceMotionActive = () => deviceMotionEvents;
