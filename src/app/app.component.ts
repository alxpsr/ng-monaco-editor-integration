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
    const model = monaco.editor.createModel(JSON.stringify(getMock(), null, '\t'), "json");
    const myDiv: HTMLDivElement = this.editorContent.nativeElement;
    const editor = monaco.editor.create(myDiv, {
      language: "json",
      minimap: {
        enabled: false
      },
      formatOnPaste: true,
      model: model
    });
  }
}

function getMock(): any {
  return { "glossary": { "title": "example glossary", "GlossDiv": { "title": "S", "GlossList": { "GlossEntry": { "ID": "SGML", "SortAs": "SGML", "GlossTerm": "Standard Generalized Markup Language", "Acronym": "SGML", "Abbrev": "ISO 8879:1986", "GlossDef": { "para": "A meta-markup language, used to create markup languages such as DocBook.", "GlossSeeAlso": ["GML", "XML"] }, "GlossSee": "markup" } } } } };
}