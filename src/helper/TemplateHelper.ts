import { MouseEvents } from "../controllers/MouseEvents";

export abstract class TemplateHelper {

  static initTemplates(mouseEvents: MouseEvents): void {
    this.setTemplate('info-container', 'info.html', () => mouseEvents.addInfoEventListeners());
    this.setTemplate('current-date-container', 'current-date.html', () => mouseEvents.addDateEventListeners());
    this.setTemplate('control-panel-container', 'control-panel.html', () => mouseEvents.addControlEventListeners());
    this.setTemplate('sidebar-container', 'sidebar.html', () => mouseEvents.addSidebarEventListeners());
  }

public static async setTemplate(containerId: string, contentUrl: string, callback?: () => void): Promise<void> {
    const response: Response = await fetch(contentUrl);
    const content: string = await response.text();
  
    const container: HTMLElement | null = document.getElementById(containerId);
    container!.innerHTML = content;
    if (callback) {
      callback();
    }
  }
}
