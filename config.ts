import minimist from 'minimist';

const metadataServer = 'http://192.168.1.200:23330/status';
const rtcServer = 'http://192.168.1.200:8889/hg';
const webPort = 9753;

export default {
  metadataServer: minimist(process.argv.slice(2)).meta || process.env.METADATA_SERVER || metadataServer,
  rtcServer: minimist(process.argv.slice(2)).rtc || process.env.RTC_SERVER || rtcServer,
  webPort: minimist(process.argv.slice(2)).port || process.env.WEB_PORT || webPort,
};