import { Client } from "cntsc";
import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    maxRetriesPerRequest: null,
});
const client: Client = new Client("http://localhost:26658", "");

async function main() {
    let header = await client.Header.LocalHead();
    console.log(header);

    const myQueue = new Queue("myqueue", { connection });
    const myWorker = new Worker(
        "myqueue",
        async (job) => {
            console.log("JOB:", job.data);
        },
        { connection },
    );
    const queueEvents = new QueueEvents("myqueue", { connection });

    await myQueue.add("myJobName", { foo: "bar" });
    await myQueue.add("myJobName", { qux: "baz" });

    myWorker.on("completed", (job) => {
        console.log(`${job.id} has completed!`);
    });
    myWorker.on("failed", (job, err) => {
        console.log(`${job ? job.id : "Job"} has failed with ${err.message}`);
    });

    queueEvents.on("waiting", ({ jobId }) => {
        console.log(`A job with ID ${jobId} is waiting`);
    });
    queueEvents.on("active", ({ jobId, prev }) => {
        console.log(`Job ${jobId} is now active; previous status was ${prev}`);
    });
    queueEvents.on("completed", ({ jobId, returnvalue }) => {
        console.log(`${jobId} has completed and returned ${returnvalue}`);
    });
    queueEvents.on("failed", ({ jobId, failedReason }) => {
        console.log(`${jobId} has failed with reason ${failedReason}`);
    });
}

main();
