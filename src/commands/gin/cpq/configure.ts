import { SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

export default class Configure extends SfdxCommand {
    public static description = 'Suspend/Enable sharing calculation';

    public static examples = [
        '$ sfdx gin:cpq:configure -u username'
    ];

    protected static flagsConfig = {
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static requiresDevhubUsername = false;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<any> {
        const result = {};

        await this.configureCpq();

        return result;
    }

    private async configureCpq() {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: !(process.env.BROWSER_DEBUG === 'true')
        });
        const instanceUrl = this.org.getConnection().instanceUrl;
        const startUrl = '/lightning/setup/ImportedPackage/home';
        const installedPackagePath = '/0A3?setupid=ImportedPackage&retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DStudio';

        try {
            const page = await browser.newPage();

            await page.goto(
                `${instanceUrl}/secur/frontdoor.jsp?sid=${
                this.org.getConnection().accessToken
                }&startURL=${encodeURIComponent(startUrl)}`,
                { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] }
            );
            this.ux.log('navigated home');

            const navigationPromise = page.waitForNavigation({ timeout: 120000 });
            this.ux.log(page.url());
            if (!page.url().includes('home/home.jsp')) {
                await page.waitForRequest(request => request.url().includes('lightning'));
            }
            // await navigationPromise;

            await page.goto(
                `${instanceUrl}${installedPackagePath}`,
                { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] }
            );

            await navigationPromise;

            this.ux.log('navigated to package');


            this.ux.log('start waiting');
            this.ux.log('stop waiting navigation');

            await this.navigateToPackageConfig(page);

            await this.configureLineEditor(page, browser);
        }
        catch(e) {

        }

        await browser.close();
    }

    async navigateToPackageConfig(page) {
        const navigationPromise = page.waitForNavigation();

        const packageNameSelector = '.bRelatedList th.dataCell a';
        await page.waitForSelector(packageNameSelector);

        await page.$$eval(packageNameSelector, els => Array.from(<any[]>els).filter((_) => _.innerHTML.includes('CPQ'))[0].click());
        await navigationPromise;


        const configureBtnSelector = `input[value=Configure]`;
        await page.waitForSelector(configureBtnSelector);
        await page.click(configureBtnSelector);
        await navigationPromise;

        this.ux.log('stop waiting click');

        await navigationPromise;
    }

    async configureLineEditor(page, browser) {
        const navigationPromise = page.waitForNavigation();
        this.ux.log('configure Line Editor');

        const firstTab = 'Line Editor';

        const tabSelector = '.rich-tab-header';
        await page.waitForSelector(tabSelector, { timeout: 120000 });

        const setInput = async (label, value, labelElHandlers) => {
            labelElHandlers = labelElHandlers || await page.$$(`.labelCol`)

            await page.evaluate((label, value, ...labelEls) => {
                console.log(label);
                const labelEl = Array.from(labelEls)
                    .filter(_ => _.innerHTML.includes(label))[0];
                console.log(labelEl);

                const controlEl = labelEl.nextSibling.children[0];
                console.log(controlEl);

                if (controlEl.getAttribute('type') === 'checkbox') {
                    controlEl.checked = value;
                } else {
                    controlEl.value = value;
                }
            }, label, value, ...labelElHandlers)
        };

        const navigateToTab = async (tabName) => {
            await page.$$eval(tabSelector, (els, tabName) => {
                console.log(els);
                console.log(tabName);
                Array.from(<any[]>els).filter(_ => _.innerHTML.includes(tabName))[0].click();
            }, tabName);
            await new Promise((res, rej) => setTimeout(() => res(), 300));
        }

        await navigateToTab(firstTab);
        let labelElHandlers = await page.$$(`.labelCol`);

        await setInput('Visualize Product Hierarchy', true, labelElHandlers);
        await setInput('Totals Field', 'doNotDisplay', labelElHandlers);
        await setInput('Group Subtotals Field', 'doNotDisplay', labelElHandlers);
        await setInput('Line Subtotals Total Field', 'doNotDisplay', labelElHandlers);
        // missing
        // await setInput('Enable Column Resizing', true, labelElHandlers);


        await navigateToTab('Plugins');
        labelElHandlers = await page.$$(`.labelCol`);

        await setInput('Quote Calculator Plugin', 'JavascriptPlugin', labelElHandlers);
        await setInput('Product Search Plugin', 'CPQProductSearchPlugin', labelElHandlers);


        await navigateToTab('Pricing and Calculation');

        labelElHandlers = await page.$$(`.labelCol`);

        await setInput('Calculate Immediately', true, labelElHandlers);


        await navigateToTab('Quote');

        labelElHandlers = await page.$$(`.labelCol`);

        await setInput('Disable Initial Quote Sync', true, labelElHandlers);


        await navigateToTab('Additional Settings');
        labelElHandlers = await page.$$(`.labelCol`);

        await setInput('Open Search Filter By Default', true, labelElHandlers);

        this.ux.log('before save');
        // await navigationPromise;
        await page.click('input[value=Save]');
        await navigationPromise;
        await page.waitForSelector(tabSelector);
        await new Promise((res, rej) => setTimeout(() => res(), 500));
        this.ux.log('after save');

        await navigateToTab('Pricing and Calculation');

        this.ux.log('before link click');
        await page.$$eval('.data2Col', els => {
            console.log(els);
            const link = Array.from(<any[]>els).filter(_ => _.innerHTML.includes('Authorize new calculation service'))[0].querySelector('a');
            console.log(link);
            link.click();
        });

        this.ux.log('after link click');

        this.ux.log('wait popup');
        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
        const popup: any = await newPagePromise;
        this.ux.log('popup is here');

        await popup.waitForSelector('#oaapprove');
        await popup.click('#oaapprove');
        this.ux.log('clicked approve');


        await navigationPromise;
        this.ux.log('after page refresh');

        while (true) {

            await new Promise((res, rej) => setTimeout(() => res(), 500));
            let pages = await browser.pages();
            if (pages.length === 2) {
                break;
            }

        }
        this.ux.log('after accept');

        // need somehow to wait until page refreshes
        this.ux.log('after page refresh');
    }
}
