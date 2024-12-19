import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { PlayerDataComponent } from './app/player-data/player-data.component';

const bootstrap = () => bootstrapApplication(PlayerDataComponent, config);

export default bootstrap;
