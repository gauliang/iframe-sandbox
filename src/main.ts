import { createIframe, appScript } from './blank-page'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

const shadowRootDOM = () => {

    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body><div id="app"></div></body>
  </html>`
    return new DOMParser().parseFromString(html, 'text/html')
}

function createScript(script: string) {
    const scriptElement = document.createElement('script')
    scriptElement.innerHTML = script
    return scriptElement
}

async function loadCss(url: string) {
    const cssContent = await fetch(url).then(res => res.text())

    const style = document.createElement('style')
    style.textContent = cssContent.replace(/:root/g, ':host')
    return style
}

class MicroApp extends HTMLElement {
    constructor() {
        super()
    }

    /**
     * 当 custom element 首次被插入文档 DOM 时，被调用。
     */
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })
        const microAppRoot = shadowRootDOM()

        microAppRoot.querySelector('head')!.append(await loadCss('https://unpkg.com/amis@6.6.0/sdk/sdk.css'))



        const iframe = createIframe({ appName: 'micro-app' })

        // microAppRoot.body.appendChild(iframe)
        // shadow.appendChild(microAppRoot.querySelector('html')!)

        iframe.onload = () => {
            const iframeWindow: Window = iframe.contentWindow!

            // Object.getOwnPropertyNames(iframeWindow).forEach((key: string) => {
            //     iframeWindow[key] = window[key]
            //     console.log(key, iframeWindow[key])
            // })
            // 在 iframe 中注入 script
            // const microAppScript = document.createElement('script')
            // microAppScript.innerHTML = `(${appScript})()`;
            const iframeDocument = iframe.contentWindow?.document!
            // Object.keys(iframeDocument).forEach(key => {
            //     if (key !== 'defaultView') {
            //         console.log(key, iframeDocument[key])
            //     }
            // })
            iframeDocument.querySelector = shadow.querySelector.bind(shadow)
            // doc.querySelectorAll = shadow.querySelectorAll.bind(shadow)
            // doc.replaceChild = shadow.replaceChild.bind(shadow)
            // doc.replaceChildren = shadow.replaceChildren.bind(shadow)
            // doc.getElementById = shadow.getElementById.bind(shadow)
            // doc.hasFocus = document.hasFocus.bind(shadow)
            // doc.append = shadow.append.bind(shadow)
            // doc.prepend = shadow.prepend.bind(shadow)
            // doc.getElementsByName = document.getElementsByName.bind(shadow)
            // doc.getElementsByTagName = document.getElementsByTagName.bind(shadow)
            // doc.getElementsByClassName = document.getElementsByClassName.bind(shadow)
            // doc.getElementsByTagNameNS = document.getElementsByTagNameNS.bind(shadow)
            // doc.body = shadow.querySelector('body')!
            // doc.activeElement = shadow.activeElement!




            iframe.contentDocument?.body.append(createScript(`(${appScript})()`))

            // 把 iframe.contentWindow.document 替换为 shadow，通过 proxy 代理实现








            // shadow.appendChild(appHtml!)

            // (iframe.contentWindow?.document as any) = microAppRoot
            // iframe.contentDocument?.head.replaceWith(appHead!)
            // iframe.contentDocument?.body.replaceWith(appHtml!)
        }

        microAppRoot.querySelector('body')!.appendChild(iframe)
        shadow.appendChild(microAppRoot.querySelector('html')!)
    }

    /**
     * 当 custom element 从文档 DOM 中删除时，被调用。
     */
    disconnectedCallback() {
        console.log('disconnectedCallback')
    }

    /**
     * 当 custom element 增加、删除、修改自身属性时，被调用。
     * @param name 
     * @param oldValue
     * @param newValue
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log('attributeChangedCallback', name, oldValue, newValue)
    }

    /**
     * 当 custom element 被移动到新的文档时，被调用。
     */
    adoptedCallback() {
        console.log('adoptedCallback')
    }
}

customElements.define('micro-app', MicroApp)
