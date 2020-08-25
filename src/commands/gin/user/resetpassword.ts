import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

export default class ResetPassword extends SfdxCommand {
    public static description = 'Suspend/Enable sharing calculation';

    public static examples = [
        '$ sfdx gin:user:resetpassword -t testuser@example.test -u targetorg@org.test'
    ];

    protected static flagsConfig = {
        testusername: flags.string({
            char: 't',
            description: 'username to reset password',
            required: true,
        })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;
    username;
    password;
    state: string;

    // Comment this out if your command does not support a hub org username
    protected static requiresDevhubUsername = false;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<any> {
        const result = {};

        await this.resetPassword();

        return result;
    }

    private async resetPassword() {
        const instanceUrl = this.org.getConnection().instanceUrl;

        const password1 = 'GinTest@0@2!1';
        const password2 = 'GinTest@0@2!';

        this.ux.startSpinner('Setting initial password');

        await this.resetPasswordWithRest(password1);
        this.ux.startSpinner(`Starting puppeteer`);

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: !(process.env.BROWSER_DEBUG === 'true')
        });
        this.ux.startSpinner(`Opening login page`);

        const page = await browser.newPage();

        await this.handleInitialLogin(page, password1);
        this.ux.startSpinner('redirecting to password reset');

        await this.waitForNextPage(page);
        if (this.state === 'password') {
            await this.handleChangePasswordPage(page, password1, password2);
            this.ux.startSpinner('redirecting to home page/change phone number');
        } else if (this.state === 'phone') {
            this.ux.log('change phone number redirect');
            await browser.close();
            return;
        } else {
            this.ux.log('password is incorrect', this.state);
            await browser.close();
            return;
        }

        await this.waitForNextPage(page);
        if (this.state === 'phone') {
            this.ux.log('change phone number redirect');
            await browser.close();
        } else if (this.state === 'home') {
            this.ux.log('home redirect');
            await browser.close();
        }

        this.ux.stopSpinner('Done.');
    }

    async waitForNextPage(page) {
        const passwordChangeUrlIndicator = `_ui/system/security/ChangePassword`;
        const homePageIndicator = 'lightning';
        const addPhoneNumberIndicator = '_ui/identity/phone/AddPhoneNumber';

        const possibleUrls = [
            passwordChangeUrlIndicator,
            homePageIndicator,
            addPhoneNumberIndicator
        ];

        await page.waitForRequest(request => possibleUrls.reduce((acc, item) => acc || request.url().includes(item) , false));
        this.ux.log(page.url());

        await page.waitForNavigation();

        this.state = page.url() === this.org.getConnection().instanceUrl ? 'login' :
            page.url().includes(passwordChangeUrlIndicator) ? 'password' :
                page.url().includes(addPhoneNumberIndicator) ? 'phone' :
                    page.url().includes(homePageIndicator) ? 'home' :
                        'else';
        this.ux.log('state', this.state, page.url());
    }
    async resetPasswordWithRest(password) {
        const conn = this.org.getConnection();

        let usersResult = await conn.query(`SELECT Id FROM User WHERE Username = '${this.flags.testusername}'`);

        let user = usersResult.records[0];

        const setPassword = async (password) => {
            try {
                let url = conn.instanceUrl + `/services/data/v25.0/sobjects/User/${user.Id}/password`;

                await conn.request({
                    method: 'POST',
                    body: JSON.stringify({
                        'NewPassword': password
                    }),
                    url: url
                });

                return true;
            }
            catch (e) {
                return false;
            }
        }
        let requestResult = await setPassword(password);
    }

    async handleInitialLogin(page, password) {
        await page.goto(
            `${this.org.getConnection().instanceUrl}`,
            { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] }
        );

        this.ux.log('before set creds');

        await page.type('input.username', this.flags.testusername);
        await page.type('input.password', password);

        this.ux.log('after set creds');

        await page.click('input[type=submit]');

        // do something when password is already set.
        const loginError = '.logicError';
    }

    async handleChangePasswordPage(page, password1, password2) {
        const navigationPromise = page.waitForNavigation();
        await navigationPromise;
        await page.waitForSelector('input');

        this.ux.startSpinner(`Resetting password`);

        await page.type('input[name=currentpassword]', password1);
        await page.type('input[name=newpassword]', password2);
        await page.type('input[name=confirmpassword]', password2);
        await page.type('input[name=answer]', 'some answer');

        await page.waitForSelector('button[name=save]:not(:disabled)');
        await page.click('button[name=save]');

    }
}
