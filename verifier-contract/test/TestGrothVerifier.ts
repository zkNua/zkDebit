import { ethers } from "hardhat";
import { expect } from "chai";

import {
    Groth16Verifier
} from '../typechain-types';

// const Proofs : any= {
//     pi_a: [
//         '0x0b4a7f165282eed6455ea2d6a437c29513eaa6468f4eda069f296362839388d0',
//         '0x1fef6442786ebb519e6ea5ea1db0434440321ca0ae15ce6dfdc24ceb93595da5'
//       ],
//       pi_b: [
//         [
//           '0x15c7552c3bc13ed50ba72bbf021255a895c7efb31a6cd2a7b698548b7ba57151',
//           '0x25dbf818f7d77ac4260c7ec5ee0fa61daedc9600b31a8ceff297a05531fb124a'
//         ],
//         [
//           '0x1aa5bbe30453e0cea39b234a96bca1ae24228b6b8141b315b6afc50f9af548fe',
//           '0x205ca0632c5d0cdcf5d54b0fa3d9728aa39a8f03d183378508d5e144f4a65525'
//         ]
//       ],
//       pi_c: [
//         '0x09cb4470f9fd2729047fd61035c5acb164a800f731ebf87631223234e68c5888',
//         '0x2775ae6dbd0795ff7e865a94d4da02ff00a2745d622367f41de75bcb80251c0e'
//       ],
//       public: [
//         '0x0264cf405a5819f06288fa6bcd21ed0e42e5087a3e11ada70111b98a53fc04b3',
//         '0x0818778885ddd33d7327126e04ca0d8a9708b1c760e58374fcfd8bad14a92784',
//         '0x1fbecfd87d0cdd9a90214add7fc074a49b50c692c4f641f59ba1ab160b8f0849'
//       ]
// };

const proof :any = {
    "pi_a": [
      "0x2da1d0e51fb2e86818c204893fb7143144aa85a05bdf75b6ace38b81d85a380a",
      "0x00ac5dfac59fd43001b6c847c04b3f802cef4345ed2a9d1795559afd14c8136f"
    ],
    "pi_b": [
      [
        "0x035d81e5ef5199abd4fc52a872826970028ead4060eca8dc7c56927162ad8e60",
        "0x001224a9e23677785357ed1e06a75d597fbd0ec0f0843e4f8aa5be16ab9d5d71"
      ],
      [
        "0x2dce56926316a3fbe2f3045bbf7acb76fc4418b351893d4dd4211754d2d49c4e",
        "0x27c7c11070029b2361f2355092d67d2ba83c37c7c7062bd834a530d4582e93cd"
      ]
    ],
    "pi_c": [
      "0x282d17d9b9d2db067af70d85f864c19b6a1d832739893eebe92427c946335879",
      "0x12595458e07ce5e26b96c26aef19f7a198013f1d76058547e742a1320d0eca13"
    ],
    "public": [
      "0x21ca69d01e33d961bd82d57b225fba692657b2dcbd094c75c8b8ba6faa481f65",
      "0x02f91b1036fa5a3e587b7da89d792b7e631c32cabf2179ddd00ef5322dc9115c",
      "0x1fbecfd87d0cdd9a90214add7fc074a49b50c692c4f641f59ba1ab160b8f0849"
    ]
  }

describe("CardVerifier",function (){
    let cardVerifier : Groth16Verifier; 
    let admin1 : any; 
    let admin2 : any;
    let user : any;

    beforeEach("Deploying contract",async function (){
        [admin1 , admin2, user] = await ethers.getSigners();
        const deployer = await ethers.getSigners();
        console.log(`Deploying contracts with the account: ${deployer[1].address}`);

        // Deploy the ICardVerifier mock contract
        const CardVerifier = await ethers.getContractFactory("Groth16Verifier",admin1);
        cardVerifier = (await CardVerifier.deploy()) as unknown as Groth16Verifier;
        await cardVerifier.waitForDeployment();
        console.log("CardVerifier deployed at:", await cardVerifier.getAddress());
    })

    it("Proof should valid computation & should stored to prover wallet",async function (){

        const response = await cardVerifier.verifyProof(
          proof.pi_a,
          proof.pi_b,
          proof.pi_c,
          proof.public
        );
        console.log(response)
    })
})