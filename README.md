# How to integrate Monaco Editor into Angular project with AMD

There are 3 main steps (beside editor installation):
1. Add copy instructions into `assets` sections of `angular.json `
```json
{
    "glob": "**/*",
    "input": "./node_modules/monaco-editor/min/vs",
    "output": "/vs"
}
```

2. Create component with editor initialization:
```ts
class Component implements OnInit, AfterViewInit {
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
```

3. Maybe most important and unclear step - you have to declare `getWorkerUrl` function (for example in `main.ts`).
This function will create and run WebWorker for editor so editor will be high efficient in terms of performance. If you skip 
this step the Editor will throw an error: 
`Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes.`
and many other weird runtime errors

```ts
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return 'vs/base/worker/workerMain.js';
  },
}
```

Thanks to `https://ngohungphuc.wordpress.com/2019/01/08/integrate-monaco-editor-with-angular/` for info

## Regarding ESM integration
I couldn't integrate ESM modules into my app and seems that it's impossible without custom webpack config.
One more interesting thing that ESM folder (inside of library folder) doesn't have minified files, so i suppose, you have to import 
these files via webpack (idk how tbh) and webpack will compile and minify them. If i integrate ESM i'll update docs.

## Useful links
- https://microsoft.github.io/monaco-editor/playground.html#creating-the-editor-editor-basic-options