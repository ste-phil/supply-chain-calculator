export default class CustomEvents {
    public static onPress(btn: EventTarget, action: Function, delay = 300, speedup = 1.5, minDelay = 5): void {
        let t: number;

        const repeat = function () {
            action();
            t = setTimeout(repeat, delay);
            delay = Math.max(delay / speedup, minDelay)
        }

        function cleanup() {
            clearTimeout(t);
            btn.removeEventListener("mouseup", cleanup);
        }
            
        btn.addEventListener("mouseup", cleanup);
        repeat();
    }
}