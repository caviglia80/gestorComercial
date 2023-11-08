import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { GlobalVariables } from 'src/app/app.component';

@Component({
  selector: 'app-whatsapp-btn',
  templateUrl: './whatsapp-btn.component.html',
  styleUrls: ['./whatsapp-btn.component.css']
})
export class WhatsappBtnComponent implements AfterViewInit, OnDestroy {
  private onScroll: (() => void) | undefined;

  ngAfterViewInit() {
    try {
      const button: HTMLElement | null = document.getElementById('whatsapp-btn');
      this.onScroll = () => {
        if (button)
          if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight)
            button.classList.add('hidden');
          else
            button.classList.remove('hidden');
      };
      window.addEventListener('scroll', this.onScroll);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    try {
      if (this.onScroll)
      window.removeEventListener('scroll', this.onScroll);
    } catch (error) {
      console.log(error);
    }
  }

  redirectToWsp() {
    try {
      const webLink = "https://wa.me/" + GlobalVariables.wspNumer + "/?text=" + encodeURIComponent(GlobalVariables.wspTxt);
      setTimeout(() => { window.open(webLink, '_blank', 'noopener,noreferrer'); }, 100);
    } catch (error) {
      console.log(error);
    }
  }
}
