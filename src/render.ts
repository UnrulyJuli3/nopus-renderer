import type { RenderPayload } from "./types";
import puppeteer from "puppeteer";

declare global {
    interface Window {
        render: (payload: any) => Promise<IRenderResponse>;
    }
}

interface IRenderResponse {
    ok: boolean;
    error?: string;
}

/**
 * @param payload Song info and player performance data produced by the game.
 * @param audioPath The path to the backing track for this song.
 * @returns The rendered performances with the backing track.
 */
export const render = async (payload: RenderPayload, audioPath: string): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    }),
        page = await browser.newPage();

    console.log("upgrading max buffer size");

    // @ts-ignore
    await page._client().send("Network.enable", {
        maxResourceBufferSize: 1024 * 1204 * 800,
        maxTotalBufferSize: 1024 * 1204 * 800,
    });

    page.on("console", message => console.log(`[render] ${message.text()}`));

    await page.goto("https://main.d24r7n58nswuti.amplifyapp.com/");

    console.log("starting render");

    const promise = new Promise<Buffer>(resolve => page.on("response", async res => {
        if (res.request().headers().nopus) {
            console.log(`retrieving ${res.url()}`);
            resolve(await res.buffer());
        }
    }));

    await (await page.$("input")).uploadFile(audioPath);

    const res = await page.evaluate(payload => window.render(payload), payload);

    if (!res.ok) throw new Error(res.error);

    const buffer = await promise;

    await browser.close();

    return buffer;
};