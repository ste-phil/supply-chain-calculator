export enum Browser {
    Chrome,
    EdgeChromium,
    Edge,
    Firefox,
    Opera,
    IE,
    Safari,
    Unknown
}

export class BrowserDetect {
    public static checkBrowser(): Browser {
        if (navigator.userAgent.search("MSIE")) {
            return Browser.IE;
        }
        //Check if browser is Chrome
        else if (navigator.userAgent.search("Chrome")) {
            return Browser.Chrome;
        }
        //Check if browser is Firefox 
        else if (navigator.userAgent.search("Firefox")) {
            return Browser.Firefox;
        }
        //Check if browser is Safari
        else if (navigator.userAgent.search("Safari")) {
            return Browser.Safari;
        }
        //Check if browser is Opera
        else if (navigator.userAgent.search("Opera")) {
            return Browser.Opera;
        }

        return Browser.Unknown;
    }
}