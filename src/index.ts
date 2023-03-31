import { MainScene } from './scenes/MainScene';

const container = document.getElementById('game-container');
if (container) {
  new MainScene(container);
}
