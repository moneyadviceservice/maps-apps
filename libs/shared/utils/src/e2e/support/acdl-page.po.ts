export enum ACDLEventTypes {
  TOOL_START = 'toolStart',
  PAGE_LOAD = 'pageLoadReact',
  ERROR_MESSAGE = 'errorMessage',
  TOOL_COMPLETION = 'toolCompletion',
  TOOL_COMPLETION_NO_INPUT = 'toolCompletionNoInput',
}

export type AdobeDataLayerEntry = {
  event?: ACDLEventTypes;
  eventInfo?: any;
  page?: {
    url: string;
  };
  tool?: Record<string, string>;
  user?: Record<string, string>;
};

export class ACDLPage {
  private _acdlRetries = 0;

  waitOnBackJourney() {
    cy.wait(500);
  }

  resetACDLRetries() {
    this._acdlRetries = 0;
  }

  validateDataLayerEvent(
    url: string,
    adobeDataLayer: AdobeDataLayerEntry[],
    event: ACDLEventTypes,
    entries: Record<string, any>,
    hasUserDetails?: boolean,
  ) {
    const currentEntry = adobeDataLayer.find((entry) => {
      if (event === ACDLEventTypes.PAGE_LOAD) {
        return entry.event === event && entry.page?.url === url;
      }
      return entry.event === event;
    });

    try {
      if (hasUserDetails) {
        expect(currentEntry?.user).to.have.ownProperty('userId');
      }

      if (event === ACDLEventTypes.ERROR_MESSAGE) {
        expect(currentEntry?.eventInfo).to.deep.equal(
          entries[`${event}|${url}`]?.eventInfo,
        );
      } else {
        expect(currentEntry?.page).to.deep.equal(
          entries[`${event}|${url}`]?.page,
        );
        expect(currentEntry?.tool).to.deep.equal(
          entries[`${event}|${url}`]?.tool,
        );
      }
      this.resetACDLRetries();
    } catch (err) {
      cy.task(
        'log',
        `\x1b[41mACDL FAILURE\x1b[0m - Failed to validate ACDL for event \x1b[34m${event}\x1b[0m on page \x1b[34m${url}\x1b[0m`,
      );
      if (this._acdlRetries < 5) {
        this.waitOnBackJourney();
        this._acdlRetries++;
        this.validateAdobeDataLayer([event], entries);
        return;
      }
      console.log(currentEntry);
      throw err;
    }
  }

  validateAdobeDataLayer(
    events: ACDLEventTypes[],
    entries: Record<string, unknown>,
    hasUserDetails?: boolean,
  ) {
    cy.url().then((url) => {
      cy.window()
        .its('adobeDataLayer')
        .should('exist')
        .then((adobeDataLayer: AdobeDataLayerEntry[]) => {
          events.forEach((event) =>
            this.validateDataLayerEvent(
              url,
              adobeDataLayer,
              event,
              entries,
              hasUserDetails,
            ),
          );
        });
    });
  }
}
