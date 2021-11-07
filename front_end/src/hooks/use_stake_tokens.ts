import { useEthers, useContractFunction } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import ERC20 from "../chain-info/contracts/MockFAU.json";
import { useState, useEffect } from "react";

export const useStakeTokens = (tokenAddress: string) => {
    const { chainId } = useEthers();
    const { abi } = TokenFarm;
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)].TokenFarm[0] : constants.AddressZero;

    const tokenFarmInterface = new utils.Interface(abi);
    const farmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

    const erc20ABI = ERC20.abi;
    const erc20I = new utils.Interface(erc20ABI);
    const erc20Contract = new Contract(tokenAddress, erc20I);

    const { send: approveTokenSend, state: approveAndStakeTokenState } = useContractFunction(
        erc20Contract, "approve", { transactionName: "Approve Token Transfer"}
    );

    const approveAndStake = (amount: string) => {
        setAmountToStake(amount);
        return approveTokenSend(tokenFarmAddress, amount);
    };

    const { send: stakeSend, state: stakeState } = useContractFunction(farmContract, "stakeTokens", { transactionName: "Stake Tokens" });

    const [ amountToStake, setAmountToStake ] = useState("0");

    useEffect(() => {
        if(approveAndStakeTokenState.status === "Success") {
            stakeSend(amountToStake, tokenAddress)

        }
    }, [approveAndStakeTokenState, amountToStake, tokenAddress]);

    const [ state, setState ] = useState(approveAndStakeTokenState);

    useEffect(() => {
        if (approveAndStakeTokenState.status === "Success") {
            setState(stakeState);
        } else {
            setState(approveAndStakeTokenState);
        }
    }, [approveAndStakeTokenState, stakeState]);

    return { approveAndStake, state };
};