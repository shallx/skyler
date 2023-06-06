const startMenu_appdata =
  'C:\\Users\\\"Rafat Rashid\"\\AppData\\Roaming\\Microsoft\\Windows\\\"Start Menu\"\\Programs\\';
const startmenu_programdata =
  'C:\\ProgramData\\Microsoft\\Windows\\"Start Menu"\\Programs\\';

const dev_dir = "E:\\Development\\WorkStation\\";

const progs = {
  anydesk: startmenu_programdata + 'AnyDesk\\"AnyDesk".lnk',
  compass: startMenu_appdata + '"MongoDB Inc"\\"MongoDBCompass".lnk',
  vscode: startMenu_appdata + '"Visual Studio Code"\\"Visual Studio Code".lnk',
  chrome: startmenu_programdata + '"Google Chrome".lnk',
  word: startmenu_programdata + "Word.lnk",
  powerpoint: startmenu_programdata + "PowerPoint.lnk",
  epic: startmenu_programdata + '"Epic Games Launcher".lnk',
  search: startMenu_appdata + 'Everything\\"Search Everything".lnk',
  dev: dev_dir,
  flutter: dev_dir + "flutter\\",
  node: dev_dir + "nodejs\\",
  react: dev_dir + "react\\",
};

module.exports = progs;
