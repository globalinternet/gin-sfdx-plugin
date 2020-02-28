import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

const mapSharingLabel = new Map([
  ['sharingRule', 'Sharing Rule'],
  ['groupMembership', 'Group Membership']
]);

export default class Suspend extends SfdxCommand {
  public static description = 'Suspend/Enable sharing calculation';

  public static examples = [
    '$ sfdx gin:sharing:suspend" \nSharing calculations suspended\n'
  ];

  protected static flagsConfig = {
    scope: flags.string({
      char: 's',
      description: 'scope...',
      required: false,
      options: ['sharingRule', 'groupMembership'],
      default: 'sharingRule'
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static requiresDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> {
    const result = {};

    await this.suspendSharingCalc();

    return result;
  }

  private async suspendSharingCalc() {
    const instanceUrl = this.org.getConnection().instanceUrl;

    const SHARING_CALC_PATH = '/p/own/DeferSharingSetupPage';

    this.ux.startSpinner(`Suspending ${mapSharingLabel.get(this.flags.scope)} Calculations`);
    this.debug('DEBUG Login to Org');

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: !(process.env.BROWSER_DEBUG === 'true')
    });
    const page = await browser.newPage();
    await page.goto(
      `${instanceUrl}/secur/frontdoor.jsp?sid=${
        this.org.getConnection().accessToken
      }&startURL=${encodeURIComponent(SHARING_CALC_PATH)}`,
      { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] }
    );
    const navigationPromise = page.waitForNavigation();
    await navigationPromise;

    this.debug('DEBUG Opening Defer Sharing Calculations page');

    await page.goto(`${instanceUrl + SHARING_CALC_PATH}`);
    await navigationPromise;

    this.debug("DEBUG Clicking 'Suspend' button");

    // Suspend either Group Membership or Sharing Rules
    if (this.flags.scope === 'groupMembership') {
      page.on('dialog', dialog => {
        dialog.accept();
      });

      await page.click(
        '#gmSect > .pbBody > .pbSubsection > .detailList > tbody > .detailRow > td > .btn'
      );
    } else {
      await page.click(
        '#ep > .pbBody > .pbSubsection > .detailList > tbody > .detailRow > td > .btn'
      );
    }

    await navigationPromise;

    this.debug('DEBUG Closing browser');

    await browser.close();

    this.ux.stopSpinner('Done.');

    return { message: `Suspended ${mapSharingLabel.get(this.flags.scope)} Calculations` };
  }
}
