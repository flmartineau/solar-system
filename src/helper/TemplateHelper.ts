export abstract class TemplateHelper {

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
