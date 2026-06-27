# building-secure-contracts

Smart contract security toolkit and blockchain audit guidance.

## When to use
When writing or reviewing Solidity smart contracts, or preparing for a formal audit.

## Security checklist
- [ ] Reentrancy: use checks-effects-interactions pattern or ReentrancyGuard
- [ ] Integer overflow: use Solidity 0.8+ or SafeMath
- [ ] Access control: all privileged functions use onlyOwner or role-based access
- [ ] Front-running: commit-reveal or time-weighted patterns where needed
- [ ] Oracle manipulation: use TWAP, not spot price
- [ ] Signature replay: include chainId and nonce in signed data
- [ ] Upgradability: storage collision checked, initializer protected
- [ ] Gas limits: no unbounded loops that can cause DoS

## Tools
- Slither: static analysis
- Echidna: fuzzing
- Foundry: unit tests with forge
- MythX: deeper symbolic analysis

## Source
Trail of Bits (trailofbits/skills)
