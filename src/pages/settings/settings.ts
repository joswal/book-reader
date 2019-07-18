import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { AboutPage } from "../about/about";
import { PaperDataProvider } from "../../providers/paper-data/paper-data";
import { UserDataProvider } from "../../providers/user-data/user-data";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  api_key: string = null;

  app_version;

  // reading
  font_size: number;
  background_choice: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    private paperDataProvider: PaperDataProvider,
    private userDataProvider: UserDataProvider
  ) {}

  ionViewDidLoad() {
    this.userDataProvider.apiKeyChanged.subscribe(
      api_key => (this.api_key = api_key)
    );
    this.userDataProvider.fontSizeChanged.subscribe(
      font_size => (this.font_size = font_size)
    );
    this.userDataProvider.backgroundChoiceChanged.subscribe(
      bg_choice => (this.background_choice = bg_choice)
    );
    this.app_version = this.userDataProvider.getAppVersion();
  }

  goToAboutPage() {
    this.navCtrl.push(AboutPage);
  }

  openInAppBrowser(url) {
    this.iab.create(url);
  }

  changeBackgroundTo(background_choice: string) {
    this.background_choice = background_choice;
    this.userDataProvider.setBackgroundChoice(background_choice);
  }

  setFontSize() {
    this.userDataProvider.setFontSize(this.font_size);
  }

  clearHistory() {
    let alert = this.alertCtrl.create({
      title: "Are you sure you want to clear the history?",
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Go ahead!",
          handler: data => {
            this.paperDataProvider.clearAllPapersInHistory();
            let alert2 = this.alertCtrl.create({
              title: "History cleared!",
              buttons: ["Got it"]
            });
            alert2.present();
          }
        }
      ]
    });
    alert.present();
  }
}
