import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { PlayerDataComponent } from './app/player-data/player-data.component';

bootstrapApplication(PlayerDataComponent, appConfig)
  .catch((err) => console.error(err));
