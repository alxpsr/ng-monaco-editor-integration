import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: []
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") 
  public editorContent!: ElementRef;

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    const onGotAmdLoader = () => {
      // Load monaco
      (window as any).require(["vs/editor/editor.main"], () => {
        this.initMonaco();
      });
    };

    // Load AMD loader if necessary
    if (!(window).require) {
      const loaderScript = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = "vs/loader.js";
      loaderScript.addEventListener("load", onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }

  // Will be called once monaco library is available
  private initMonaco() {
    const myDiv: HTMLDivElement = this.editorContent.nativeElement;
    const editor = monaco.editor.create(myDiv, {
      value: [
        "function x() {",
        "\tconsole.log('Hello world!');",
        "}"
      ].join("\n"),
      language: "javascript",
      minimap: {
        enabled: false
      }
    });
  }
}
