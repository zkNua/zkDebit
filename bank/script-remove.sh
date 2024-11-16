#!/bin/bash

# List of files and directories to remove
FILES=(
    setup.r1cs
    setup_js
    verification_js
    powersOfTau28_hez_final_12.ptau
    setup_0000.zkey
    setup_proof.json
    setup_publicSignals.json
    setup_verification_key.json
    setup.sym
    verification_0000.zkey
    verification_proof.json
    verification_publicSignals.json
    verification_verification_key.json
    verification.r1cs
    verification.sym
    cardSetup_js
    cardVerification_js
    cardSetup_0000.zkey
    cardSetup_proof.json
    cardSetup_public.json
    cardSetup_verification_key.json
    cardSetup_witness.wtns
    cardSetup.sym
    cardSetup.r1cs
    cardVerification_0000.zkey
    cardVerification_proof.json
    cardVerification_public.json
    cardVerification_verification_key.json
    cardVerification_witness.wtns
    cardVerification.r1cs
    cardVerification.sym
)

# Remove each file or directory
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "Removing $file"
        rm -rf "$file"
    else
        echo "$file does not exist"
    fi
done

echo "Cleanup complete!"