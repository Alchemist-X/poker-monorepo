import { initialize } from "zokrates-js";
import fs from "fs";
import path from "path";

function addStringBasedOnPath(to) {
    if (to.startsWith("./")) {
        return './circuits/src/' + to;
    } else {
        return '/Users/jack/.zokrates/stdlib/' + to;
    }
}

async function main() {
    const zokratesProvider = await initialize();
    console.log(`${JSON.stringify(zokratesProvider)}`)

    const source = fs.readFileSync('./circuits/src/hand.zok', 'utf-8');
    // console.log(source);

    const fileSystemResolver = (from, to) => {
        console.log(from + " is importing " + to);
        const location = path.resolve(addStringBasedOnPath(to)) + ".zok";
        // console.log("location is " + location);
        const source = fs.readFileSync(location, 'utf-8');
        // console.log(source)
        return { source, location };
    };
    const options = {
        location: "root.zok", // location of the root module
        resolveCallback: fileSystemResolver,
    };
    const artifacts = zokratesProvider.compile(source, options);

    console.log(`Artifacts successfully generated`);

    const inputParams = [
        [["0x6", "0x5", "0x4", "0x3", "0x2", "0x1", "0x0"], ["0x6", "0x3", "0x2", "0x1", "0x0"]], // four of a kind
        [["51", "50", "23", "22", "6", "5", "4"], ["51", "50", "6", "5", "4"]], // hull house
        [["37", "29", "28", "24", "20", "16", "0"], ["28", "24", "20", "16", "0"]], // flush
        [["37", "33", "28", "24", "20", "17", "0"], ["37", "33", "28", "24", "20"]], // straight
        [["28", "26", "23", "16", "13", "6", "0"], ["28", "26", "23", "16", "13"]], // straight
        [["51", "40", "23", "22", "20", "5", "0"], ["51", "40", "23", "22", "20"]], // set
        [["51", "50", "23", "22", "6", "5", "0"], ["51", "50", "23", "22", "5"]], // two pair
        [["51", "50", "23", "19", "13", "6", "0"], ["51", "50", "23", "19", "13"]], // pair
        [["51", "40", "35", "30", "20", "10", "0"], ["51", "40", "35", "30", "20"]], // high card
    ]

    for (let i = 0; i < inputParams.length; i++) {
        console.log(`Computing wintness for inputParams[${i}]...`);
        const { witness, output } = zokratesProvider.computeWitness(artifacts, inputParams[i]);
        // console.log(witness); // Resulting witness which can be used to generate a proof
        console.log(output); // Computation output: "4"
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
