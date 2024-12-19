import '@logseq/libs'

import { logseq as PL } from "../package.json";

import Localization from 'localizationjs'
import cn from "./res/lang/cn.json"
import en from "./res/lang/en.json"
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

let locale: Localization = null;

let currentLanguage = {
  name: "en",
  dict: en
}

let languages = [
  {
    name: "en",
    dict: en
  },
  {
    name: "cn",
    dict: cn
  }
]

let language: string = "";
let timeformat: string = "";
let forecolor: string = "";

function onSettingsChange() {
  language = logseq.settings?.language ?? languages[0].name;
  timeformat = logseq.settings?.timeformat ?? "Mon DDth, YYYY HH:MM";
  forecolor = logseq.settings?.forecolor ?? "#000000";

  languages.forEach((_language: { name, dict }) => {
    if (_language.name == language) {
      currentLanguage = _language
      if (locale.isLocale(_language.name)) locale.addDict(_language.name, _language.dict);
      if (locale.getCurrentLocale() != _language.name){
        locale.setCurrentLocale(_language.name);
        // logseq.useSettingsSchema(currentLanguage.dict.settings as SettingSchemaDesc[])
      } 
    }
  });

  // const vars: [string, string][] = [
  //   // ["--ls-enhanced-timeinput-language-overwrite", language],
  //   // ["--ls-enhanced-timeinput-language-overwrite", timeformat],
  //   ["--ls-enhanced-timeinput-forecolor-overwrite", forecolor]
  // ];

  // const varsString = vars.map((pair) => pair.join(": ") + ";").join("\n");

  // logseq.provideStyle({
  //   key: PL.id + "-vars",
  //   style: `:root { ${varsString} }`,
  // });
}

fetch('./res/lang/cn.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

/**
 * main entry
 */
async function main() {
  const appUserConfig = logseq.App.getUserConfigs()

  locale = new Localization({ defaultLocale: "en" });

  onSettingsChange();
  logseq.onSettingsChanged(onSettingsChange);

  function padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  function monToString(num: number): string {
    const monthText: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthText[num - 1];
  }

  // Emoji picker
  logseq.Editor.registerSlashCommand(
    '⌚️ Current Time - MM DD, yyyy HH:mm',
    async () => {
      const now: Date = new Date();
      const year: number = now.getFullYear();
      const month: number = now.getMonth() + 1;
      const day: number = now.getDate();
      const hour: number = now.getHours();
      const minutes: number = now.getMinutes();
      const seconds: number = now.getSeconds();

      const currentTime: string = `${en.month[month - 1].slice(0, 3)} ${en.days[day - 1]}, ${year} ${padZero(hour)}:${padZero(minutes)}`;
      // const currentTime: string = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minutes)}`;

      await logseq.Editor.insertAtEditingCursor(currentTime)
    },
  )
}

// bootstrap

logseq.useSettingsSchema(currentLanguage.dict.settings as SettingSchemaDesc[])
logseq.ready(main).catch(console.error)