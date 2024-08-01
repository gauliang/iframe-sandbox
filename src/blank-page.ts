declare const amisRequire: any


export const appScript = () => {
    const amis = amisRequire('amis/embed')

    const schema = {
        type: 'page',
        title: 'The page',
        body: {
            type: 'form',
            title: 'The form',
            api: {
                method: 'post',
                url: 'https://httpbin.org/post',
                adaptor: 'mock',
                data: {
                    status: 0,
                    message: 'ok',
                    data: 'mock data'
                }
            },
            controls: [
                {
                    component: (props:any) => {
                        console.log(props)
                        return '<div>Custom component</div>'
                    }
                },
                {
                    type: 'action',
                    label: 'Action',
                    actionType: 'dialog',
                    dialog: {
                        title: 'Dialog',
                        body: 'This is a dialog',
                        actions: [
                            {
                                type: 'button',
                                label: 'Close',
                                actionType: 'close'
                            }
                        ]
                    }
                },
                {
                    type: 'text',
                    name: 'name',
                    label: 'Name',
                    placeholder: 'Input your name',
                    required: true
                },
                {
                    type: 'password',
                    name: 'password',
                    label: 'Password',
                    placeholder: 'Input your password',
                    required: true
                },
                {
                    type: 'select',
                    name: 'select',
                    label: 'Select',
                    "useMobileUI": false,
                    placeholder: 'Select',
                    options: [
                        {
                            label: 'Option1',
                            value: 'option1'
                        },
                        {
                            label: 'Option2',
                            value: 'option2'
                        }
                    ]
                },
                {
                    type: 'submit',
                    label: 'Submit'
                }
            ]
        }
    }

    amis.embed('#app', schema, {}, { useMobileUI: false })

}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/amis@6.6.0/sdk/sdk.js"></script>
</head>
<body>
    <div>iframe sandbox</div>
    <div id="app"></div>
</body>
</html>`



interface CreateIframeOptions {
    appName: string,
    html?: string
}
export const createIframe = (options: CreateIframeOptions) => {
    const iframe = document.createElement('iframe')
    iframe.name = options.appName
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    iframe.src = url
    iframe.style.width = '600px'
    iframe.style.height = '500px'
    return iframe
}

