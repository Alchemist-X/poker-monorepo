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

    const source = fs.readFileSync('./circuits/src/rng.zok', 'utf-8');
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
        ["17", "23"], // four of a kind
        ["127", "323"], // four of a kind
        ["517", "923"], // four of a kind
        ["1217", "1823"], // four of a kind
        ["13417", "12223"], // four of a kind
        ["121217", "999923"], // four of a kind
    ]

    for (let i = 0; i < inputParams.length; i++) {
        console.log(`Computing wintness for inputParams[${i}]...`);
        const { witness, output } = zokratesProvider.computeWitness(artifacts, inputParams[i]);
        // console.log(witness); // Resulting witness which can be used to generate a proof
        const o = JSON.parse(output);
        console.log(o);
        for (let j = 0; j < o.length; j++) {
            console.log(BigInt(o[j]).toString());
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
