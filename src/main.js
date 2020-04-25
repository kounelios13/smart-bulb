const btn = document.getElementById('foo')
const {ipcRenderer} = require('electron');
// const status = ipcRenderer.sendSync('init-app');
// console.log('status:',status)
checkFirstRun();
window.addEventListener('DOMContentLoaded', async function () {
    const toggleBtn = document.getElementById('shit');
    const brightness = document.getElementById('brightness');
    const brLabel = document.getElementById('br-label');
    toggleBtn.addEventListener('click', function () {
        ipcRenderer.send('toggle-bulb');
    });
    brightness.addEventListener('input', () => {
        ipcRenderer.send('change-brightness', brightness.value);
        brLabel.innerText = brightness.value
    });

    const sceneBtns = document.querySelectorAll('.scene-btn')
    sceneBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const {target} = e;
            const {dataset} = target;
            const {scene} = dataset
            ipcRenderer.send('set-scene', scene);

        })
    })


});

/**
 * Check if yeelight script directory is set
 * If not allow user to select it
 */
function checkFirstRun() {
    const key = `smart-bulb-dir`;
    const item = localStorage.getItem(key);
    if (item) {
        ipcRenderer.sendSync('script-dir-setup', item)
        return;
    }
    mbox.custom({
        message: "Yeelight script directory is not set.Please select it",
        options: {},
        buttons: [{
            label: 'OK',
            callback: () => {
                const directories = ipcRenderer.sendSync('request-script-dir')
                mbox.close();
                if(!directories.length){
                    mbox.alert("Yeelight script directory not selected . You won't be able to execute any action")
                    return;
                }
                localStorage.setItem(key,directories[0]);
            }
        }]
    })

}
