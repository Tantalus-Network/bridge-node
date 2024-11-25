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

    let blob = await client.Blob.Submit(
        [
            {
                namespace: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=",
                data: "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8=",
                share_version: 0,
                commitment: "aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=",
                index: -1,
            },
        ],
        0.002,
    );
    console.log(blob);

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
