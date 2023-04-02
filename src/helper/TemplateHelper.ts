import { MouseEvents } from "../controllers/MouseEvents";

export abstract class TemplateHelper {

  static initTemplates(mouseEvents: MouseEvents): void {
    this.setTemplate('info-container', 'info.html');
    this.setTemplate('current-date-container', 'current-date.html');
    this.setTemplate('control-panel-container', 'control-panel.html', () => mouseEvents.addControlEventListeners());
  }

private static async setTemplate(containerId: string, contentUrl: string, callback?: () => void): Promise<void> {
    const response = await fetch(contentUrl);
    const content = await response.text();
  
    const container = document.getElementById(containerId);
    container!.innerHTML = content;
    if (callback) {
      callback();
    }
  }
}
