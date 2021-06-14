import * as tmi from "tmi.js";
import * as cluster from "cluster";

// TODO: implement multi process

export function processClusterMessage(target: string, sender: tmi.Userstate, msg: string, isSelf: boolean) {
    if (isSelf) return;

    // Fork workers.
    // handleMessage(target, msg)
    // will be automatically queued for execution, but dont exaggerate here
    cluster.fork({ MSG: msg, CHANNEL: target, CONTEXT: JSON.stringify(sender) });
}
